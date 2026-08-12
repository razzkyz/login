import pkg from 'pg'
const { Client } = pkg
const connectionString = 'postgresql://postgres.xxrhrtqmxcobadgnmvkv:Pin8322955@@@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'

async function check() {
  const client = new Client({ connectionString })
  try {
    await client.connect()
    const res = await client.query(`SELECT * FROM pg_policies WHERE tablename = 'profiles';`)
    console.log('Policies:', res.rows)
  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    await client.end()
  }
}

check()
