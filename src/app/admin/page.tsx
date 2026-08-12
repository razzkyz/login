export const dynamic = 'force-dynamic'
export const revalidate = 0

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '../login/actions'
import { getAllLogs } from '@/lib/logger'
import Link from 'next/link'
import { ShieldAlert, Users, Shield, Activity, FolderOpen, ArrowLeft } from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'

export const metadata = {
  title: 'Panel Admin | Portal Aplikasi',
}

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const logs = await getAllLogs()
  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0]
  const initials = displayName?.substring(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-[#0B1120]">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-amber-500/5 rounded-full filter blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="border-b border-amber-500/20 bg-slate-900/70 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center shadow-sm">
                <ShieldAlert className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-white font-bold tracking-tight">Panel Admin</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/dashboard" className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-3 py-1.5 transition-all duration-200 flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              {/* Avatar */}
              <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">{initials}</span>
              </div>
              <LogoutButton logoutAction={logout} />
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">

        {/* Header banner */}
        <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8">
          <div className="relative">
            <div className="flex items-center gap-2 mb-2 text-amber-500">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-widest">Administrator Access</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Panel Kontrol Admin</h1>
            <p className="text-slate-400 text-sm mt-1">Kelola pengguna dan pantau seluruh aktivitas sistem.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Pengguna', value: allProfiles?.length ?? 0, icon: <Users className="w-5 h-5" />, color: 'text-blue-400' },
            { label: 'Administrator', value: allProfiles?.filter(p => p.role === 'admin').length ?? 0, icon: <Shield className="w-5 h-5" />, color: 'text-amber-400' },
            { label: 'Total Log', value: logs.length, icon: <Activity className="w-5 h-5" />, color: 'text-purple-400' },
          ].map((stat, i) => (
            <div key={i} className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-xl p-5 transition-colors duration-200">
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-3">{stat.label}</p>
              <div className="flex items-center gap-3">
                <span className="text-slate-400">{stat.icon}</span>
                <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* User Management Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-800">
            <h2 className="text-white font-semibold text-lg">Daftar Pengguna</h2>
            <p className="text-slate-500 text-sm mt-0.5">{allProfiles?.length ?? 0} pengguna terdaftar</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50">
                  <th className="text-left py-3 px-5 text-slate-500 font-medium text-xs uppercase tracking-wider">Pengguna</th>
                  <th className="text-left py-3 px-5 text-slate-500 font-medium text-xs uppercase tracking-wider">Role</th>
                  <th className="text-left py-3 px-5 text-slate-500 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Bergabung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {allProfiles?.map((p: { id: string; email: string; role: string; full_name?: string; created_at: string }) => (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition-colors duration-150">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                          <span className="text-slate-300 text-xs font-semibold">
                            {(p.full_name || p.email || 'U').substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-slate-200 font-medium">{p.full_name || '—'}</p>
                          <p className="text-slate-500 text-xs">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                        p.role === 'admin'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {p.role === 'admin' && <Shield className="w-3 h-3" />}
                        {p.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 text-xs hidden sm:table-cell">
                      {new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-800">
            <h2 className="text-white font-semibold text-lg">Log Aktivitas Sistem</h2>
            <p className="text-slate-500 text-sm mt-0.5">{logs.length} aktivitas tercatat</p>
          </div>
          <div className="max-h-[420px] overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Belum ada log aktivitas.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {logs.map((log: { id: number; action: string; created_at: string; user_id?: string; metadata?: Record<string, unknown>; profiles?: { email?: string; role?: string } | null }) => (
                  <div key={log.id} className="flex items-start sm:items-center justify-between gap-3 p-4 sm:px-5 hover:bg-slate-800/30 transition-colors duration-150">
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1 sm:mt-0 ${
                        log.action.includes('SUCCESS') ? 'bg-emerald-500' :
                        log.action.includes('FAILED') ? 'bg-rose-500' :
                        'bg-blue-500'
                      }`} />
                      <div className="min-w-0">
                        <p className="text-slate-200 text-sm font-semibold">{log.action.replace(/_/g, ' ')}</p>
                        <p className="text-slate-500 text-xs truncate">
                          {log.profiles?.email || (log.metadata as { email?: string })?.email || log.user_id || 'Anonim'}
                        </p>
                      </div>
                    </div>
                    <span className="text-slate-600 text-xs shrink-0 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}
