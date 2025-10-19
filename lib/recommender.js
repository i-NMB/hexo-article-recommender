// lib/recommender.js
const { preprocess, normalizePath } = require('./helper');

let recommendationCache = {};

function estimateReadingTime(content, chineseWPM = 260, englishWPM = 200) {
  if (!content) return 1;
  const text = content.replace(/<[^>]*>/g, '');

  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (text.match(/\b[a-zA-Z0-9]+\b/g) || []).length;

  const chineseTime = chineseChars / chineseWPM;
  const englishTime = englishWords / englishWPM;

  const totalTime = chineseTime + englishTime;
  return Math.max(1, Math.ceil(totalTime));
}

function getWordFreq(words) {
  const freq = {};
  words.forEach(w => freq[w] = (freq[w] || 0) + 1);
  return freq;
}

function initializeRecommender(hexo, config) {
  recommendationCache = {};
  const Post = hexo.database.model('Post');
  let posts = Post.find({ published: true }).toArray().filter(p => !p.draft);

  if (posts.length === 0) {
    hexo.log.warn('无已发布文章，跳过推荐计算');
    return;
  }

  hexo.log.info(`推荐策略: ${config.strategy} | 权重分配: 语义=${config.weights.semantic}, 标题=${config.weights.title}, 标签=${config.weights.tag}, 分类=${config.weights.category}, 时效=${config.weights.recency}`);
  hexo.log.info(`开始处理 ${posts.length} 篇文章的推荐计算...`);

  // 1. 预处理
  const processedPosts = posts.map(post => {
    const titleWords = preprocess(post.title, config.stopwords);
    const contentWords = preprocess(post.content, config.stopwords);
    return {
      ...post,
      _titleWords: titleWords,
      _contentWords: contentWords,
      _titleFreq: getWordFreq(titleWords),
      _contentFreq: getWordFreq(contentWords),
      _titleWordSet: new Set(titleWords),
      _contentWordSet: new Set(contentWords)
    };
  });

  // 2. 全局词表 & IDF
  const allWordsSet = new Set();
  processedPosts.forEach(p => {
    Object.keys(p._titleFreq).forEach(w => allWordsSet.add(w));
    Object.keys(p._contentFreq).forEach(w => allWordsSet.add(w));
  });
  const docCount = processedPosts.length;

  const idfMap = {};
  allWordsSet.forEach(word => {
    let docFreq = 0;
    processedPosts.forEach(p => {
      if (p._titleWordSet.has(word) || p._contentWordSet.has(word)) {
        docFreq++;
      }
    });
    idfMap[word] = Math.log(docCount / (docFreq || 1));
  });

  hexo.log.info(`词表大小: ${allWordsSet.size} 个唯一词`);

  // 3. 构建稀疏向量（仅用于内容+标题语义）
  const docVectors = {};
  processedPosts.forEach(post => {
    const titleLen = post._titleWords.length;
    const contentLen = post._contentWords.length;
    const vector = {};

    if (titleLen > 0) {
      Object.keys(post._titleFreq).forEach(word => {
        const tf = post._titleFreq[word] / titleLen;
        const idf = idfMap[word] || 0;
        vector[word] = (vector[word] || 0) + tf * idf;
      });
    }

    if (contentLen > 0) {
      Object.keys(post._contentFreq).forEach(word => {
        const tf = post._contentFreq[word] / contentLen;
        const idf = idfMap[word] || 0;
        vector[word] = (vector[word] || 0) + tf * idf;
      });
    }

    const normPath = normalizePath(post.path);
    docVectors[normPath] = vector;
  });

  // 4. 稀疏余弦相似度（0~1）
  const cosineSimilarity = (vecA, vecB) => {
    let dot = 0, normA = 0, normB = 0;
    for (const w in vecA) {
      const a = vecA[w];
      const b = vecB[w] || 0;
      dot += a * b;
      normA += a * a;
    }
    for (const w in vecB) {
      normB += vecB[w] * vecB[w];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  };

  // 5. 生成推荐（0~100 分）
  const now = Date.now();
  const SIMILARITY_THRESHOLD = 10;

  processedPosts.forEach(post => {
    const normPath = normalizePath(post.path);
    const recommendations = processedPosts
      .filter(p => p.path !== post.path)
      .map(otherPost => {
        const otherNormPath = normalizePath(otherPost.path);

        // === 1. 内容+标题语义相似度 → weights.semantic 分 ===
        const semanticSim = Math.min(1, cosineSimilarity(docVectors[normPath], docVectors[otherNormPath]));
        const semanticScore = semanticSim * config.weights.semantic;

        // === 2. 标题关键词重合 → weights.title 分 ===
        let titleMatchScore = 0;
        if (post._titleWordSet.size > 0 && otherPost._titleWordSet.size > 0) {
          const common = [...post._titleWordSet].filter(w => otherPost._titleWordSet.has(w)).length;
          const maxPossible = Math.max(post._titleWordSet.size, otherPost._titleWordSet.size);
          const titleJaccard = common / maxPossible;
          titleMatchScore = titleJaccard * config.weights.title;
        }

        // === 3. 标签匹配 → weights.tag 分 ===
        let tagScore = 0;
        if (post.tags && otherPost.tags && post.tags.length > 0 && otherPost.tags.length > 0) {
          const postTagNames = new Set(post.tags.map(t => t.name));
          const otherTagNames = new Set(otherPost.tags.map(t => t.name));
          const commonTags = [...postTagNames].filter(t => otherTagNames.has(t)).length;
          const maxTags = Math.max(postTagNames.size, otherTagNames.size);
          const tagJaccard = commonTags / maxTags;
          tagScore = tagJaccard * config.weights.tag;
        }

        // === 4. 分类匹配 → weights.category 分 ===
        let categoryScore = 0;
        if (post.categories && otherPost.categories && post.categories.length > 0 && otherPost.categories.length > 0) {
          const postCatNames = new Set(post.categories.map(c => c.name));
          const otherCatNames = new Set(otherPost.categories.map(c => c.name));
          const commonCats = [...postCatNames].filter(c => otherCatNames.has(c)).length;
          const maxCats = Math.max(postCatNames.size, otherCatNames.size);
          const catJaccard = commonCats / maxCats;
          categoryScore = catJaccard * config.weights.category;
        }

        // === 5. 时效性加成 → weights.recency 分 ===
        const otherDate = otherPost.date instanceof Date ? otherPost.date : new Date(otherPost.date);
        const ageDays = (now - otherDate) / 86400000;
        const recencyFactor = Math.exp(-config.recencyDecay * ageDays / 30);
        const clampedFactor = Math.min(1, Math.max(0.8, recencyFactor));
        const recencyScore = clampedFactor * config.weights.recency;

        // === 总分（0~100）===
        let totalScore = semanticScore + titleMatchScore + tagScore + categoryScore + recencyScore;
        totalScore = Math.min(100, Math.max(0, totalScore));

        const type = totalScore > SIMILARITY_THRESHOLD ? 'related' : 'fallback';

        return {
          post: { ...otherPost, minutes: estimateReadingTime(otherPost.content) },
          score: totalScore,
          type
        };
      })
      .sort((a, b) => b.score - a.score);

    recommendationCache[normPath] = recommendations;
  });

  hexo.log.info('✅ 推荐系统预计算完成，分数已归一化至 0~100');
}

function getRecommendationCache() {
  return recommendationCache;
}

module.exports = {
  initializeRecommender,
  getRecommendationCache
};