-- Pending: apply only via verified Supabase MCP after 004 and 005.
CREATE TABLE public.arcade_avatars (
 user_id text PRIMARY KEY REFERENCES public.arcade_user(id) ON DELETE CASCADE,
 look jsonb NOT NULL,
 hair integer NOT NULL DEFAULT 0 CHECK (hair BETWEEN 0 AND 2),
 skin integer NOT NULL DEFAULT 0 CHECK (skin BETWEEN 0 AND 2),
 updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(jsonb_typeof(look)='object')
);
ALTER TABLE public.arcade_avatars ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.arcade_avatars FROM PUBLIC, anon, authenticated;
INSERT INTO public.arcade_prizes(id,name,description,price,stock,active) VALUES('top-pink','Strawberry Hoodie','Wearable top',20,NULL,true) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.arcade_prizes(id,name,description,price,stock,active) VALUES('top-purple','Lavender Daydream','Wearable top',20,NULL,true) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.arcade_prizes(id,name,description,price,stock,active) VALUES('top-mint','Mint Soda Jacket','Wearable top',25,NULL,true) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.arcade_prizes(id,name,description,price,stock,active) VALUES('bottom-skirt','Cherry Blossom Skirt','Wearable bottom',15,NULL,true) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.arcade_prizes(id,name,description,price,stock,active) VALUES('bottom-purple','Starlight Trousers','Wearable bottom',15,NULL,true) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.arcade_prizes(id,name,description,price,stock,active) VALUES('shoes-purple','Berry Platform Boots','Wearable shoes',15,NULL,true) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.arcade_prizes(id,name,description,price,stock,active) VALUES('accessory-bow','Sweetheart Bow','Wearable accessory',10,NULL,true) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.arcade_prizes(id,name,description,price,stock,active) VALUES('accessory-star','Little Star Clip','Wearable accessory',10,NULL,true) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.arcade_prizes(id,name,description,price,stock,active) VALUES('accessory-bunny','Bunny Ears','Wearable accessory',30,NULL,true) ON CONFLICT(id) DO NOTHING;
CREATE UNIQUE INDEX arcade_clothing_one_per_player_idx ON public.arcade_redemptions(user_id,prize_id) WHERE prize_id IN ('top-pink','top-purple','top-mint','bottom-skirt','bottom-purple','shoes-purple','accessory-bow','accessory-star','accessory-bunny');
