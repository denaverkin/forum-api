import { postService } from '../services/post.js';

export const postHandler = {
  getAll: (req, res) => {
    const { category, take } = req.query;
    const posts = postService.getPosts(category, take);
    return res.status(200).json(posts);
  },

  getById: (req, res) => {
    const { id } = req.params;
    
    try {
      const post = postService.getPostById(id);
      return res.status(200).json(post);
    } catch (error) {
      if (error.message === 'NOT_FOUND') {
        return res.status(404).json({ message: `Post with id ${id} not found` });
      }
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  create: async (req, res) => {
    const { title, content, author, category } = req.body;

    if (!title || !title.trim() || !content || !content.trim()) {
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
