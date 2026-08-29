// src/lib/auth-client.ts
import { createAuthClient } from 'better-auth/react';
import { API_BASE_URL } from './utils';



export const authClient = createAuthClient({
    baseURL: API_BASE_URL, // your backend origin
});

// Optional convenience exports
export const { signIn, signUp, signOut, useSession } = authClient;