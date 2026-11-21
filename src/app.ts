import express from 'express';
import cookieParser from 'cookie-parser';
import { db } from './prisma/db.js';
import { createPostRepository } from './repositories/post.js';
import { createPostService } from './services/post.js';
import { createPostHandler } from './transport/handlers/post.js';
import { createPostRouter } from './transport/routers/post.js';
import { createUserRepository } from './repositories/user.js';
import { createRefreshSessionRepository } from './repositories/refresh-session.js';
import { createAuthService } from './services/auth.js';
import { createAuthHandler } from './transport/handlers/auth.js';
import { createAuthRouter } from './transport/routers/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

const postRepository = createPostRepository(db);
const postService = createPostService(postRepository);
const postHandler = createPostHandler(postService);
const postRouter = createPostRouter(postHandler);

const userRepository = createUserRepository(db);
const refreshSessionRepository = createRefreshSessionRepository(db);
const authService = createAuthService(userRepository, refreshSessionRepository);
const authHandler = createAuthHandler(authService);
const authRouter = createAuthRouter(authHandler);

app.use(postRouter);
app.use(authRouter);

app.listen(PORT, () => {
  console.log(`Prisma Postgres Server is running on http://localhost:${PORT}`);
});
