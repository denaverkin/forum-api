export interface User {
  id: number;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface RefreshSession {
  id: string;
  userId: number;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ConflictError extends Error {
  constructor(message = 'User already exists') {
    super(message);
    this.name = 'ConflictError';
  }
}
