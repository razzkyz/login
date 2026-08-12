'use client'

import { useState, useRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const inputClass = "w-full bg-slate-950/50 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"

interface RegisterFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signupAction: (formData: FormData) => Promise<any>
}

export default function RegisterForm({ signupAction }: RegisterFormProps) {
  const [confirmError, setConfirmError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setConfirmError('')

    const form = e.currentTarget
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    const confirmPassword = (form.elements.namedItem('confirm_password') as HTMLInputElement).value

    if (password !== confirmPassword) {
      setConfirmError('Kata sandi tidak cocok. Silakan coba lagi.')
      return
    }

    // Submit via server action
    const formData = new FormData(form)
    signupAction(formData)
  }

  return (
    <form
      id="register-form"
      className="space-y-5"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      {/* Nama Lengkap */}
      <div className="space-y-1.5">
        <label htmlFor="register-name" className="block text-sm font-medium text-slate-300 pl-1">
          Nama Lengkap
        </label>
        <input
          id="register-name"
          name="full_name"
          type="text"
          required
          autoComplete="name"
          placeholder="John Doe"
          className={inputClass}
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="register-email" className="block text-sm font-medium text-slate-300 pl-1">
          Email
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="anda@contoh.com"
          className={inputClass}
        />
      </div>

      {/* Kata Sandi */}
      <div className="space-y-1.5">
        <label htmlFor="register-password" className="block text-sm font-medium text-slate-300 pl-1">
          Kata Sandi
        </label>
        <div className="relative">
          <input
            id="register-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="new-password"
            placeholder="Min. 8 karakter (A-Z, 0-9)"
            className={`${inputClass} pr-12`}
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

      {/* Konfirmasi Kata Sandi */}
      <div className="space-y-1.5">
        <label htmlFor="register-confirm-password" className="block text-sm font-medium text-slate-300 pl-1">
          Konfirmasi Kata Sandi
        </label>
        <div className="relative">
          <input
            id="register-confirm-password"
            name="confirm_password"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            autoComplete="new-password"
            placeholder="Ulangi kata sandi"
            className={`${inputClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {confirmError && (
          <p className="text-rose-400 text-xs font-medium pl-1 mt-1">{confirmError}</p>
        )}
      </div>

      <button
        id="register-submit"
        type="submit"
        className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] active:scale-[0.98]"
      >
        Buat Akun Baru
      </button>
    </form>
  )
}
