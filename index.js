const recommendedPostsFull = require('./lib/helper');
hexo.log.info('✅ 正在加载“文章推荐插件”|Loading hexo-article-recommender...');
hexo.extend.helper.register('recommended_posts_full', recommendedPostsFull);
hexo.log.info('✅ Helper "recommended_posts_full" registered.');