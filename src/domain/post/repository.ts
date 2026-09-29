import type { IPost } from './entity.js';
import type { CreatePostDto } from '../../dtos/post.dto.js';

export interface IPostRepository {
  getAll: (category?: string, take?: string) => IPost[];
  getById: (id: number) => IPost | null;
  addPost: (postData: CreatePostDto) => Promise<IPost>;
}

const posts: IPost[] = [
  { id: 1, title: 'Introduction to JS', content: 'JS is everywhere.', author: 'John', category: 'programming' },
  { id: 2, title: 'Express.js Guide', content: 'How to build web APIs.', author: 'Alex', category: 'programming' }
];

let nextId = 3;

export const createPostRepository = (): IPostRepository => {
  return {
    getAll: (category, take) => {
      let filteredPosts = [...posts];

      if (category) {
        filteredPosts = filteredPosts.filter(post => post.category === category);
      }

      if (take) {
        const limit = parseInt(take, 10);
        if (!isNaN(limit)) {
          filteredPosts = filteredPosts.slice(0, limit);
        }
      }

      return filteredPosts;
    },

    getById: (id) => {
      return posts.find(post => post.id === id) || null;
    },

    addPost: (postData) => {
      return new Promise((resolve) => {
        const newPost: IPost = {
          id: nextId++,
          title: postData.title,
          content: postData.content,
          author: postData.author,
          category: postData.category
        };
        posts.push(newPost);
        resolve(newPost);
      });
    }
  };
};
