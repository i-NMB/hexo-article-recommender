'use strict';

const { initializeRecommender, getRecommendationCache } = require('./lib/recommender');
const { getRecommendedPosts } = require('./lib/helper');
const { getConfig } = require('./lib/config');
const path = require('path');
const fs = require('fs');

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';

// 防止重复加载
if (hexo.locals.get('articleRecommenderLoaded')) {
  return;
}
hexo.locals.set('articleRecommenderLoaded', true);

hexo.log.info('✅ 正在加载"文章推荐插件" | Loading hexo-article-recommender...');

const config = getConfig(hexo);

// 注册 helper（供模板手动调用）
hexo.extend.helper.register('recommended_posts_full', function(post, count) {
  return getRecommendedPosts.call(this, post, count || config.defaultCount, config, getRecommendationCache);
});

// 预计算推荐缓存（在生成前执行）
hexo.extend.filter.register('before_generate', function() {
  const start = Date.now();
  initializeRecommender(hexo, config);
  hexo.log.info(`${GREEN}✅${RESET} 推荐系统预计算完成，耗时 ${YELLOW}${Date.now() - start}ms${RESET}`);
  hexo.log.info(
    `${GREEN}✅${RESET} 缓存已构建，共 ${CYAN}${Object.keys(getRecommendationCache()).length}${RESET} 篇文章`
  );
});

// 仅使用 after_render:html 注入推荐内容（确保缓存已构建）
if (config.inject) {
  hexo.extend.filter.register('after_render:html', function(result, data) {
    // 仅处理文章页面
    if (!data.page || data.page.layout !== 'post') {
      return result;
    }

    const cache = getRecommendationCache();
    if (!cache || Object.keys(cache).length === 0) {
      hexo.log.warn('推荐缓存为空或未初始化');
      return result;
    }

    const currentPath = data.page.path;
    if (!currentPath) return result;

    const posts = getRecommendedPosts(data.page, config.defaultCount, config, getRecommendationCache);
    if (!posts || posts.length === 0) {
      hexo.log.warn(`未找到 ${currentPath} 的推荐文章`);
      return result;
    } else {
	  hexo.log.info(`✅ 为文章 ${currentPath} 找到 ${posts.length} 篇推荐`);
	}

    try {
      const templatePath = path.join(__dirname, 'templates/recommendation.ejs');
      const template = fs.readFileSync(templatePath, 'utf8');
      const rendered = hexo.render.renderSync({
        text: template,
        engine: 'ejs'
      }, {
        posts,
        recommendedTitle: config.recommendedTitle,
        url_for: hexo.extend.helper.get('url_for').bind(this),
        strip_html: hexo.extend.helper.get('strip_html').bind(this)
      });

      const marker = '</article>';
      if (result.includes(marker)) {
        return result.replace(marker, marker + rendered);
      } else {
        const bodyEnd = '</body>';
        if (result.includes(bodyEnd)) {
          return result.replace(bodyEnd, rendered + bodyEnd);
        } else {
          return result + rendered;
        }
      }
    } catch (error) {
      hexo.log.error('推荐文章注入失败:', error);
      return result;
    }
  });
}

hexo.log.info('✅ Helper "recommended_posts_full" 注册成功');