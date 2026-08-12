import { login, signup } from './actions'
import RegisterForm from './RegisterForm'
import LoginForm from './LoginForm'
import MessageToast from './MessageToast'
import { Suspense } from 'react'
interface LoginPageProps {
  searchParams: Promise<{ message?: string; tab?: string }>
}

export const metadata = {
  title: 'Masuk | Portal Aplikasi',
  description: 'Login ke akun Anda untuk mengakses dashboard.',
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { message, tab } = await searchParams
  const isRegister = tab === 'register'

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0B1120] p-4 sm:p-8 relative overflow-hidden">
      {/* Premium Glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -right-[10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[25%] -left-[10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-[420px] z-10">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl mb-5 shadow-[0_0_40px_rgba(37,99,235,0.3)] transform transition-transform hover:scale-105 duration-300">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Portal Aplikasi</h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">Sistem manajemen cerdas & aman</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative group">
          
          {/* Subtle gradient border effect on hover */}
          <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-white/5 transition-colors duration-500 pointer-events-none" />

          {/* Tab Navigation */}
          <div className="flex bg-slate-800/50 rounded-2xl p-1.5 mb-8 border border-white/5">
            <a
              href="/login"
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl text-center transition-all duration-300 ${
                !isRegister
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Masuk
            </a>
            <a
              href="/login?tab=register"
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl text-center transition-all duration-300 ${
                isRegister
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Daftar
            </a>
          </div>

          {/* Login Form */}
          {!isRegister && <LoginForm loginAction={login} />}

          {/* Register Form */}
          {isRegister && <RegisterForm signupAction={signup} />}

          <Suspense fallback={null}>
            <MessageToast />
          </Suspense>
        </div>

        <p className="text-center text-slate-500 text-xs mt-8 font-medium">
          Dilindungi dengan enkripsi canggih | Mochamad Rafly Nurrizky
        </p>
      </div>
    </main>
  )
}
