-- ============================================================
-- SCRIPT SQL UNTUK TECHNICAL TEST
-- Jalankan ini di Supabase SQL Editor (dashboard.supabase.com)
-- ============================================================

-- 1. Buat tabel profiles untuk menyimpan role user
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Buat tabel activity_logs untuk logging aktivitas penting
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 4. Policy: User hanya bisa lihat/edit profil sendiri
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 5. Policy: Admin bisa lihat semua profil
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 6. Policy: Activity logs - user hanya lihat milik sendiri
CREATE POLICY "Users can view own logs"
  ON public.activity_logs FOR SELECT
  USING (auth.uid() = user_id);

-- 7. Policy: Service role (server) bisa insert logs
CREATE POLICY "Service can insert logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (true);

-- 8. Policy: Admin bisa lihat semua logs
CREATE POLICY "Admins can view all logs"
  ON public.activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 9. Fungsi auto-create profile saat user baru registrasi
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$;

-- 10. Trigger yang memanggil fungsi di atas
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 11. Insert data dummy admin (jalankan setelah registrasi akun admin)
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@demo.com';
