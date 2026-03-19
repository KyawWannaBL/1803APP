# Britium Enterprise Delivery Platform

## Run locally

```bash
cd apps/web
npm install
cp .env.example .env
npm run dev
```

Set `VITE_ENABLE_DEMO_FALLBACK=true` for demo mode, or supply real Supabase credentials to connect to the backend.

## Quality gates

```bash
npm run lint:types
npm test
npm run build
```