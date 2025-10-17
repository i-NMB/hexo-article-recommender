function preprocess(text = '', stopwords) {
  return (text || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[^\w\u4e00-\u9fa5]/g, ' ')
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 1 && !stopwords.has(word));
}

// 新增 getCache 参数
function getRecommendedPosts(post, count, config, getCache) {
  if (!post || !post.path) {
    console.error('⚠️ 无效的 post，缺少 path');
    return [];
  }

  const cache = getCache(); // ✅ 通过函数获取缓存

  if (!cache || !cache[post.path]) {
    console.warn(`未找到 path=${post.path} 的推荐`);
    return [];
  }
  
  console.debug('获取推荐文章 path:', post.path);

  return cache[post.path].slice(0, count).map(item => item.post);
}

module.exports = {
  preprocess,
  getRecommendedPosts
};