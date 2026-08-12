'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { LogOut, X, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

interface LogoutButtonProps {
  logoutAction: () => Promise<void>
  className?: string
}

function LogoutDialog({ onCancel, onConfirm, isLoading }: {
  onCancel: () => void
  onConfirm: () => void
  isLoading: boolean
}) {
  // Prevent background scroll when dialog open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return createPortal(
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
    >
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      />

      {/* Dialog */}
      <div
        style={{ position: 'relative', zIndex: 1 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-sm p-6"
      >
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-full mb-4 mx-auto">
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
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {isLoading ? 'Keluar...' : 'Ya, Keluar'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function LogoutButton({ logoutAction, className }: LogoutButtonProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  async function handleLogout() {
    setIsLoading(true)
    toast.loading('Keluar dari sesi...', { id: 'logout' })
    try {
      await logoutAction()
    } catch {
      toast.dismiss('logout')
      setIsLoading(false)
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

      {mounted && showDialog && (
        <LogoutDialog
          onCancel={() => setShowDialog(false)}
          onConfirm={handleLogout}
          isLoading={isLoading}
        />
      )}
    </>
  )
}
