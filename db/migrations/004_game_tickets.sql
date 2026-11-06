-- Pending: apply only through the verified Supabase MCP. Existing balances stay unchanged.
ALTER TABLE public.arcade_wallets ALTER COLUMN balance SET DEFAULT 200;
CREATE TABLE public.arcade_game_runs (
 id uuid PRIMARY KEY,
 user_id text NOT NULL REFERENCES public.arcade_user(id) ON DELETE CASCADE,
 game_id text NOT NULL CHECK (game_id IN ('game-1','game-2','game-3','clawpop')),
 started_at timestamptz NOT NULL DEFAULT now(),
 finished_at timestamptz,
 outcome text CHECK (outcome IN ('win','loss')),
 CHECK ((finished_at IS NULL AND outcome IS NULL) OR (finished_at IS NOT NULL AND outcome IS NOT NULL))
);
CREATE INDEX arcade_game_runs_user_idx ON public.arcade_game_runs(user_id, started_at DESC);
CREATE UNIQUE INDEX arcade_game_runs_active_idx ON public.arcade_game_runs(user_id) WHERE finished_at IS NULL;
ALTER TABLE public.arcade_game_runs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.arcade_game_runs FROM PUBLIC, anon, authenticated;
