import pkg from 'pg'
const { Client } = pkg
const connectionString = 'postgresql://postgres.xxrhrtqmxcobadgnmvkv:Pin8322955@@@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'

async function check() {
  const client = new Client({ connectionString })
  try {
    await client.connect()
    const res = await client.query(`SELECT id, email, role FROM public.profiles WHERE email = 'admin@gmail.com';`)
    console.log('Admin Profiles count:', res.rowCount)
    console.log('Admin Profiles:', res.rows)
  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    await client.end()
  }
}

check()
