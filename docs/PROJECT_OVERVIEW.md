# DREAMSHOT.AI - Project Overview & Technical Specification

## 🎯 Project Vision

DREAMSHOT.AI is an innovative platform that uses AI to track the "impossibility" of user dreams and aspirations over time. As technology advances, what seems impossible today becomes achievable tomorrow. Our platform captures this transformation through quantified "impossibility scores" that decay as AI capabilities improve.

## 🏗️ Architecture Overview

### Core Concept
1. **Dream Submission**: Users submit their "impossible" dreams with detailed descriptions
2. **Multi-Model AI Evaluation**: Multiple AI models (GPT-4, Claude) assess each dream across 4 dimensions
3. **Impossibility Tracking**: Platform tracks how impossibility scores change over time
4. **Progress Visualization**: Users see their dreams become more "possible" as technology advances

### Technology Stack

**Frontend:**
- Next.js 15.1.3 (App Router)
- TypeScript
- Tailwind CSS + Radix UI
- Framer Motion for animations
- React 19

**Backend:**
- Next.js API Routes
- NextAuth v5 (beta) for authentication
- Prisma ORM with PostgreSQL
- Redis for background jobs
- Zod for validation

**AI Integration:**
- OpenAI GPT-4o, GPT-4o-mini
- Anthropic Claude-3.5-Sonnet, Claude-3.5-Haiku
- Custom evaluation framework with bias reduction

**Infrastructure:**
- Vercel deployment ready
- PostgreSQL database
- Redis for caching and job queues

## 📊 Database Schema

### Core Models

**Dream** - User's impossible aspirations
- Title, description, category, tags
- Privacy settings (public/private)
- Status tracking (active/archived/completed)
- Original prompt preservation

**AiTest** - Individual AI evaluations
- 4-factor scoring system (Comprehension, Quality, Innovation, Feasibility)
- Provider and model tracking
- Token usage and cost tracking
- Confidence levels and reasoning

**ProgressLog** - Aggregate progress tracking
- Average impossibility over time
- Milestone achievements
- Trend analysis
- Snapshot data for analytics

**User Management**
- NextAuth integration
- Role-based access (USER/ADMIN)
- Session management

## 🧠 AI Evaluation Framework

### 4-Factor Assessment System
1. **Comprehension (0-100)**: How well-defined is the dream?
2. **Quality (0-100)**: How valuable/meaningful is it?
3. **Innovation (0-100)**: How novel is the approach?
4. **Feasibility (0-100)**: How achievable with current capabilities?

### Impossibility Score Calculation
```
Impossibility Score = 100 - (Average of 4 factors)
```

### Multi-Model Consensus
- Evaluations from multiple AI providers
- Confidence-weighted averaging
- Bias reduction through provider diversity
- Historical tracking of model performance

## 🚀 Current Implementation Status

### ✅ Completed Features
- Complete database schema with Prisma
- Dream submission form with step-by-step wizard
- Multi-model AI evaluation pipeline
- API routes for CRUD operations
- Authentication framework setup
- Build system and dependency management
- Comprehensive error handling in evaluation pipeline
- Cost tracking and usage analytics
- Progress logging and trend analysis

### ⚠️ Known Issues (Resolved)
- ~~Missing Radix UI dependencies~~ ✅ Fixed
- ~~JavaScript strict mode violations ('eval' variables)~~ ✅ Fixed
- Build process now working correctly

### 🔄 In Progress
- NextAuth v5 provider configuration
- Environment variable validation
- Database migrations setup

### 📋 Pending Features
- User authentication UI components
- Dashboard and analytics visualization
- Real-time progress tracking
- Email notifications for milestones
- Public dream gallery
- Search and filtering capabilities
- Social features (comments, likes)
- Export capabilities (PDF reports)

## 🛠️ Development Workflow

### Quick Start
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database and API keys

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

### Build and Deploy
```bash
# Test build locally
npm run build

# Deploy to Vercel
vercel deploy
```

### Database Commands
```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Create migration
npm run db:migrate

# Open Prisma Studio
npm run db:studio
```

## 🔐 Environment Configuration

### Required Variables
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/dreamshot_ai"
REDIS_URL="redis://localhost:6379"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# AI APIs
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."

# App Configuration
NODE_ENV="development"
APP_URL="http://localhost:3000"
```

### Optional Variables
```env
# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Feature Flags
ENABLE_ANALYTICS="false"
ENABLE_EXPERIMENTS="false"
```

## 📈 Performance Considerations

### Cost Management
- Token usage tracking per evaluation
- Cost calculation per AI provider
- Rate limiting on API endpoints
- Background job processing for expensive operations

### Scalability
- Database indexing for fast queries
- Pagination on all list endpoints
- Redis caching for frequently accessed data
- Optimized database queries with Prisma

### Security
- Environment variable validation
- Input sanitization with Zod
- SQL injection prevention via Prisma
- Rate limiting on public endpoints
- Session management with NextAuth

## 🧪 Testing Strategy

### Current Testing Approach
- Manual testing of core workflows
- Build validation in CI/CD
- Type checking with TypeScript
- Linting with ESLint

### Planned Testing Enhancements
- Unit tests for evaluation algorithms
- Integration tests for API endpoints
- E2E tests for critical user flows
- Performance testing for AI evaluations

## 🔮 Future Roadmap

### Phase 1 (MVP - Current)
- Core dream submission and evaluation
- Basic user authentication
- Simple analytics dashboard

### Phase 2 (Social Features)
- Public dream gallery
- User profiles and following
- Comments and reactions
- Dream collaboration features

### Phase 3 (Advanced Analytics)
- Predictive modeling for impossibility decay
- Trend analysis across dream categories
- AI model performance comparisons
- Market insights and reports

### Phase 4 (Platform Expansion)
- API for third-party integrations
- Mobile app development
- Enterprise features
- White-label solutions

## 📞 Support and Maintenance

### Documentation
- Code comments for complex algorithms
- API documentation (pending)
- Database schema documentation
- Deployment guides

### Monitoring
- Error tracking (pending)
- Performance monitoring (pending)
- Cost alerts for AI usage
- User analytics

### Backup and Recovery
- Database backup strategy (pending)
- Disaster recovery plan (pending)
- Data export capabilities

---

*Last Updated: August 3, 2025*  
*Build Status: ✅ Working*  
*Deploy Status: 🔄 Ready for deployment*