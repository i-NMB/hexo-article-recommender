module.exports = {
  getConfig: function(hexo) {
    const hexoConfig = hexo.config.article_recommender || {};
    
    return {
      weights: {
        title: hexoConfig.title_weight || 2,
        content: hexoConfig.content_weight || 1,
        tag: hexoConfig.tag_weight || 0.05,
        category: hexoConfig.category_weight || 0.1
      },
      recencyDecay: hexoConfig.recency_decay || 0.5,
      defaultCount: hexoConfig.default_count || 4,
      stopwords: new Set([
        // 中文
        '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '那', '里', '就是', '还是', '还', '可以', '他们', '我们', '你们', '它', '这个', '那个',
        // 英文
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
      ])
    };
  }
};