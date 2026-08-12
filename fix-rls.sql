-- Hapus policy lama yang menyebabkan infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Buat fungsi bypass RLS untuk mengecek status admin (sangat aman)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Buat policy baru yang menggunakan fungsi tersebut (bebas error recursion)
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING ( public.is_admin() );
