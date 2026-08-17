# InstaPlus — Instagram Analytics Dashboard

A powerful Instagram analytics dashboard that extracts real live data from Instagram posts and reels using URL scraping.

## Features

- **URL Extractor** — Paste any Instagram Reel/Post URL → get real Likes, Views, Comments, Shares, Saves, ER%
- **Bulk 100 URLs** — Extract up to 100 Instagram URLs at once
- **Analytics Charts** — Visual charts for followers, engagement, reach
- **Content Performance** — Track your best posts
- **Audience & Timing** — Real engagement data from extracted URLs
- **Competitors** — Add competitor URLs, compare real metrics head-to-head
- **AI Content Ideas** — Powered by Groq AI (free) — enter your niche, get real ideas
- **AI Assistant** — Chat with AI about your strategy
- **Reports & Export** — Export your data
- **Dark Mode** — Full dark UI

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **AI**: Groq API (free — llama-3.1-8b-instant)
- **Scraping**: Instagram GraphQL + Playwright

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/instaplus-dashboard.git
cd instaplus-dashboard
```

### 2. Install dependencies
```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 3. Run the app
```bash
# Terminal 1 — Backend (port 5000)
cd server
npm start

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

## AI Content Ideas (Groq)

1. Get a **free** API key from [console.groq.com](https://console.groq.com/keys)
2. Go to **Content Ideas** tab in the app
3. Paste your key in the API Key field
4. Type your niche and click **Generate Ideas**

## Note

This tool uses Instagram's public embed/GraphQL endpoints for data extraction. It only works on **public** posts and reels.

---

Made with ❤️ using React + Node.js
