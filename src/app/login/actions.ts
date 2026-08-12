'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { loginSchema, signupSchema, forgotPasswordSchema, updatePasswordSchema } from '@/lib/validations'
import { logActivity } from '@/lib/logger'

import { cookies } from 'next/headers'

// Generic safe error message - never reveal specifics
const SAFE_ERROR = 'Email tidak terdaftar atau kata sandi salah!'

export async function login(formData: FormData) {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Rate Limiting (5 times) using cookies
  const cookieStore = await cookies()
  const attemptsStr = cookieStore.get('login_attempts')?.value
  const lockoutTimeStr = cookieStore.get('login_lockout')?.value

  if (lockoutTimeStr) {
    const lockoutTime = parseInt(lockoutTimeStr, 10)
    if (Date.now() < lockoutTime) {
      const minutesLeft = Math.ceil((lockoutTime - Date.now()) / 60000)
      return { error: `Terlalu banyak percobaan. Tunggu ${minutesLeft} menit lagi.` }
    } else {
      cookieStore.delete('login_lockout')
      cookieStore.delete('login_attempts')
    }
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
    // Increment attempts
    const attempts = attemptsStr ? parseInt(attemptsStr, 10) + 1 : 1
    cookieStore.set('login_attempts', attempts.toString(), { maxAge: 3600 })
    
    if (attempts >= 5) {
      // Lock for 5 minutes
      const lockoutExpiry = Date.now() + 5 * 60 * 1000
      cookieStore.set('login_lockout', lockoutExpiry.toString(), { maxAge: 5 * 60 })
      cookieStore.set('login_attempts', '0', { maxAge: 3600 })
      return { error: 'Terlalu banyak percobaan gagal. Silakan tunggu 5 menit.' }
    }

    // Log failed attempt without exposing reason
    await logActivity(null, 'LOGIN_FAILED', { email: parsed.data.email })
    return { error: SAFE_ERROR }
  }

  // Success: clear attempts
  cookieStore.delete('login_attempts')
  cookieStore.delete('login_lockout')

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
    redirect(`/forgot-password?message=${encodeURIComponent('Gagal mengirim email. Coba lagi beberapa saat.')}`)  
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
    redirect('/update-password?message=Gagal memperbarui kata sandi. Silakan minta link reset baru.')
  }

  if (user) {
    await logActivity(user.id, 'PASSWORD_UPDATED', {})
  }

  redirect('/login?message=Kata sandi berhasil diperbarui. Silakan masuk.')
}
