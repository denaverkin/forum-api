import { Router } from 'express';
import { postHandler } from '../handlers/post.handler.js';

const router = Router();

router.get('/posts', postHandler.getPosts);
router.get('/posts/:id', postHandler.getPostById);
router.post('/posts', postHandler.createPost);

export default router;
