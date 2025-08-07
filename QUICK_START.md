# MyPromptBench - Quick Start Guide

## 🚀 Getting Started in 30 Seconds

```bash
# 1. Install dependencies (MUST use legacy peer deps)
npm install --legacy-peer-deps

# 2. Start the dev server
npm run dev

# 3. Open in browser
http://localhost:3000
```

## ⚠️ Important Notes

### If you see "1 error" in the UI
- **This is normal** - it's a development-only hydration warning
- The site works perfectly
- Ignore it and continue

### If ports are busy
- Server will auto-increment to 3001, 3002, etc.
- Check the terminal for the actual URL

### If you need to restart
```bash
# Kill any existing Next.js processes
pkill -f "next dev"

# Start fresh
npm run dev
```

## 🎯 What You'll See

1. **Hero**: "Remember This?" with Will Smith grid
2. **Problem**: Story about forgetting prompts
3. **Solution**: Prompt input box (try it!)
4. **Results**: Fake benchmark after 4.5s processing
5. **Email**: Modal to capture emails

## 🧪 Test the Full Flow

1. Scroll down to the prompt input
2. Type any prompt (e.g., "Write a haiku about AI")
3. Click "Run My Benchmark"
4. Watch the terminal-style processing (4.5 seconds)
5. See your results with ~300% improvement
6. Click "Track This Prompt Forever"
7. Enter any email to see success state

## 📁 Key Files

- `src/app/page.tsx` - Main landing page
- `src/components/features/*` - All the components
- `src/styles/globals.css` - Brutalist design system
- `CLAUDE.md` - Detailed context for AI assistants

## 🚫 Common Gotchas

### DON'T use regular npm install
```bash
# WRONG
npm install

# RIGHT
npm install --legacy-peer-deps
```

### DON'T worry about warnings
- Webpack/Turbopack warning = ignore
- "1 error" in UI = ignore
- Build warnings = ignore if site loads

## 🎉 That's It!

The MVP is fully functional. Everything you see is ready for user testing. No backend needed yet - it's all fake data for demand validation.

**Next step**: Deploy to Vercel and get real user feedback!