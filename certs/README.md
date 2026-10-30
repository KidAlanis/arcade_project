# Supabase server root certificate

Download the server root CA certificate from this Supabase project's **Database Settings → SSL configuration**. Save it here as `prod-supabase.cer` (PEM format).

In ignored `.env.local`, set `DATABASE_SSL_CA_FILE` to that file's absolute path or `certs/prod-supabase.cer`. Never put a private key or database credentials in this folder. The app and read-only inspection both verify the server certificate and hostname; certificate checks must remain enabled.

The certificate itself is public trust material. Do not substitute a certificate from an unknown source or extract-and-trust an unverified server certificate.
