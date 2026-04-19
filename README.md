# LiveStrong Engagement Studio — Web App

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your keys:
- `VITE_ANTHROPIC_API_KEY` — from console.anthropic.com
- `VITE_SUPABASE_URL` — from your Supabase project settings
- `VITE_SUPABASE_ANON_KEY` — from your Supabase project settings

### 3. Create Supabase table
Run this SQL in your Supabase SQL editor:

```sql
create table engagement_log (
  id uuid default gen_random_uuid() primary key,
  instagram_handle text,
  post_url text,
  post_caption text,
  comment_posted text,
  tone text,
  posted_by text,
  posted_at timestamptz default now()
);
```

### 4. Run locally
```bash
npm run dev
```

Open http://localhost:5173

### 5. Build for production
```bash
npm run build
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host.

## How to use

1. Open the app and click any hashtag keyword
2. Instagram opens in a new tab on that hashtag page
3. The Chrome extension activates automatically
4. Click a post thumbnail — it opens as a modal
5. Extension filters it (recency, personal, not business, not already commented)
6. If it passes, an AI draft appears in the extension sidebar
7. Review, edit if needed, click Post Comment
8. Activity is logged and shows in the Recent Activity section
