// lib/config.js
module.exports = {
  getConfig: function(hexo) {
    const hexoConfig = hexo.config.article_recommender || {};
    const strategy = (hexoConfig.strategy || 'balanced').toLowerCase();

    // 策略权重配置（各维度最大贡献分）
    const strategies = {
      'balanced': {
        semantic: 50,
        title: 20,
        tag: 15,
        category: 10,
        recency: 5
      },
      'title-focused': {
        semantic: 30,   // 降低
        title: 40,      // 大幅提升
        tag: 15,
        category: 10,
        recency: 5
      },
      'content-focused': {
        semantic: 70,   // 大幅提升
        title: 10,      // 降低
        tag: 10,
        category: 5,
        recency: 5
      }
    };

    const weights = strategies[strategy] || strategies.balanced;

    return {
      inject: hexoConfig.inject !== false,
      strategy,
      weights,
      recencyDecay: hexoConfig.recency_decay || 0.3,
      defaultCount: hexoConfig.default_count || 3,
      recommendedTitle: hexoConfig.recommended_title || '推荐文章',
      stopwords: new Set([
        // 中文
        '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '那', '里', '就是', '还是', '还', '可以', '他们', '我们', '你们', '它', '这个', '那个',
        // 英文
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
      ])
    };
  }
};