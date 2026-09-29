import type { IPostRepository } from '../domain/post/repository.js';
import type { IPostService } from './post.service.types.js';

export const createPostService = (postRepository: IPostRepository): IPostService => {
  return {
    getPosts: (category, take) => {
      return postRepository.getAll(category, take);
    },

    getPostById: (id) => {
      return postRepository.getById(id);
    },

    createPost: async (postData) => {
      return await postRepository.addPost(postData);
    }
  };
};

