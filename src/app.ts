import express from 'express';
import { createPostRepository } from './domain/post/repository.js';
import { createPostService } from './services/post.service.js';
import { createPostHandler } from './transport/handlers/post.handler.js';
import { createPostRouter } from './transport/routers/post.router.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const postRepository = createPostRepository();
const postService = createPostService(postRepository);
const postHandler = createPostHandler(postService);
const postRouter = createPostRouter(postHandler);

app.use(postRouter);

app.listen(PORT, () => {
  console.log(`DI Server is running on http://localhost:${PORT}`);
});
