import { postRepository } from '../repositories/post.js';

export const postService = {
  getPosts: (category, take) => {
    return postRepository.getAll(category, take);
  },

  getPostById: (id) => {
    const post = postRepository.getById(id);
    if (!post) {
      throw new Error('NOT_FOUND');
    }
    return post;
  },

  createPost: async (postData) => {
    return await postRepository.addPost(postData);
  }
};
