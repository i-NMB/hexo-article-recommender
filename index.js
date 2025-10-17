'use strict';

module.exports = hexo => {
  hexo.log.info('✅ Loading hexo-article-recommender plugin...');
  try {
    require('./lib/helper')(hexo);
    hexo.log.info('✅ Helper "recommended_posts_full" registered.');
  } catch (err) {
    hexo.log.error('❌ Failed to load helper:', err.message);
    throw err;
  }
};