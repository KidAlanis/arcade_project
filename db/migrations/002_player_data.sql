-- Prepared only. Apply after 001 using the reviewed migration runner.
CREATE TABLE public.arcade_wallets (
  user_id text PRIMARY KEY REFERENCES public.arcade_user(id) ON DELETE CASCADE,
  balance integer NOT NULL DEFAULT 0 CHECK (balance >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.arcade_prizes (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9][a-z0-9-]{0,79}$'),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price integer NOT NULL CHECK (price > 0),
  stock integer CHECK (stock >= 0), -- NULL means unlimited; 0 means sold out.
  active boolean NOT NULL DEFAULT false
);
CREATE TABLE public.arcade_redemptions (
  id uuid PRIMARY KEY,
  user_id text NOT NULL REFERENCES public.arcade_user(id) ON DELETE CASCADE,
  prize_id text NOT NULL REFERENCES public.arcade_prizes(id) ON DELETE RESTRICT,
  prize_name text NOT NULL, -- Historical snapshot survives catalog edits.
  price integer NOT NULL CHECK (price > 0),
  request_id uuid NOT NULL,
  redeemed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, request_id)
);
CREATE INDEX arcade_redemptions_shelf_idx ON public.arcade_redemptions (user_id, redeemed_at DESC, id DESC);
CREATE INDEX arcade_redemptions_prize_idx ON public.arcade_redemptions (prize_id);
CREATE TABLE public.arcade_game_results (
  id uuid PRIMARY KEY,
  user_id text NOT NULL REFERENCES public.arcade_user(id) ON DELETE CASCADE,
  game_id text NOT NULL,
  run_id uuid NOT NULL UNIQUE, -- Generated and owned by a future trusted game server.
  outcome text NOT NULL CHECK (outcome IN ('win', 'loss')),
  verified_at timestamptz NOT NULL,
  claimed_at timestamptz,
  awarded_tickets integer CHECK (awarded_tickets > 0),
  CHECK ((claimed_at IS NULL AND awarded_tickets IS NULL) OR (claimed_at IS NOT NULL AND awarded_tickets IS NOT NULL))
);
CREATE INDEX arcade_game_results_user_idx ON public.arcade_game_results (user_id);

-- Every account starts with exactly one zero-balance wallet, atomically with account creation.
CREATE FUNCTION public.arcade_create_wallet() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog, public AS $$
BEGIN
  INSERT INTO public.arcade_wallets (user_id) VALUES (NEW.id);
  RETURN NEW;
END $$;
CREATE TRIGGER arcade_user_wallet AFTER INSERT ON public.arcade_user
FOR EACH ROW EXECUTE FUNCTION public.arcade_create_wallet();
INSERT INTO public.arcade_wallets (user_id) SELECT id FROM public.arcade_user ON CONFLICT DO NOTHING;

ALTER TABLE public.arcade_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arcade_prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arcade_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arcade_game_results ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.arcade_wallets, public.arcade_prizes, public.arcade_redemptions, public.arcade_game_results FROM PUBLIC;
REVOKE ALL ON FUNCTION public.arcade_create_wallet() FROM PUBLIC;
DO $$
DECLARE role_name text;
BEGIN
  FOREACH role_name IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = role_name) THEN
      EXECUTE format('REVOKE ALL ON public.arcade_wallets, public.arcade_prizes, public.arcade_redemptions, public.arcade_game_results FROM %I', role_name);
    END IF;
  END LOOP;
END $$;
-- Deliberately no seed prizes or game results: the existing shop is a placeholder.
