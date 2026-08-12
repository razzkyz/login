export const dynamic = 'force-dynamic'
export const revalidate = 0

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '../login/actions'
import { getUserLogs } from '@/lib/logger'
import MarketWidget from '@/components/MarketWidget'
import Link from 'next/link'
import { LayoutDashboard, ShieldCheck, Shield, Activity, FolderOpen, LogOut, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Dashboard | Portal Aplikasi',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const logs = await getUserLogs(user.id)
  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0]
  const initials = displayName?.substring(0, 2).toUpperCase()
  const isAdmin = profile?.role === 'admin'

  return (
    <div className="min-h-screen bg-[#0B1120]">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-500/5 rounded-full filter blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-slate-900/70 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold tracking-tight hidden sm:block">Portal Aplikasi</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-3 py-1.5 transition-all duration-200 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Panel Admin
                </Link>
              )}
              {/* Avatar */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">{initials}</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-white text-sm font-semibold leading-tight">{displayName}</p>
                  <p className="text-slate-400 text-xs capitalize">{profile?.role || 'user'}</p>
                </div>
              </div>
              <form action={logout}>
                <button
                  id="logout-button"
                  className="text-xs sm:text-sm text-slate-400 hover:text-white bg-transparent hover:bg-slate-800 rounded-lg px-3 py-1.5 transition-all duration-200 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Keluar
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">

        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8">
          <div className="relative">
            <p className="text-slate-400 text-sm font-medium mb-1">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
              Halo, {displayName}
            </h1>
            <p className="text-slate-400 text-sm">
              Login sebagai{' '}
              <span className={`font-semibold capitalize px-2 py-0.5 rounded-lg text-xs ${isAdmin ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'}`}>
                {profile?.role || 'user'}
              </span>
              {'  ·  '}
              <span className="text-slate-500">{user.email}</span>
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Status Akun', value: 'Aktif', icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-emerald-400', border: 'border-slate-800', bg: 'bg-slate-900' },
            { label: 'Role', value: (profile?.role || 'user').charAt(0).toUpperCase() + (profile?.role || 'user').slice(1), icon: isAdmin ? <ShieldCheck className="w-5 h-5" /> : <Shield className="w-5 h-5" />, color: 'text-blue-400', border: 'border-slate-800', bg: 'bg-slate-900' },
            { label: 'Total Aktivitas', value: String(logs.length), icon: <Activity className="w-5 h-5" />, color: 'text-purple-400', border: 'border-slate-800', bg: 'bg-slate-900' },
          ].map((stat, i) => (
            <div key={i} className={`relative overflow-hidden ${stat.bg} border ${stat.border} rounded-xl p-5 transition-colors duration-200`}>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-3">{stat.label}</p>
              <div className="flex items-center gap-3">
                <span className={`text-slate-400`}>{stat.icon}</span>
                <span className={`text-xl font-bold text-white`}>{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Market Data */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
            <h2 className="text-white font-semibold text-lg">Data Pasar Crypto</h2>
            <div className="flex items-center gap-1.5 bg-slate-800 text-slate-400 px-2.5 py-1 rounded-md border border-slate-700 w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium">Live API Eksternal</span>
            </div>
          </div>
          <MarketWidget />
        </div>

        {/* Activity Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6">
          <h2 className="text-white font-semibold text-lg mb-5">Riwayat Aktivitas</h2>
          {logs.length === 0 ? (
            <div className="text-center py-10">
              <FolderOpen className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Belum ada aktivitas tercatat.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log: { id: number; action: string; created_at: string; metadata?: Record<string, unknown> }) => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border-b border-slate-800 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      log.action.includes('SUCCESS') ? 'bg-emerald-500' :
                      log.action.includes('FAILED') ? 'bg-rose-500' :
                      'bg-blue-500'
                    }`} />
                    <span className="text-slate-300 text-sm">{log.action.replace(/_/g, ' ')}</span>
                  </div>
                  <span className="text-slate-500 text-xs pl-5 sm:pl-0">
                    {new Date(log.created_at).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
