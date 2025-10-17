// lib/register.js
const recommendedPostsFull = require('./helper');

module.exports = hexo => {
  const config = hexo.config.article_recommender || {};
  const defaultCount = config.count || 4;

  hexo.extend.helper.register('recommended_posts_full', function(post, count = defaultCount) {
    return recommendedPostsFull.call(this, post, count);
  });
};