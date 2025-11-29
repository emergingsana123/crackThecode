# Unified Server Deployment Guide

## 🚀 Single Service Architecture

Your app now runs as a **unified service** that serves both the frontend and API, making deployment much easier!

## 🏗️ Architecture

- **Port 3000**: SpacetimeDB (database/real-time features)
- **Port 3001**: Unified server (frontend + AI API)

## 📁 What Changed

- **`server-unified.cjs`**: New unified server that serves both React frontend and API endpoints
- **`package.json`**: Updated with new scripts for unified deployment
- **Frontend**: Already configured to use relative API URLs (`/api/chat`) and SpacetimeDB on port 3000

## 🛠️ Development

```bash
# Make sure SpacetimeDB is running first
cd server-rs && spacetime serve hophacks-chat

# Then start the unified server
npm start                  # Builds + starts unified server on port 3001
```

## 🏗️ Production Build & Deploy

```bash
# 1. Build the frontend
npm run build              # Creates dist/ folder

# 2. Start the unified server
npm start                  # Builds + starts unified server on port 3001
```

## 🌐 Hosting Platforms

### Vercel/Netlify
```json
{
  "scripts": {
    "build": "tsc -b && vite build",
    "start": "node server-unified.cjs"
  }
}
```

### Railway/Render
```bash
# Build command:
npm run build

# Start command:
npm start
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Environment Variables

Make sure these are set in production:
```bash
OPENAI_API_KEY=your_openai_api_key
PORT=3001                   # Unified server port (SpacetimeDB uses 3000)
NODE_ENV=production         # Optional
SPACETIMEDB_URL=ws://localhost:3000  # SpacetimeDB connection
```

## 📡 API Endpoints

- `GET /` - React frontend (port 3001)
- `POST /api/chat` - AI chat endpoint (port 3001)
- `GET /api/health` - Health check (port 3001)
- `ws://localhost:3000` - SpacetimeDB connection
- `GET /*` - Fallback to React (client-side routing)

## ✅ Benefits

1. **Separate Concerns**: Database (3000) + App (3001)
2. **Simplified Deployment**: Frontend and AI API in one service
3. **No CORS Issues**: Frontend and API on same domain
4. **Easy Scaling**: Scale the unified service independently
5. **Production Ready**: Static files served by Express
