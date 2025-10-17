'use strict';

const { initializeRecommender, getRecommendationCache } = require('./lib/recommender');
const { getRecommendedPosts } = require('./lib/helper');
const { getConfig } = require('./lib/config');
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m'
const BLUE = '\x1b[34m'
// ✅ 插件只加载一次：用一个标志防止重复初始化
if (hexo.locals.get('articleRecommenderLoaded')) {
  return;
}
hexo.locals.set('articleRecommenderLoaded', true);

hexo.log.info('✅ 正在加载"文章推荐插件" | Loading hexo-article-recommender...');

const config = getConfig(hexo);

// 注册 helper：通过闭包传入 getCache 函数
hexo.extend.helper.register('recommended_posts_full', function(post, count) {
  return getRecommendedPosts.call(this, post, count || config.defaultCount, config, getRecommendationCache);
});

// 预计算
hexo.extend.filter.register('before_generate', function() {
  const start = Date.now();
  initializeRecommender(hexo, config); // 内部设置缓存
  hexo.log.info(`${GREEN}✅${RESET} 推荐系统预计算完成，耗时 ${YELLOW}${Date.now() - start}ms${RESET}`);
  hexo.log.info(
    `${GREEN}✅${RESET} 缓存已构建，共 ${CYAN}${Object.keys(getRecommendationCache()).length}${RESET} 篇文章`
  );
});

hexo.log.info('✅ Helper "recommended_posts_full" 注册成功');