import { createClient } from '@/utils/supabase/server'

export async function logActivity(
  userId: string | null,
  action: string,
  metadata: Record<string, unknown> = {}
) {
  try {
    const supabase = await createClient()
    await supabase.from('activity_logs').insert({
      user_id: userId,
      action,
      metadata,
      created_at: new Date().toISOString(),
    })
  } catch {
    // Logging should never crash the app
    console.error('[ActivityLog] Failed to write log:', action)
  }
}

export async function getUserLogs(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) return []
  return data
}

export async function getAllLogs() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*, profiles(email, role)')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return []
  return data
}
