// src/lib/auth-client.ts
import { createAuthClient } from 'better-auth/react';



export const authClient = createAuthClient({});

// Optional convenience exports
export const { signIn, signUp, signOut, useSession } = authClient;