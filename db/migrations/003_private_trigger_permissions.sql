-- Supabase's default function privileges can grant EXECUTE directly to API roles.
-- The wallet trigger is internal and SECURITY INVOKER; keep its owner access only.
REVOKE ALL ON FUNCTION public.arcade_create_wallet() FROM PUBLIC;
DO $$
DECLARE role_name text;
BEGIN
  FOREACH role_name IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = role_name) THEN
      EXECUTE format('REVOKE ALL ON FUNCTION public.arcade_create_wallet() FROM %I', role_name);
    END IF;
  END LOOP;
END $$;
