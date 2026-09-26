import { postRepository } from '../repositories/post.repository.js';
import type { IPost, CreatePostDto } from '../dtos/post.dto.js';


export const postService = {
  getPosts: (category?: string, take?: string): IPost[] => {
    return postRepository.getAll(category, take);
  },

  getPostById: (id: number): IPost | null => {
    return postRepository.getById(id);
  },

  createPost: async (postData: CreatePostDto): Promise<IPost> => {
    return await postRepository.addPost(postData);
  }
};
