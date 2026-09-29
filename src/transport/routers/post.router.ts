import { Router } from 'express';
import type { IPostHandler } from '../handlers/post.handler.js';

export const createPostRouter = (postHandler: IPostHandler): Router => {
  const router = Router();

  router.get('/posts', postHandler.getPosts);
  router.get('/posts/:id', postHandler.getPostById);
  router.post('/posts', postHandler.createPost);

  return router;
};
