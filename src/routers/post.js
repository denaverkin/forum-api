import { Router } from 'express';
import { postHandler } from '../handlers/post.js';

const router = Router();

router.get('/', postHandler.getAll);
router.get('/:id', postHandler.getById);
router.post('/', postHandler.create);

export default router;
