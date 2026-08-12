import { forgotPassword } from '../login/actions'
import Link from 'next/link'

export const metadata = {
  title: 'Lupa Kata Sandi | Portal Aplikasi',
}

interface Props {
  searchParams: Promise<{ message?: string }>
}

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { message } = await searchParams

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0B1120] p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -right-[10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[25%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/15 rounded-full mix-blend-screen filter blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-[420px] z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl mb-5 shadow-[0_0_40px_rgba(37,99,235,0.3)] transform transition-transform hover:scale-105 duration-300">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Lupa Kata Sandi?</h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">Kami kirimkan link reset ke email Anda.</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <form id="forgot-password-form" className="space-y-5">
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
              formAction={forgotPassword}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] active:scale-[0.98]"
            >
              Kirim Link Reset
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-xl text-sm font-medium text-center border ${
              message.toLowerCase().includes('dikirim') || message.toLowerCase().includes('terdaftar')
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200">
              ← Kembali ke halaman masuk
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
