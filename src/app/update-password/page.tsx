import { updatePassword } from '../login/actions'
import Link from 'next/link'

export const metadata = {
  title: 'Perbarui Kata Sandi | Portal Aplikasi',
}

interface Props {
  searchParams: Promise<{ message?: string }>
}

export default async function UpdatePasswordPage({ searchParams }: Props) {
  const { message } = await searchParams

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Buat Kata Sandi Baru</h1>
          <p className="text-slate-400 text-sm mt-1">Masukkan kata sandi baru yang kuat untuk akun Anda.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form id="update-password-form" className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Kata Sandi Baru
              </label>
              <input
                id="new-password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Min. 8 karakter, 1 huruf besar, 1 angka"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Minimal 8 karakter, mengandung huruf besar dan angka.
              </p>
            </div>
            <button
              id="update-password-submit"
              formAction={updatePassword}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 active:scale-95"
            >
              Perbarui Kata Sandi
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-4 rounded-xl text-sm text-center ${
              message.toLowerCase().includes('berhasil')
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
              ← Kembali ke halaman masuk
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
