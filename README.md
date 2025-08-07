# MyPromptBench 🍝

> Create your own "Will Smith eating spaghetti" moment. Track how your prompts evolve as AI models improve over time.

## 🎯 Project Status

**Current State**: MVP Complete - Ready for Demand Validation  
**Original Project**: DREAMSHOT.AI (pivoted August 4, 2025)  
**Design**: Brutalist Scientific Journal Aesthetic

## 🚀 Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev

# Open http://localhost:3000
```

## 🎨 Design Philosophy

**Brutalist Scientific Journal**: Massive serif headlines, thick black borders, harsh shadows, and scientific paper aesthetics. The design makes users feel they're contributing to important research.

### Key Visual Elements
- **Typography**: Playfair Display (serif), Inter (sans), JetBrains Mono (mono)
- **Colors**: Black on warm off-white, blood red accents, yellow highlights
- **Layout**: Asymmetrical grids, massive margins, paper-like texture

## ✅ What's Built

### Landing Page Components
- **Hero Section**: "Remember This?" with Will Smith narrative
- **Interactive Grid**: 2x2 evolution showcase with hover states
- **Prompt Input**: Terminal-style interface with fake processing
- **Results Display**: Benchmark visualization with improvement scores
- **Email Capture**: Progressive disclosure flow
- **Social Proof**: Trending prompts and activity feed

### User Experience Flow
1. Hook with Will Smith story
2. Problem identification (forgetting prompts)
3. Solution presentation (track forever)
4. Interactive demo (enter prompt)
5. Results display (show improvement)
6. Email capture (for updates)

## 📂 Project Structure

```
mypromptbench/
├── src/
│   ├── app/                    # Next.js pages
│   ├── components/
│   │   ├── features/          # Main components
│   │   │   ├── will-smith-grid.tsx
│   │   │   ├── hero-section.tsx
│   │   │   ├── prompt-input.tsx
│   │   │   ├── results-display.tsx
│   │   │   └── email-capture.tsx
│   │   └── ui/                # Reusable UI components
│   ├── lib/
│   │   └── data/             # Example prompts & timeline
│   └── styles/               # Global CSS with brutalist design
├── agents/                    # AI agent configurations
├── docs/                      # Detailed documentation
└── public/                    # Static assets
```

## 🚧 What's Not Built

### Backend Infrastructure
- [ ] API endpoints for data storage
- [ ] Database schema for prompts
- [ ] Email notification system
- [ ] Actual AI model integration
- [ ] User authentication

### Features
- [ ] Real prompt processing
- [ ] Historical data tracking
- [ ] Public prompt gallery
- [ ] User dashboards
- [ ] Analytics tracking

## 📖 Documentation

- [`PIVOT_SUMMARY_AUGUST_2025.md`](docs/PIVOT_SUMMARY_AUGUST_2025.md) - Complete pivot details and decisions
- [`TECHNICAL_IMPLEMENTATION_NOTES.md`](docs/TECHNICAL_IMPLEMENTATION_NOTES.md) - Technical architecture and patterns
- [`PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md) - Original DREAMSHOT.AI documentation

## 🤖 AI Agents

The project includes specialized AI agents for different aspects:
- `prompt-evolution-analyst` - Analyzes output evolution
- `scientific-copy-writer` - Academic-style copy
- `brutalist-ui-designer` - Design guidance
- `conversion-optimization-psychologist` - UX optimization
- And more in the `/agents` directory

## 🐛 Known Issues

1. **Development Error Overlay**: Shows "1 error" indicator (non-critical)
2. **Dependency Conflicts**: Requires `--legacy-peer-deps` flag
3. **Hydration Warnings**: Minor React 19 strict mode issues

## 🚀 Next Steps

1. **Deploy to Vercel** for live testing
2. **Add Analytics** to track conversions
3. **Build API Endpoints** for data persistence
4. **Create Marketing Materials** (videos, social posts)
5. **Run Traffic** to validate demand

## 💡 Key Insight

The pivot from DREAMSHOT.AI to MyPromptBench demonstrates the power of finding a compelling cultural hook (Will Smith spaghetti) and building a simple tool around it. The brutalist design makes it memorable and the concept is immediately understandable.

---

**Built with**: Next.js 15, React 19, Tailwind CSS, TypeScript  
**Status**: MVP Complete, Ready for Launch  
**Contact**: Create an issue for questions or suggestions