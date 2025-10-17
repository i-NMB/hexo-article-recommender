'use strict';

module.exports = hexo => {
  hexo.log.info('✅ Loading hexo-article-recommender plugin (v0.0.1-alpha.4)...');
  try {
    require('./lib/register')(hexo);
    hexo.log.info('✅ Plugin hexo-article-recommender loaded successfully.');
  } catch (err) {
    hexo.log.error('❌ Failed to load hexo-article-recommender:', err.message);
    throw err;
  }
};