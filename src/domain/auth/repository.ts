import type { RefreshSession, User } from './entity.js';

export interface UserRepository {
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: number): Promise<User | undefined>;
  create(data: { email: string; passwordHash: string }): Promise<User>;
}

export interface RefreshSessionRepository {
  create(data: {
    id: string;
    userId: number;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<RefreshSession>;
  findById(id: string): Promise<RefreshSession | undefined>;
  deleteById(id: string): Promise<void>;
  deleteAllByUserId(userId: number): Promise<void>;
}
