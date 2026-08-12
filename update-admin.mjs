import pkg from 'pg'
const { Client } = pkg

const connectionString = 'postgresql://postgres.xxrhrtqmxcobadgnmvkv:Pin8322955@@@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'

async function updateAdmin() {
  const client = new Client({ connectionString })
  try {
    await client.connect()
    console.log('Connected to DB')
    
    // Pastikan admin@gmail.com ada
    const res = await client.query(`UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@gmail.com' RETURNING *;`)
    
    if (res.rowCount > 0) {
      console.log('Success updated:', res.rows[0].email)
    } else {
      console.log('Failed: No user found with email admin@gmail.com')
      // coba cari email yang mirip
      const all = await client.query(`SELECT email FROM public.profiles;`)
      console.log('Available emails:', all.rows)
    }
  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    await client.end()
  }
}

updateAdmin()
