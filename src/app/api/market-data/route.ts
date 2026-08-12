// Route handler untuk API eksternal data crypto (CoinGecko public API)
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  // Validate user is authenticated
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Integrasi API eksternal: CoinGecko (public, tidak perlu API key)
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=8&page=1&sparkline=false',
      {
        next: { revalidate: 60 }, // Cache selama 60 detik
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('CoinGecko API error')
    }

    const data = await response.json()

    const formatted = data.map((coin: {
      id: string;
      symbol: string;
      name: string;
      image: string;
      current_price: number;
      market_cap: number;
      price_change_percentage_24h: number;
    }) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      price: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
    }))

    return NextResponse.json({ data: formatted, updatedAt: new Date().toISOString() })
  } catch {
    // Return dummy data jika API gagal
    const dummy = [
      { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 65000, change24h: 2.5, marketCap: 1280000000000 },
      { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3400, change24h: 1.8, marketCap: 408000000000 },
      { id: 'solana', symbol: 'SOL', name: 'Solana', price: 145, change24h: -0.5, marketCap: 67000000000 },
      { id: 'bnb', symbol: 'BNB', name: 'BNB', price: 580, change24h: 0.9, marketCap: 84000000000 },
    ]
    return NextResponse.json({ data: dummy, updatedAt: new Date().toISOString(), source: 'fallback' })
  }
}
