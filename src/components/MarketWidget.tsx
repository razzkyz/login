'use client'

import { useEffect, useState } from 'react'

interface CoinData {
  id: string
  symbol: string
  name: string
  image?: string
  price: number
  change24h: number
  marketCap: number
}

interface MarketResponse {
  data: CoinData[]
  updatedAt: string
  source?: string
}

export default function MarketWidget() {
  const [market, setMarket] = useState<MarketResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/market-data')
        if (!res.ok) throw new Error('Failed')
        const json = await res.json()
        setMarket(json)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (error || !market) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
        Gagal memuat data pasar. Coba refresh halaman.
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs text-slate-500">
          Data dari CoinGecko · Diperbarui: {new Date(market.updatedAt).toLocaleTimeString('id-ID')}
          {market.source === 'fallback' && ' (data cadangan)'}
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {market.data.map((coin) => (
          <div
            key={coin.id}
            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex items-center gap-2 mb-2">
              {coin.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
              )}
              <span className="text-xs font-bold text-slate-400">{coin.symbol}</span>
            </div>
            <p className="text-white font-semibold text-sm">
              ${coin.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </p>
            <p className={`text-xs font-medium mt-0.5 ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h).toFixed(2)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
