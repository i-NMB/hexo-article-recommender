// lib/helper.js
function preprocess(text = '', stopwords) {
  return (text || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[^\w\u4e00-\u9fa5]/g, ' ')
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 1 && !stopwords.has(word));
}

function normalizePath(p) {
  if (!p) return '';
  return p
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '')
    .replace(/^\/?/, '')
    .replace(/\/$/, '');
}

function getRecommendedPosts(post, count, config, getCache) {
  if (!post) {
    console.warn('⚠️ 无效的 post 对象');
    return [];
  }

  const cache = getCache();
  if (!cache || Object.keys(cache).length === 0) {
    console.warn('推荐缓存未初始化或为空');
    return [];
  }

  const testPath = normalizePath(post.path || post.permalink || post.slug);
  let candidates = cache[testPath];

  if (!candidates) {
    const cacheKeys = Object.keys(cache);
    for (const key of cacheKeys) {
      if (normalizePath(key) === testPath) {
        candidates = cache[key];
        break;
      }
    }
  }

  if (!candidates) return [];

  return candidates.slice(0, count).map(item => ({
    ...item.post,
    _recommendType: item.type,
    _recommendScore: parseFloat(item.score.toFixed(1)) // 保留1位小数，0~100
  }));
}

module.exports = {
  preprocess,
  normalizePath,
  getRecommendedPosts
};