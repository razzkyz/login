'use client'

import { useState } from 'react'
import { forgotPassword } from '../login/actions'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)

    try {
      await forgotPassword(formData)
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
        // Redirect is normal — extract message from URL manually
        const url = (err as { digest?: string }).digest || ''
        if (url.includes('Gagal')) {
          setMessage({ text: 'Gagal mengirim email. Coba lagi beberapa saat.', type: 'error' })
        } else {
          setMessage({ text: 'Link reset telah dikirim! Silakan cek inbox atau folder Spam email Anda.', type: 'success' })
        }
      } else {
        setMessage({ text: 'Link reset telah dikirim! Silakan cek inbox atau folder Spam email Anda.', type: 'success' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0B1120] p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -right-[10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[25%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/15 rounded-full mix-blend-screen filter blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-[420px] z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl mb-5 shadow-[0_0_40px_rgba(37,99,235,0.3)]">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
            Lupa Kata Sandi?
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">
            Kami kirimkan link reset ke email Anda.
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {message ? (
            <div className={`flex flex-col items-center gap-4 py-4 text-center`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-12 h-12 text-emerald-400" />
              ) : (
                <AlertCircle className="w-12 h-12 text-rose-400" />
              )}
              <p className={`text-sm font-medium ${message.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {message.text}
              </p>
              <button
                onClick={() => setMessage(null)}
                className="text-xs text-slate-400 hover:text-white transition-colors mt-2 underline"
              >
                Coba email lain
              </button>
            </div>
          ) : (
            <form id="forgot-password-form" className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label htmlFor="forgot-email" className="block text-sm font-medium text-slate-300 pl-1">
                  Email Terdaftar
                </label>
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="anda@contoh.com"
                  className="w-full bg-slate-950/50 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                />
              </div>
              <button
                id="forgot-password-submit"
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Mengirim...
                  </span>
                ) : 'Kirim Link Reset'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200 flex items-center justify-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke halaman masuk
            </Link>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-8 font-medium">
          Dilindungi dengan enkripsi AES-256 & Supabase Auth
        </p>
      </div>
    </main>
  )
}
