# DIXIT consultation form setup

The consultation form posts directly to Supabase PostgREST using the project's publishable key. No service-role or secret key is used in browser code.

## Environment

Copy `.env.example` to `.env.local` for local development and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Use the publishable key from Supabase Project Settings → API Keys. Never put a service-role or secret key in a `NEXT_PUBLIC_*` variable.

## Database

The migration `supabase/migrations/20261119235900_dixit_consultation_public_insert.sql` was applied to the connected DIXIT Supabase project. It changes the service choices and grants anonymous visitors insert-only access to the listed customer fields. The database default supplies `status = 'new'`; the insert policy enforces it. Existing staff read/update policies remain unchanged.

## Local verification

1. Run `npm install` and copy `.env.example` to `.env.local`.
2. Set the real project publishable key in `.env.local`.
3. Run `npm run dev` and open `/consultation`.
4. Submit a test enquiry and verify the row appears in Supabase Table Editor.
5. Confirm anonymous access cannot select, update, or delete consultation requests.

A honeypot field is included as a basic spam deterrent. Add CAPTCHA/Turnstile and server-side rate limiting before high-volume public launch.
