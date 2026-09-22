const posts = [
  { id: 1, title: 'First Steps in Node.js', content: 'Node.js is awesome...', author: 'Nose', category: 'programming' },
  { id: 2, title: 'post 1', content: 'first post', author: 'Bob', category: 'newpost' },
  { id: 3, title: 'My Trip to Kyiv', content: ' Kyiv is beautiful!', author: 'Kelvin', category: 'travel' }
];

export const postRepository = {
  getAll: (category, take) => {
    let filteredPosts = [...posts];
    
    if (category) {
      filteredPosts = filteredPosts.filter(p => p.category.toLowerCase() === category.toLowerCase());
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
    const postId = parseInt(id, 10);
    return posts.find(p => p.id === postId) || null;
  },

  addPost: (postData) => {
    return new Promise((resolve) => {
      const newPost = {
        id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
        title: postData.title,
        content: postData.content,
        author: postData.author || 'Anonymous',
        category: postData.category || 'general'
      };
      posts.push(newPost);
      resolve(newPost);
    });
  }
};
