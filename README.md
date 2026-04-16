📦 OpenClaw Product Search System

AI-powered product search using:

Telegram Bot
Supabase (Postgres + pgvector)
Semantic Search (OpenAI embeddings)
Outopia product scraper
🚀 Features
Scrapes 500+ products (Men + Women)
Stores products in Supabase with embeddings
Semantic search (e.g. “men’s shoes under $100”)
Price filtering support
Telegram bot integration
Claude Code / OpenClaw compatible usage
🛠️ Tech Stack
Node.js
Supabase (Postgres + pgvector)
OpenAI Embeddings
Telegram Bot API
Cheerio / Puppeteer (scraping)
📁 Project Structure
outopia-scraper/
│
├── bot.js
├── scrape.js
├── embed.js
├── convert.js
├── supabaseClient.js
├── server.js
├── insert-test.js
├── openai_products.json
├── outopia_products.json
├── .env
└── README.md
⚙️ Setup Instructions
1. Install dependencies
npm install
2. Configure environment

Create .env file:

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
OPENAI_API_KEY=your_openai_key
3. Setup Supabase

Run SQL:

create extension if not exists vector;

create table products (
  id text primary key,
  name text,
  description text,
  price numeric,
  currency text,
  category text,
  images jsonb,
  url text,
  metadata jsonb,
  embedding vector(1536)
);
4. Run Scraper
node scrape.js
5. Generate Embeddings
node embed.js
6. Insert into DB
node insert-test.js
🤖 Telegram Bot Usage

Start bot:

node bot.js
Example Queries:
men shoes under $100
women dress below 50
nike sneakers under 200
🔍 Search System Logic
Convert query → embedding
Vector similarity search (pgvector)
Apply filters (price/category)
Return top products with image + link
💰 Price Filtering

Supports:

under $100
below 50
less than 200
🧠 OpenClaw / Claude Code Usage
OpenClaw Command Example
openclaw search "men shoes under $100"

Returns:

Product name
Image
Price
Purchase link
Claude Code Usage

Claude Code can call API:

curl -X POST http://localhost:3000/search \
  -H "Content-Type: application/json" \
  -d '{"query":"men shoes under $100"}'
📡 API Endpoint
POST /search
{
  "query": "men shoes under $100"
}
Response:
{
  "query": "men shoes",
  "maxPrice": 100,
  "results": [
    {
      "name": "Nike Air Max",
      "price": 95,
      "image": "...",
      "url": "..."
    }
  ]
}
