import type { Request, Response } from 'express';
import type { IPostService } from '../../services/post.service.types.js';
import type { CreatePostDto, GetPostsQueryDto } from '../../dtos/post.dto.js';

export const createPostHandler = (postService: IPostService) => {
  return {
    getPosts: (req: Request<{}, {}, {}, GetPostsQueryDto>, res: Response) => {
      const { category, take } = req.query;
      const posts = postService.getPosts(category, take);
      return res.status(200).json(posts);
    },

    getPostById: (req: Request<{ id: string }>, res: Response) => {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }

      const post = postService.getPostById(id);

      if (!post) {
        return res.status(404).json({ message: `Post with ID ${id} not found` });
      }

      return res.status(200).json(post);
    },

    createPost: async (req: Request<{}, {}, CreatePostDto>, res: Response) => {
      const { title, content, author, category } = req.body;

      if (!title || !content) {
        return res.status(422).json({ 
          message: 'Validation failed. "title" and "content" are required fields.' 
        });
      }

      try {
        const newPost = await postService.createPost({ title, content, author, category });
        return res.status(201).json(newPost);
      } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  };
};

export type IPostHandler = ReturnType<typeof createPostHandler>;
