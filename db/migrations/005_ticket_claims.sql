-- Pending: verified Supabase MCP only; apply after 004.
CREATE TABLE public.arcade_ticket_claims (
 id uuid PRIMARY KEY,
 user_id text NOT NULL REFERENCES public.arcade_user(id) ON DELETE CASCADE,
 request_id uuid NOT NULL,
 kind text NOT NULL CHECK (kind IN ('rescue','daily')),
 amount integer NOT NULL,
 claim_day date,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(user_id,request_id),
 CHECK ((kind='rescue' AND amount=10 AND claim_day IS NULL) OR (kind='daily' AND amount BETWEEN 10 AND 50 AND claim_day IS NOT NULL))
);
CREATE UNIQUE INDEX arcade_ticket_claims_daily_idx ON public.arcade_ticket_claims(user_id,claim_day) WHERE kind='daily';
CREATE INDEX arcade_ticket_claims_user_idx ON public.arcade_ticket_claims(user_id,created_at DESC);
ALTER TABLE public.arcade_ticket_claims ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.arcade_ticket_claims FROM PUBLIC, anon, authenticated;
