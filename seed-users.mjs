import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xxrhrtqmxcobadgnmvkv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cmhydHFteGNvYmFkZ25tdmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1MzIxOTgsImV4cCI6MjEwMjEwODE5OH0.PA0M7IgyfHE6Oj4d0KrmTex9K9UWsku8HaZZ3UDXp_o'
const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log('Mendaftarkan akun User...')
  const { data: user1, error: err1 } = await supabase.auth.signUp({
    email: 'User@gmail.com',
    password: 'User1122@',
    options: { data: { full_name: 'Akun User' } }
  })
  if (err1) console.log('Error User:', err1.message)
  else console.log('User berhasil didaftarkan!')

  console.log('\nMendaftarkan akun Admin...')
  const { data: user2, error: err2 } = await supabase.auth.signUp({
    email: 'Admin@gmail.com',
    password: 'Admin1122@',
    options: { data: { full_name: 'Akun Admin' } }
  })
  if (err2) console.log('Error Admin:', err2.message)
  else console.log('Admin berhasil didaftarkan!')
}

seed()
