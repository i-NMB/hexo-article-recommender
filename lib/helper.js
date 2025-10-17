// lib/helper.js
module.exports = function(post, count = 4) {
  if (!post || !this.site) return [];

  const site = this.site;
  const currentPath = post.path;
  const allPosts = site.posts.filter(p => p.path !== currentPath && p.published !== false).toArray();

  if (allPosts.length === 0) return [];

  const stopwords = new Set([
    // 中文
    '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '那', '里', '就是', '还是', '还', '可以', '他们', '我们', '你们', '它', '这个', '那个',
    // 英文
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
  ]);

  const preprocess = (text = '') => {
    return (text || '')
      .replace(/<[^>]*>/g, '')
      .replace(/[^\w\u4e00-\u9fa5]/g, ' ')
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 1 && !stopwords.has(word));
  };

  const currentTitleWords = preprocess(post.title);
  const currentContentWords = preprocess(post.content);
  const currentAllWords = [...currentTitleWords, ...currentContentWords];

  if (currentAllWords.length === 0) return [];

  const docCount = allPosts.length + 1;
  const wordDocFreq = {};

  const updateWordFreq = (words) => {
    new Set(words).forEach(word => {
      wordDocFreq[word] = (wordDocFreq[word] || 0) + 1;
    });
  };

  updateWordFreq(currentAllWords);
  allPosts.forEach(p => {
    const words = [...preprocess(p.title), ...preprocess(p.content)];
    updateWordFreq(words);
  });

  const currentTfIdf = {};
  const wordCount = currentAllWords.length;
  const titleWeight = 2;
  const contentWeight = 1;

  const weightedWordCount = {};
  currentTitleWords.forEach(w => {
    weightedWordCount[w] = (weightedWordCount[w] || 0) + titleWeight;
  });
  currentContentWords.forEach(w => {
    weightedWordCount[w] = (weightedWordCount[w] || 0) + contentWeight;
  });

  Object.keys(weightedWordCount).forEach(word => {
    const tf = weightedWordCount[word] / wordCount;
    const idf = Math.log(docCount / (wordDocFreq[word] || 1));
    currentTfIdf[word] = tf * idf;
  });

  const currentWords = Object.keys(currentTfIdf);

  const scoredPosts = allPosts.map(p => {
    const titleWords = preprocess(p.title);
    const contentWords = preprocess(p.content);
    const allWords = [...titleWords, ...contentWords];

    if (allWords.length === 0) {
      return { post: p, score: 0 };
    }

    const otherWeighted = {};
    titleWords.forEach(w => {
      if (currentWords.includes(w)) otherWeighted[w] = (otherWeighted[w] || 0) + titleWeight;
    });
    contentWords.forEach(w => {
      if (currentWords.includes(w)) otherWeighted[w] = (otherWeighted[w] || 0) + contentWeight;
    });

    let dotProduct = 0;
    let normCurrent = 0;
    let normOther = 0;

    currentWords.forEach(word => {
      const a = currentTfIdf[word] || 0;
      const b = ((otherWeighted[word] || 0) / allWords.length) * Math.log(docCount / (wordDocFreq[word] || 1));
      dotProduct += a * b;
      normCurrent += a * a;
      normOther += b * b;
    });

    const cosineSim = normCurrent === 0 || normOther === 0 ? 0 : dotProduct / (Math.sqrt(normCurrent) * Math.sqrt(normOther));

    let bonus = 0;
    if (post.tags && p.tags) {
      const commonTags = post.tags.filter(t => p.tags.map(pt => pt.name).includes(t.name));
      if (commonTags.length > 0) bonus += 0.1;
    }
    if (post.categories && p.categories) {
      const commonCats = post.categories.filter(c => p.categories.map(pc => pc.name).includes(c.name));
      if (commonCats.length > 0) bonus += 0.1;
    }
    if (titleWords.some(w => currentTitleWords.includes(w))) bonus += 0.15;

    const clean = (p.content || '').replace(/<[^>]*>/g, '').replace(/\s+/g, '');
    p.minutes = Math.max(1, Math.ceil(clean.length / 500));

    return { post: p, score: cosineSim + bonus };
  });

  scoredPosts.sort((a, b) => b.score - a.score);
  return scoredPosts.slice(0, count).map(item => item.post);
};