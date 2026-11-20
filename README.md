# DIXIT — website

Next.js site for DIXIT, a fashion house in Accra.

```bash
npm ci
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

## Where to update things

| What | Where |
|---|---|
| WhatsApp, email, phone, Instagram, address, hours | `config/site.ts` → `contact` |
| Currency, bespoke "from" price, bespoke timing | `config/site.ts` → `pricing` |
| Collection photos | drop into `public/collections/<collection>/` (see `public/collections/README.md`) |
| Piece names, descriptions, prices | `data/pieces.ts` |
| Founder story and photo | `data/founder.ts` (+ photo in `public/founder/`) |
| Journal posts | `data/journal.ts` |
| Home page photo | replace `public/brand/dixit-hero.jpg` (portrait, 1600 × 2400 px or larger) |

Anything left empty stays hidden on the site — no broken links or blank sections.

## Enquiries

The consultation form posts to `/api/enquiry`, which:

1. **Emails** the enquiry to `ENQUIRY_EMAIL_TO` via [Resend](https://resend.com) (reply goes straight to the client), and
2. **Saves** it to Supabase if `NEXT_PUBLIC_SUPABASE_*` is set (optional).

After sending, the client gets a **"Continue on WhatsApp"** button with their details pre-filled, and a floating WhatsApp button appears on every page once `contact.whatsapp` is set.

### Resend setup
1. Create a free account at resend.com → **API Keys** → create a key.
2. In Vercel → Project → **Settings → Environment Variables**, add `RESEND_API_KEY` and `ENQUIRY_EMAIL_TO`, then redeploy.
3. Until you verify your own domain in Resend, the default sender `onboarding@resend.dev` can only deliver to the email address you signed up to Resend with. After verifying a domain, set `ENQUIRY_EMAIL_FROM` (e.g. `DIXIT <enquiries@yourdomain.com>`).

### Supabase (optional)
Apply `supabase/migrations/20261120120000_dixit_consultation_add_womenswear.sql` so the new "Womenswear" option is accepted.
