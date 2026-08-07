# Gatepoint Deployment

Gatepoint is a dynamic Next.js application and should be deployed to a Node-capable platform. The prepared targets are Vercel and Railway.

## Required Environment Variables

Set these in Vercel Project Settings, for Production, Preview, and Development as needed:

```txt
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
NEXT_PUBLIC_APP_URL=https://your-domain.example
NEXT_PUBLIC_APP_NAME=Gatepoint
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=Gatepoint <noreply@your-domain.example>
```

Optional:

```txt
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Keep service role and email keys server-side only. Do not prefix private keys with `NEXT_PUBLIC_`.

## Supabase Production Setup

1. Apply the migrations in `supabase/migrations` to the hosted Supabase project.
2. Confirm the public schema includes organizations, events, registration forms, registrations, responses, and QR code tables.
3. In Supabase Auth URL Configuration, set the Site URL to your production app URL and add `https://your-domain.example/auth/callback` to Redirect URLs. For local development, also add `http://localhost:3000/auth/callback`. If you test OAuth on Vercel preview deployments, add `https://*-your-vercel-account.vercel.app/**` as well; the app returns OAuth to the preview host so its PKCE session cookie is retained.
4. Use the Supabase project URL without `/rest/v1` for `NEXT_PUBLIC_SUPABASE_URL`.

## Resend Setup

1. Verify the sending domain in Resend.
2. Set `RESEND_FROM_EMAIL` to an address on that verified domain.
3. Keep the Resend API key only in the deployment provider environment.

## Vercel Setup

1. Import the Git repository into Vercel.
2. Use the included `vercel.json` defaults.
3. Add the environment variables above.
4. Deploy with the production branch.

Before deploying, run:

```bash
npm run deploy:check
```

This verifies required environment variables, TypeScript, linting, and the production build.

## Railway Setup

Railway uses the included `railway.json` config-as-code file.

1. Create a Railway project and choose this GitHub repository.
2. Add the required environment variables listed above before the first production deploy.
3. Generate a public domain in Railway Networking.
4. Set `NEXT_PUBLIC_APP_URL` to that generated domain or your custom Railway domain.
5. Add the Railway domain to Supabase Auth redirect URLs.
6. Deploy from Railway or run `railway up` from the project root after linking the project.

Railway deployment details:

- Build command: `npm run build`
- Start command: `node .next/standalone/server.js`
- Healthcheck path: `/health`
- Restart policy: `ON_FAILURE`, up to 10 retries

The Next.js config uses `output: "standalone"` so Railway can run the optimized production server.
