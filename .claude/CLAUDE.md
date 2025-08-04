# DREAMSHOT.AI - Claude Development Context

## Project Status: Production-Ready POC
**Last Updated:** August 3, 2025  
**Build Status:** ✅ Working  
**Critical Issues:** Resolved  

## What This Project Does

DREAMSHOT.AI is a platform that tracks how AI makes the "impossible" possible over time. Users submit their wildest dreams and aspirations, then our multi-AI evaluation system scores how "impossible" each dream currently is. As technology advances, we track how these impossibility scores decay, showing users their dreams becoming more achievable.

## Key Concepts for Claude

### The Impossibility Score
- 0-100 scale where 100 = completely impossible, 0 = totally achievable
- Calculated as: `100 - (average of 4 evaluation factors)`
- Designed to decrease over time as technology improves

### 4-Factor Evaluation Framework
1. **Comprehension**: How well-defined is the dream?
2. **Quality**: How valuable/meaningful is it to society?
3. **Innovation**: How novel and creative is the approach?
4. **Feasibility**: How achievable with current technology?

### Multi-AI Evaluation
- Uses both OpenAI (GPT-4o) and Anthropic (Claude-3.5-Sonnet) models
- Confidence-weighted consensus scoring
- Bias reduction through provider diversity
- Historical performance tracking

## Current Architecture

### Tech Stack
- **Frontend**: Next.js 15 + TypeScript + Tailwind + Radix UI
- **Backend**: Next.js API Routes + Prisma + PostgreSQL
- **AI**: OpenAI + Anthropic APIs with custom evaluation prompts
- **Auth**: NextAuth v5 (beta)
- **Cache**: Redis for background jobs
- **Deploy**: Vercel-ready

### File Structure Highlights
```
/src
  /app
    /api
      /dreams              # CRUD operations for dreams
        /[id]/test         # AI evaluation endpoint
        /analytics         # Progress tracking & insights
      /auth                # NextAuth configuration
    /dreams/new            # Dream submission wizard
  /components
    /forms/dream-submission-form.tsx  # Multi-step dream creation
  /lib
    /ai                    # AI evaluation system
      /evaluation.ts       # Core evaluation logic
      /index.ts           # Provider abstraction
    /database
      /prisma.ts          # Database client
```

## Recent Critical Fixes (August 3, 2025)

### ✅ Build Issues Resolved
1. **Missing Dependencies**: Added `@radix-ui/react-label` and `@radix-ui/react-switch`
2. **Strict Mode Violations**: Fixed all `eval` variable name conflicts across codebase
3. **Build Validation**: Confirmed successful compilation and artifact generation

### ⚠️ Known Warnings (Non-blocking)
- NextAuth v5 import warnings (expected with beta version)
- TypeScript `any` type warnings (in analytics functions)
- ESLint warnings for console statements

## Current POC Status

### ✅ What's Working
- Complete dream submission workflow (5-step wizard)
- Multi-AI evaluation pipeline with error handling
- Database operations (CRUD) for all entities
- Progress tracking and analytics calculation
- Cost tracking for AI usage
- Build system and deployment readiness

### 🔄 What Needs Attention
1. **NextAuth Configuration**: Complete provider setup (Google, GitHub)
2. **Environment Setup**: Add validation middleware
3. **Database Migrations**: Create initial migration files
4. **UI Polish**: Add loading states, error boundaries
5. **Testing**: Add unit tests for evaluation algorithms

### 📋 Ready for Implementation
- User authentication UI
- Dashboard and analytics visualization
- Real-time progress updates
- Public dream gallery
- Search and filtering

## Development Context for Claude

### Working with This Codebase
1. **Priority Order**: Security > Functionality > Performance > Polish
2. **AI Integration**: The evaluation system is the core value prop - handle with care
3. **Type Safety**: Strict TypeScript throughout, use Zod for validation
4. **Database**: Prisma schema is comprehensive, use proper indexes
5. **Costs**: AI evaluations cost money - implement proper rate limiting

### Common Tasks
- **Adding new dream categories**: Update `DreamCategory` enum in Prisma schema
- **New AI models**: Add to respective provider files in `/lib/ai/`
- **Analytics features**: Extend `/api/dreams/analytics/route.ts`
- **UI components**: Use Radix UI + Tailwind for consistency

### Testing Approach
- **Manual testing**: Use the dream submission form at `/dreams/new`
- **API testing**: Use `curl` or Postman with proper auth headers
- **Database**: Use Prisma Studio (`npm run db:studio`)
- **Build testing**: Always run `npm run build` before deployment

### Performance Notes
- **Database queries**: All list endpoints use pagination
- **AI evaluations**: Background processing for expensive operations
- **Caching**: Redis used for frequent data access
- **Rate limiting**: Implemented on public API endpoints

## Integration Points to Monitor

### External Dependencies
- **OpenAI API**: Rate limits, cost tracking, model availability
- **Anthropic API**: Usage caps, model updates
- **Database**: Connection pooling, query performance
- **Redis**: Memory usage, connection health

### Security Considerations
- **API Keys**: Environment variables only, never in code
- **User Input**: Zod validation on all inputs
- **Authentication**: Session-based with NextAuth
- **Database**: Prisma prevents SQL injection
- **Rate Limiting**: Prevent abuse of AI evaluations

## Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Test production build
npm run db:studio       # Open database GUI

# Database
npm run db:generate     # Update Prisma client
npm run db:push         # Push schema changes
npm run db:migrate      # Create migration

# Debugging
npm run lint            # Check code quality
npm run lint -- --fix   # Auto-fix linting issues
```

## Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Required variables for POC
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
```

## Contact & Context

**Project Owner**: Travis Johnson (Product Manager learning development)  
**Development Approach**: Vibecoding - learning by building  
**Learning Focus**: Understanding the "why" behind technical decisions  
**Communication Style**: Clear, actionable guidance with educational context  

## Next Steps Priority

1. **High Priority**: Complete NextAuth provider setup
2. **Medium Priority**: Add proper error boundaries and validation
3. **Low Priority**: UI polish and additional features

---

**Remember**: This is a POC demonstrating the impossibility tracking concept. Focus on core functionality over feature completeness. The AI evaluation system is the unique value proposition - everything else supports that core experience.