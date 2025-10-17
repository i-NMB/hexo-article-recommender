const { preprocess } = require('./helper');

// ✅ 模块内缓存（闭包变量）
let recommendationCache = {};

/**
 * 估算阅读时间（单位：分钟）
 * @param {string} content - 文章内容
 * @param {number} wordsPerMinute - 每分钟阅读字数，默认 400（中文按字，英文按词）
 * @returns {number} 阅读分钟数，至少为 1
 */
function estimateReadingTime(content, wordsPerMinute = 400) {
  if (!content) return 1;
  // 移除 HTML 标签，只保留文本
  const text = content.replace(/<[^>]*>/g, '');
  // 统计中英文字符和单词（中文按字，英文按空格分词）
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (text.replace(/[\u4e00-\u9fa5]/g, '').match(/\b\w+\b/g) || []).length;
  const totalUnits = chineseChars + englishWords;
  return Math.max(1, Math.ceil(totalUnits / wordsPerMinute));
}

function initializeRecommender(hexo, config) {
  recommendationCache = {}; // 重置

  const Post = hexo.database.model('Post');
  let posts = [];

  try {
    const allPosts = Post.find({}).toArray();
    posts = allPosts.filter(post => {
      const isPublished = post.published !== false;
      const isNotDraft = !post.draft;
      return isPublished && isNotDraft;
    });
  } catch (error) {
    hexo.log.error('获取文章列表时出错:', error);
  }

  if (!posts || posts.length === 0) {
    try {
      posts = Post.find({}).toArray();
      hexo.log.warn('没有找到已发布的文章，将使用所有文章进行推荐计算');
    } catch (error) {
      hexo.log.error('获取所有文章时出错:', error);
      return;
    }
  }

  if (posts.length === 0) {
    hexo.log.warn('数据库中没有任何文章，跳过推荐系统初始化');
    return;
  }

  hexo.log.info('示例文章 path:', posts[0]?.path);

  const tfidfData = {
    wordDocFreq: {},
    docVectors: {},
    docCount: posts.length
  };

  // 第一步：构建 TF-IDF 所需的词频数据
  posts.forEach(post => {
    const words = [
      ...preprocess(post.title, config.stopwords),
      ...preprocess(post.content, config.stopwords)
    ];
    new Set(words).forEach(word => {
      tfidfData.wordDocFreq[word] = (tfidfData.wordDocFreq[word] || 0) + 1;
    });
  });

  // 第二步：构建每篇文章的 TF-IDF 向量
  posts.forEach(post => {
    const words = [
      ...preprocess(post.title, config.stopwords),
      ...preprocess(post.content, config.stopwords)
    ];
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    const vector = {};
    Object.keys(wordFreq).forEach(word => {
      const tf = wordFreq[word] / words.length;
      const idf = Math.log(tfidfData.docCount / (tfidfData.wordDocFreq[word] || 1));
      vector[word] = tf * idf;
    });

    tfidfData.docVectors[post.path] = vector;
  });

  const now = Date.now();

  const cosineSimilarity = (vecA, vecB) => {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    const allWords = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
    for (const word of allWords) {
      const a = vecA[word] || 0;
      const b = vecB[word] || 0;
      dotProduct += a * b;
      normA += a * a;
      normB += b * b;
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  };

  // 第三步：为每篇文章生成推荐列表，并注入 minutes 字段
  posts.forEach(post => {
    const recommendations = posts
      .filter(p => p.path !== post.path)
      .map(otherPost => {
        const similarity = cosineSimilarity(
          tfidfData.docVectors[post.path],
          tfidfData.docVectors[otherPost.path]
        );

        const otherDate = otherPost.date instanceof Date ? 
          otherPost.date : new Date(otherPost.date);
        const ageMonths = (now - otherDate) / (30 * 86400000);
        const recencyBoost = Math.exp(-config.recencyDecay * ageMonths);

        let tagBoost = 0;
        if (post.tags && otherPost.tags) {
          const commonTags = post.tags.filter(t => 
            otherPost.tags.some(ot => ot.name === t.name)
          );
          tagBoost = commonTags.length * config.weights.tag;
        }

        let categoryBoost = 0;
        if (post.categories && otherPost.categories) {
          const commonCats = post.categories.filter(c => 
            otherPost.categories.some(oc => oc.name === c.name)
          );
          categoryBoost = commonCats.length * config.weights.category;
        }

        const titleMatchBoost = preprocess(post.title, config.stopwords)
          .some(w => preprocess(otherPost.title, config.stopwords).includes(w))
          ? 0.15 : 0;

        const score = similarity * recencyBoost + tagBoost + categoryBoost + titleMatchBoost;

        // ✅ 注入阅读时间字段（创建新对象，避免污染原始数据）
        const enrichedPost = {
          ...otherPost,
          minutes: estimateReadingTime(otherPost.content)
        };

        return { post: enrichedPost, score };
      })
      .sort((a, b) => b.score - a.score);

    recommendationCache[post.path] = recommendations;
  });
}

// ✅ 提供获取缓存的函数
function getRecommendationCache() {
  return recommendationCache;
}

module.exports = {
  initializeRecommender,
  getRecommendationCache
};