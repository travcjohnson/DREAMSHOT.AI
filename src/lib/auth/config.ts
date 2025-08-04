import NextAuth, { NextAuthConfig } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/database/prisma';
import { env } from '@/config/env';

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // OAuth Providers
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          })
        ]
      : []),
    
    ...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          })
        ]
      : []),

    // Email/Password Provider
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/error',
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Persist user info in the token
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      
      // Handle account linking
      if (account?.provider && token.sub) {
        await prisma.user.update({
          where: { id: token.sub },
          data: { 
            emailVerified: new Date() // Auto-verify for OAuth providers
          }
        });
      }

      return token;
    },

    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      // Allow OAuth sign in
      if (account?.provider !== 'credentials') {
        return true;
      }

      // For credentials, user is already verified in authorize
      return true;
    },
  },

  events: {
    async signIn({ user, account, isNewUser }) {
      // Track sign-in events
      console.log(`User ${user.email} signed in via ${account?.provider || 'credentials'}`);
      
      if (isNewUser) {
        console.log(`New user registered: ${user.email}`);
        // Could send welcome email here
      }
    },
    
    async signOut({ token }) {
      console.log(`User signed out: ${token?.email}`);
    },
  },

  debug: process.env.NODE_ENV === 'development',
  secret: env.NEXTAUTH_SECRET,
};

// For backwards compatibility during migration
export const authOptions = authConfig;

// NextAuth instance
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);