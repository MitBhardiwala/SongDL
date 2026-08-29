// src/lib/auth.ts
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma.js'; // note the .js extension — required with NodeNext/ESM

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: 'postgresql', // or "mysql" / "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  trustedOrigins: ['http://localhost:5173'],
  secret: process.env.BETTER_AUTH_SECRET!,
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'lax',
      secure: false, // must be false on plain http://localhost
    },
  },
});

export type Auth = typeof auth;