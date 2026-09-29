import type { IPost } from '../domain/post/entity.js';
import type { CreatePostDto } from '../dtos/post.dto.js';

export interface IPostService {
  getPosts: (category?: string, take?: string) => IPost[];
  getPostById: (id: number) => IPost | null;
  createPost: (postData: CreatePostDto) => Promise<IPost>;
}
