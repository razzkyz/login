'use client'

import { useState } from 'react'
import { LogOut, X, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

interface LogoutButtonProps {
  logoutAction: () => Promise<void>
  className?: string
}

export default function LogoutButton({ logoutAction, className }: LogoutButtonProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    setIsLoading(true)
    toast.loading('Keluar dari sesi...', { id: 'logout' })
    try {
      await logoutAction()
    } catch {
      toast.dismiss('logout')
    }
  }

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className={className ?? 'text-xs sm:text-sm text-slate-400 hover:text-white bg-transparent hover:bg-slate-800 rounded-lg px-3 py-1.5 transition-all duration-200 flex items-center gap-1.5'}
      >
        <LogOut className="w-3.5 h-3.5" />
        Keluar
      </button>

      {/* Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDialog(false)}
          />

          {/* Dialog Box */}
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => setShowDialog(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 bg-rose-500/10 rounded-full mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6 text-rose-400" />
            </div>

            {/* Text */}
            <h2 className="text-white font-semibold text-lg text-center mb-2">
              Keluar dari Sesi?
            </h2>
            <p className="text-slate-400 text-sm text-center mb-6">
              Anda akan keluar dari akun ini dan perlu login kembali untuk mengaksesnya.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDialog(false)}
                disabled={isLoading}
                className="flex-1 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {isLoading ? 'Keluar...' : 'Ya, Keluar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
