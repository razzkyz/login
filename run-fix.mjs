import pkg from 'pg'
import fs from 'fs'
const { Client } = pkg
const connectionString = 'postgresql://postgres.xxrhrtqmxcobadgnmvkv:Pin8322955@@@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'

async function run() {
  const client = new Client({ connectionString })
  try {
    await client.connect()
    const sql = fs.readFileSync('fix-rls.sql', 'utf8')
    await client.query(sql)
    console.log('SQL berhasil dijalankan, bug recursion telah diperbaiki.')
  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    await client.end()
  }
}

run()
