'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import toast from 'react-hot-toast'

export default function MessageToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      const toastStyle = { borderRadius: '10px', background: '#333', color: '#fff' }
      
      if (message.toLowerCase().includes('berhasil')) {
        toast.success(message, { style: toastStyle })
      } else {
        toast.error(message, { style: toastStyle })
      }
      
      // Bersihkan URL dari message agar tidak muncul terus saat refresh
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.delete('message')
      
      const newUrl = newSearchParams.toString() 
        ? `${pathname}?${newSearchParams.toString()}`
        : pathname
        
      router.replace(newUrl, { scroll: false })
    }
  }, [searchParams, pathname, router])
  
  return null
}
