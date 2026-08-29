// src/lib/auth-client.ts
import { createAuthClient } from 'better-auth/react';

console.log('VITE_API_URL:', JSON.stringify(import.meta.env.VITE_API_URL));


export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_API_URL, // your backend origin
});

// Optional convenience exports
export const { signIn, signUp, signOut, useSession } = authClient;