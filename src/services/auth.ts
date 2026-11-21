import { createHash, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import jwt from 'jsonwebtoken';
import type {
  RefreshSessionRepository,
  UserRepository,
} from '../domain/auth/repository.js';
import { UnauthorizedError } from '../domain/auth/entity.js';

const ACCESS_SECRET = process.env['JWT_ACCESS_SECRET'] || 'access-secret';
const REFRESH_SECRET = process.env['JWT_REFRESH_SECRET'] || 'refresh-secret';

const ACCESS_EXPIRES_IN = '15m';
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthService {
  register(email: string, password: string): Promise<TokenPair>;
  login(email: string, password: string): Promise<TokenPair>;
  refresh(incomingRefreshToken: string): Promise<TokenPair>;
  logout(incomingRefreshToken?: string): Promise<void>;
}

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function hashPassword(password: string): string {
  const salt = randomUUID();
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(':');
  if (!salt || !key) return false;
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = scryptSync(password, salt, 64);
  return timingSafeEqual(keyBuffer, derivedKey);
}

export function createAuthService(
  userRepo: UserRepository,
  sessionRepo: RefreshSessionRepository
): AuthService {
  async function issueTokens(userId: number, email: string): Promise<TokenPair> {
    const jti = randomUUID();

    const accessToken = jwt.sign({ sub: userId, email }, ACCESS_SECRET, {
      expiresIn: ACCESS_EXPIRES_IN,
    });

    const refreshToken = jwt.sign({ sub: userId, email }, REFRESH_SECRET, {
      expiresIn: '7d',
      jwtid: jti,
    });

    await sessionRepo.create({
      id: jti,
      userId,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    });

    return { accessToken, refreshToken };
  }

  return {
    async register(email, password) {
      const passwordHash = hashPassword(password);
      const user = await userRepo.create({ email, passwordHash });
      return issueTokens(user.id, user.email);
    },

    async login(email, password) {
      const user = await userRepo.findByEmail(email);
      if (!user || !verifyPassword(password, user.passwordHash)) {
        throw new UnauthorizedError('Invalid email or password');
      }
      return issueTokens(user.id, user.email);
    },

    async refresh(incomingRefreshToken) {
      if (!incomingRefreshToken) {
        throw new UnauthorizedError('Refresh token is missing');
      }

      let payload: jwt.JwtPayload;
      try {
        payload = jwt.verify(incomingRefreshToken, REFRESH_SECRET) as jwt.JwtPayload;
      } catch {
        throw new UnauthorizedError('Invalid or expired refresh token');
      }

      const jti = payload.jti;
      const userId = Number(payload.sub);

      if (!jti || !userId) {
        throw new UnauthorizedError('Malformed refresh token');
      }

      const existingSession = await sessionRepo.findById(jti);

      if (!existingSession) {
        throw new UnauthorizedError('Refresh token reuse detected');
      }

      const incomingHash = hashRefreshToken(incomingRefreshToken);
      if (
        existingSession.tokenHash !== incomingHash ||
        existingSession.expiresAt <= new Date()
      ) {
        await sessionRepo.deleteById(jti);
        throw new UnauthorizedError('Invalid refresh session');
      }

      await sessionRepo.deleteById(jti);

      const user = await userRepo.findById(userId);
      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      return issueTokens(user.id, user.email);
    },

    async logout(incomingRefreshToken) {
      if (!incomingRefreshToken) return;

      const decoded = jwt.decode(incomingRefreshToken) as jwt.JwtPayload | null;
      if (decoded?.jti) {
        await sessionRepo.deleteById(decoded.jti);
      }
    },
  };
}
