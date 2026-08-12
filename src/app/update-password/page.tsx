'use client'

import { useState } from 'react'
import { updatePassword } from '../login/actions'
import Link from 'next/link'
import { KeyRound, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'

export default function UpdatePasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)

    try {
      await updatePassword(formData)
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
        const url = (err as { digest?: string }).digest || ''
        const redirectUrl = url.split(';').pop() || ''
        
        let actualMessage = ''
        try {
          const urlObj = new URL(redirectUrl, 'http://localhost')
          actualMessage = urlObj.searchParams.get('message') || ''
        } catch { }

        // If redirecting to login, it means success
        if (redirectUrl.includes('/login')) {
          // Note: Next.js will actually redirect the page, so this might not stay long
          setMessage({ text: actualMessage || 'Kata sandi berhasil diperbarui.', type: 'success' })
        } else {
          setMessage({ text: actualMessage || 'Gagal memperbarui kata sandi. Silakan minta link reset baru.', type: 'error' })
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl mb-4 shadow-lg shadow-blue-500/30 transform transition-transform hover:scale-105 duration-300">
            <KeyRound className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Buat Kata Sandi Baru</h1>
          <p className="text-slate-400 text-sm mt-1">Masukkan kata sandi baru yang kuat untuk akun Anda.</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {message && message.type === 'error' ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <AlertCircle className="w-12 h-12 text-rose-400" />
              <p className="text-sm font-medium text-rose-400">{message.text}</p>
              <Link 
                href="/forgot-password"
                className="mt-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200"
              >
                Minta Link Reset Baru
              </Link>
            </div>
          ) : (
            <form id="update-password-form" className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-slate-300 mb-1.5 pl-1">
                  Kata Sandi Baru
                </label>
                <input
                  id="new-password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="Min. 8 karakter, 1 huruf besar, 1 angka"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
                <p className="mt-1.5 text-xs text-slate-500 pl-1">
                  Minimal 8 karakter, mengandung huruf besar dan angka.
                </p>
              </div>
              <button
                id="update-password-submit"
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
                    Memperbarui...
                  </span>
                ) : 'Perbarui Kata Sandi'}
              </button>
            </form>
          )}

          {message && message.type === 'success' && (
            <div className="mt-6 p-4 rounded-xl text-sm font-medium text-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {message.text}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200 flex items-center justify-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke halaman masuk
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
