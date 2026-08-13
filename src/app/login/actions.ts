'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { loginSchema, signupSchema, forgotPasswordSchema, updatePasswordSchema } from '@/lib/validations'
import { logActivity } from '@/lib/logger'

import { cookies } from 'next/headers'

// In-memory store for rate limiting (For production, use Redis or Database)
const rateLimitMap = new Map<string, { attempts: number; lockUntil: number }>()

// Generic safe error message - never reveal specifics
const SAFE_ERROR = 'Email tidak terdaftar atau kata sandi salah!'

export async function login(formData: FormData) {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Server-side Rate Limiting (berbasis memori untuk demo, idealnya pakai Redis/DB)
  const clientIP_or_Email = raw.email // Menggunakan email sebagai identifier (bisa juga IP jika tersedia di headers)
  const rateLimit = rateLimitMap.get(clientIP_or_Email) || { attempts: 0, lockUntil: 0 }

  if (rateLimit.lockUntil > Date.now()) {
    const minutesLeft = Math.ceil((rateLimit.lockUntil - Date.now()) / 60000)
    return { error: `Terlalu banyak percobaan. Tunggu ${minutesLeft} menit lagi.` }
  } else if (rateLimit.lockUntil !== 0 && rateLimit.lockUntil <= Date.now()) {
    rateLimit.attempts = 0
    rateLimit.lockUntil = 0
  }

  // Server-side validation
  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Input tidak valid'
    return { error: firstError }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    // Increment attempts server-side
    rateLimit.attempts += 1
    
    if (rateLimit.attempts >= 5) {
      // Lock for 5 minutes
      rateLimit.lockUntil = Date.now() + 5 * 60 * 1000
      rateLimitMap.set(clientIP_or_Email, rateLimit)
      return { error: 'Terlalu banyak percobaan gagal. Silakan tunggu 5 menit.' }
    }
    
    rateLimitMap.set(clientIP_or_Email, rateLimit)

    // Log failed attempt without exposing reason
    await logActivity(null, 'LOGIN_FAILED', { email: parsed.data.email })
    return { error: SAFE_ERROR }
  }

  // Success: clear attempts
  rateLimitMap.delete(clientIP_or_Email)

  // Log successful login dan cek role secara bersamaan (Paralel untuk mengurangi lag)
  const [_, { data: profile }] = await Promise.all([
    logActivity(data.user.id, 'LOGIN_SUCCESS', { email: data.user.email }),
    supabase.from('profiles').select('role').eq('id', data.user.id).single()
  ])

  const destination = profile?.role === 'admin' ? '/admin' : '/dashboard'

  revalidatePath('/', 'layout')
  redirect(destination)
}
export async function signup(formData: FormData) {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    full_name: formData.get('full_name') as string,
  }

  const parsed = signupSchema.safeParse(raw)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Input tidak valid'
    redirect(`/login?tab=register&message=${encodeURIComponent(firstError)}`)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.full_name,
      },
    },
  })

  if (error) {
    console.error("SUPABASE SIGNUP ERROR:", error);
    await logActivity(null, 'REGISTER_FAILED', { email: parsed.data.email })
    redirect(`/login?tab=register&message=${encodeURIComponent(`Gagal mendaftar: ${error.message}`)}`)
  }

  if (data.user) {
    await logActivity(data.user.id, 'REGISTER_SUCCESS', { email: data.user.email })
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Pendaftaran berhasil! Silakan periksa email Anda untuk konfirmasi.')
}

export async function logout() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await logActivity(user.id, 'LOGOUT', { email: user.email })
  }

  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function forgotPassword(formData: FormData) {
  const raw = { email: formData.get('email') as string }

  const parsed = forgotPasswordSchema.safeParse(raw)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Email tidak valid'
    redirect(`/forgot-password?message=${encodeURIComponent(firstError)}`)
  }

  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/auth/callback?next=/update-password`,
  })

  if (error) {
    console.error('Reset password error:', error.message)
    redirect(`/forgot-password?message=${encodeURIComponent(`Gagal: ${error.message}`)}`)  
  }

  await logActivity(null, 'PASSWORD_RESET_REQUESTED', { email: parsed.data.email })
  redirect(`/forgot-password?message=${encodeURIComponent('Link reset telah dikirim! Silakan cek inbox atau folder Spam email Anda.')}`)    
}

export async function updatePassword(formData: FormData) {
  const raw = { password: formData.get('password') as string }

  const parsed = updatePasswordSchema.safeParse(raw)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Kata sandi tidak valid'
    redirect(`/update-password?message=${encodeURIComponent(firstError)}`)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })

  if (error) {
    redirect(`/update-password?message=${encodeURIComponent(`Gagal: ${error.message}`)}`)
  }

  if (user) {
    await logActivity(user.id, 'PASSWORD_UPDATED', {})
  }

  redirect('/login?message=Kata sandi berhasil diperbarui. Silakan masuk.')
}
