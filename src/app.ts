import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createPostRepository } from './domain/post/repository.js';
import { createPostService } from './services/post.service.js';
import { createPostHandler } from './transport/handlers/category.js';
import { createPostRouter } from './transport/routers/category.js';

const app = express();
const PORT = process.env.PORT || 3000;

const db = new PrismaClient();

app.use(express.json());

const postRepository = createPostRepository(db);
const postService = createPostService(postRepository);
const postHandler = createPostHandler(postService);
const postRouter = createPostRouter(postHandler);

app.use(postRouter);

app.listen(PORT, () => {
  console.log(`Prisma Postgres Server is running on http://localhost:${PORT}`);
});
