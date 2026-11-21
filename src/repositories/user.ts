import type { UserRepository } from '../domain/auth/repository.js';
import { ConflictError } from '../domain/auth/entity.js';
import type { db as database } from '../prisma/db.js';

export function createUserRepository(db: typeof database): UserRepository {
  const users = db.orm.public.User;

  return {
    async findByEmail(email) {
      return (await users.where({ email }).first()) ?? undefined;
    },
    async findById(id) {
      return (await users.where({ id }).first()) ?? undefined;
    },
    async create(data) {
      try {
        return await users.create(data);
      } catch (error) {
        if (hasDatabaseCode(error, '23505')) {
          throw new ConflictError('User with this email already exists');
        }
        throw error;
      }
    },
  };
}

function hasDatabaseCode(error: unknown, code: string): boolean {
  const seen = new Set<unknown>();
  while (error && typeof error === 'object' && !seen.has(error)) {
    seen.add(error);
    const value = error as { code?: string; sqlState?: string; cause?: unknown };
    if (value.code === code || value.sqlState === code) return true;
    error = value.cause;
  }
  return false;
}
