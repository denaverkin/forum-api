import type { RefreshSessionRepository } from '../domain/auth/repository.js';
import type { db as database } from '../prisma/db.js';

export function createRefreshSessionRepository(
  db: typeof database
): RefreshSessionRepository {
  const sessions = db.orm.public.RefreshSession;

  return {
    async create(data) {
      return await sessions.create(data);
    },

    async findById(id) {
      return (await sessions.where({ id }).first()) ?? undefined;
    },

    async deleteById(id) {
      await sessions.where({ id }).delete();
    },

    async deleteAllByUserId(userId) {
      await sessions.where({ userId }).delete();
    },
  };
}
