import type { IPost, CreatePostDto } from '../dtos/post.dto.js';

const posts: IPost[] = [
  { id: 1, title: 'Introduction to JS', content: 'JS is everywhere.', author: 'John', category: 'programming' },
  { id: 2, title: 'Express.js Guide', content: 'How to build web APIs.', author: 'Alex', category: 'programming' },
  { id: 3, title: 'Healthy Diet Tips', content: 'Eat more greens.', author: 'Emma', category: 'health' },
  { id: 4, title: 'Vue.js vs React', content: 'A deep comparison.', author: 'John', category: 'programming' }
];

let nextId = 5;

export const postRepository = {
  getAll: (category?: string, take?: string): IPost[] => {
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

  getById: (id: number): IPost | null => {
    return posts.find(post => post.id === id) || null;
  },

  addPost: (postData: CreatePostDto): Promise<IPost> => {
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
