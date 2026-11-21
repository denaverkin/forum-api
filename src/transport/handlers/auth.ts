import type { Request, Response } from 'express';
import type { AuthService, TokenPair } from '../../services/auth.js';
import { ConflictError, UnauthorizedError } from '../../domain/auth/entity.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
};

function setAuthCookies(res: Response, tokens: TokenPair) {
  res.cookie('accessToken', tokens.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', tokens.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearAuthCookies(res: Response) {
  res.clearCookie('accessToken', COOKIE_OPTIONS);
  res.clearCookie('refreshToken', COOKIE_OPTIONS);
}

export function createAuthHandler(authService: AuthService) {
  return {
    async register(req: Request, res: Response) {
      try {
        const { email, password } = req.body ?? {};
        if (!email || !password) {
          res.status(400).json({ message: 'Email and password are required' });
          return;
        }
        const tokens = await authService.register(email, password);
        setAuthCookies(res, tokens);
        res.status(201).json({ message: 'Registered successfully' });
      } catch (error) {
        if (error instanceof ConflictError) {
          res.status(409).json({ message: error.message });
          return;
        }
        res.status(500).json({ message: 'Internal server error' });
      }
    },

    async login(req: Request, res: Response) {
      try {
        const { email, password } = req.body ?? {};
        if (!email || !password) {
          res.status(400).json({ message: 'Email and password are required' });
          return;
        }
        const tokens = await authService.login(email, password);
        setAuthCookies(res, tokens);
        res.status(200).json({ message: 'Logged in successfully' });
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          res.status(401).json({ message: error.message });
          return;
        }
        res.status(500).json({ message: 'Internal server error' });
      }
    },

    async refresh(req: Request, res: Response) {
      try {
        const incomingRefreshToken = req.cookies?.refreshToken;
        const tokens = await authService.refresh(incomingRefreshToken);
        setAuthCookies(res, tokens);
        res.status(200).json({ message: 'Tokens refreshed' });
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          clearAuthCookies(res);
          res.status(401).json({ message: error.message });
          return;
        }
        res.status(500).json({ message: 'Internal server error' });
      }
    },

    async logout(req: Request, res: Response) {
      try {
        const incomingRefreshToken = req.cookies?.refreshToken;
        await authService.logout(incomingRefreshToken);
        clearAuthCookies(res);
        res.status(200).json({ message: 'Logged out successfully' });
      } catch {
        clearAuthCookies(res);
        res.status(200).json({ message: 'Logged out successfully' });
      }
    },
  };
}
