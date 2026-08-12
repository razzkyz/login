'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

interface LoginFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loginAction: (formData: FormData) => Promise<{ error?: string } | any>
}

export default function LoginForm({ loginAction }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const result = await loginAction(formData)
      if (result?.error) {
        toast.error(result.error, {
          style: { borderRadius: '12px', background: '#1e293b', color: '#fff', border: '1px solid #334155' },
        })
      } else {
        toast.success('Login berhasil! Mengalihkan...', {
          style: { borderRadius: '12px', background: '#1e293b', color: '#fff', border: '1px solid #334155' },
          iconTheme: { primary: '#22c55e', secondary: '#fff' },
        })
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
        throw err // Biarkan Next.js menangani redirect
      }
      toast.error('Terjadi kesalahan jaringan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form id="login-form" className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <label htmlFor="login-email" className="block text-sm font-medium text-slate-300 pl-1">
          Email
        </label>
        <div className="relative">
          <input
            id="login-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="anda@contoh.com"
            className="w-full bg-slate-950/50 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
          />
        </div>
      </div>
      
      <div className="space-y-1.5">
        <div className="flex justify-between items-center pl-1 pr-1">
          <label htmlFor="login-password" className="block text-sm font-medium text-slate-300">
            Kata Sandi
          </label>
          <a href="/forgot-password" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
            Lupa sandi?
          </a>
        </div>
        <div className="relative">
          <input
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full bg-slate-950/50 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      <button
        id="login-submit"
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] active:scale-[0.98] disabled:opacity-50"
      >
        {isLoading ? 'Memproses...' : 'Masuk ke Akun'}
      </button>
    </form>
  )
}
