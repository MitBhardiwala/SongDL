// src/middleware/require-auth.js
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../lib/auth.js';
import { NextFunction, Request, Response } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: typeof auth.$Infer.Session.user;
            session?: typeof auth.$Infer.Session.session;
        }
    }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session) return res.status(401).json({ error: 'UNAUTHORIZED' });

    req.user = session.user;
    req.session = session.session;
    next();
}