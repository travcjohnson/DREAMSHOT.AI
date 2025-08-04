# DREAMSHOT.AI

A cutting-edge AI-powered creative platform built with Next.js 15, TypeScript, and modern web technologies.

## Features

- **Next.js 15** with App Router and React 19
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Prisma ORM** with PostgreSQL database
- **NextAuth.js** for authentication
- **AI Integration** with OpenAI and Anthropic APIs
- **Redis** for caching and session management
- **Responsive Design** with dark mode support

## Quick Start

1. **Clone and setup:**
   ```bash
   cd DREAMSHOT.AI
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env.local
   # Fill in your API keys and database URLs
   ```

3. **Database setup:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   └── (marketing)/    # Marketing pages
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components
│   ├── forms/         # Form components
│   ├── layout/        # Layout components
│   └── features/      # Feature-specific components
├── lib/               # Utility libraries
│   ├── auth/          # Authentication utilities
│   ├── database/      # Database connections
│   ├── ai/            # AI service integrations
│   ├── utils/         # General utilities
│   └── validations/   # Zod schemas
├── types/             # TypeScript type definitions
├── hooks/             # Custom React hooks
├── providers/         # Context providers
├── styles/            # Global styles
└── config/            # Configuration files
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Environment Variables

See `.env.example` for all required environment variables.

## Deployment

This project is optimized for deployment on Vercel:

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Cache:** Redis
- **Authentication:** NextAuth.js
- **AI APIs:** OpenAI, Anthropic
- **Deployment:** Vercel