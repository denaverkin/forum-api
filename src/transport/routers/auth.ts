import { Router } from 'express';
import type { createAuthHandler } from '../handlers/auth.js';

export function createAuthRouter(authHandler: ReturnType<typeof createAuthHandler>): Router {
  const router = Router();

  router.post('/auth/register', authHandler.register);
  router.post('/auth/login', authHandler.login);
  router.post('/auth/refresh', authHandler.refresh);
  router.post('/auth/logout', authHandler.logout);

  return router;
}
