# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎯 Project Overview
**Current Project**: MyPromptBench (pivoted from DREAMSHOT.AI on August 4, 2025)
**Concept**: Track AI prompt evolution over time, inspired by "Will Smith eating spaghetti" meme
**Status**: Frontend MVP complete, running locally on port 3002

## 🚨 Critical Installation & Development Commands

### Installation ALWAYS Requires Legacy Peer Deps
```bash
# NEVER use regular npm install
npm install --legacy-peer-deps

# This is due to @next-auth/prisma-adapter conflicts
```

### Development Commands
```bash
# Start development server (uses Turbopack)
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Lint code
npm run lint

# Database commands (for future use)
npm run db:generate    # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:migrate    # Run migrations
npm run db:studio     # Open Prisma Studio
```

### Common Port Management
```bash
# Usually runs on http://localhost:3000
# But may increment to 3001, 3002 if ports are taken

# Kill existing Next.js processes if needed
pkill -f "next dev"

# Check what's running on port
lsof -i :3000
```

## 🏗️ Architecture Overview

### Frontend Architecture
The project uses Next.js 15 App Router with a brutalist design aesthetic:

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main landing page (client component)
│   └── layout.tsx         # Root layout with font loading
├── components/
│   ├── features/          # Core feature components
│   │   ├── will-smith-grid.tsx      # 2x2 evolution showcase
│   │   ├── hero-section.tsx         # "Remember This?" narrative
│   │   ├── prompt-input.tsx         # Terminal-style input
│   │   ├── results-display.tsx      # Benchmark visualization
│   │   └── email-capture.tsx        # Modal for email collection
│   └── ui/                # Reusable UI components (shadcn)
├── lib/
│   └── data/             # Static data and examples
└── styles/               # Global CSS with brutalist design
```

### State Management Pattern
Simple React hooks in main page component - no complex state management needed:
- `currentPrompt`: User's entered prompt
- `isProcessing`: Shows fake processing animation
- `showResults`: Controls results display
- `showEmailCapture`: Modal visibility

### Brutalist Design System
Custom CSS classes for harsh, scientific journal aesthetic:
- `.border-brutal`: 3px black borders
- `.shadow-brutal`: 6px offset shadows
- `.text-hero`: Massive headlines (clamp(4rem, 15vw, 12rem))
- `.highlight`: Yellow highlighter effect

Fonts are loaded via Next.js font system, NOT CSS @imports.

## 📂 Key Implementation Details

### Database Schema (Not Yet Connected)
Currently uses Prisma with PostgreSQL schema, but not connected. When implementing:
- Rename `Dream` model → `Prompt`
- Rename `AiTest` → `BenchmarkResult`
- Add `EmailCapture` model

### User Flow Implementation
1. **Landing Hook**: Will Smith story with typewriter animation
2. **Problem Identification**: "97% of prompts lost to history"
3. **Interactive Demo**: 8-step processing animation (4.5s total)
4. **Results Display**: Shows 250-450% improvement scores
5. **Email Capture**: Progressive disclosure modal

### Known Non-Critical Issues
- **"1 error" indicator** in dev mode - hydration warning, ignore
- **Webpack/Turbopack warning** - configuration notice, ignore
- Site works perfectly despite these warnings

## 🚀 Next Implementation Phase

When moving beyond MVP:
1. Build API routes in `/src/app/api/prompts/`
2. Connect PostgreSQL database
3. Implement real email capture
4. Add analytics tracking
5. Deploy to Vercel

## 💡 Development Tips

### Component Patterns
- All interactive components use `'use client'` directive
- State managed with simple React hooks
- Animations use CSS transitions, not heavy libraries
- Fake data in `/src/lib/data/` for all examples

### When Adding Features
1. Check existing components for patterns
2. Maintain brutalist aesthetic (harsh shadows, thick borders)
3. Keep fake processing times realistic (600-1000ms steps)
4. Test scroll behavior on mobile

### Common Fixes
```bash
# If dependencies fail
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# If CSS changes don't apply
# Hard refresh browser (Cmd+Shift+R)
# Check you're editing /src/styles/globals.css
```

## 📊 Performance Considerations

- Currently using emoji placeholders (🍝) instead of images
- No heavy animation libraries (Framer Motion, GSAP)
- Components not lazy loaded yet (future optimization)
- Bundle size minimal with good tree-shaking

---
**Last Updated**: August 4, 2025
**Next Action**: Deploy to Vercel and test with real users