# Hexo 文章推荐插件：`hexo-article-recommender`
> 📌 **智能、多维、可定制** 的文章推荐系统，为你的 Hexo 博客自动推荐相关文章。

# Hexo Article Recommendation Plugin

> 📌 **An intelligent, multi-dimensional, and customizable** article recommendation system that automatically suggests related articles for your Hexo blog.

## ✨功能亮点/Key Features
* **到手即用**：无需配置，安装后即可使用。
* **无需外部服务**：纯本地计算，无网络请求，保障隐私与速度。
* **多维度融合推荐**：结合语义内容、标题关键词、标签、分类、时效性五大维度。
* **三种推荐策略**：`balanced`（平衡）、`title-focused`（标题优先）、`content-focused`（内容优先）。
* **自动注入或手动调用**：支持自动插入文章底部，也提供 Helper 供主题自定义使用。
* **美观响应式卡片**：内置现代 CSS 样式，适配移动端，支持悬停动画与评分显示。
* **输出丰富元数据**：每篇推荐文章附带 `_recommendScore`、`_recommendType`、`minutes`（阅读时长）等字段，便于深度定制。



* **Ready to Use**: No configuration required, works immediately after installation.
* **No External Services**: Pure local computation with no network requests, ensuring privacy and speed.
* **Multi-dimensional Fusion Recommendation**: Combines five dimensions including semantic content, title keywords, tags, categories, and timeliness.
* **Three Recommendation Strategies**: balanced, title-focused, and content-focused.
* **Auto-injection or Manual Invocation**: Supports automatic insertion at the bottom of articles, and provides Helper for theme customization.
* **Beautiful Responsive Cards**: Built-in modern CSS styles, mobile-friendly, with hover animations and rating display.
* **Rich Metadata Output**: Each recommended article includes fields such as \_recommendScore, \_recommendType, minutes (reading time), etc., for deep customization.

---


## 🚀 安装/Installation
在你的 Hexo 博客根目录执行：

Execute in the root directory of your Hexo blog:

```bash
npm install hexo-article-recommender --save
```
> 💡 确保你的 Hexo 版本 ≥ 5.0。

> 💡 Ensure your Hexo version is 5.0 or later.

---


## ⚙️ 配置\_config.yml（可选）/Configure `_config.yml` (Optional)
恭喜您，在安装完毕后**可以直接使用**。

你使用我们的默认配置而无需在\_config.yml中添加配置，如果需要配置微调，可在 Hexo 主配置文件 `_config.yml` 中添加 `article_recommender` 配置项：



Congratulations! You can start using it right after installation.

You can use our default configuration **without** adding anything to `_config.yml`. If you need to fine-tune the settings, you can add the `article_recommender` configuration item to your main Hexo configuration file, `_config.yml`:

```yaml
article_recommender:
  # 是否自动将推荐模块注入到文章页面底部（默认 true）
  inject: true
  # 推荐策略（可选：balanced | title-focused | content-focused，默认 balanced）
  strategy: balanced
  # 默认推荐文章数量（默认 3）
  default_count: 3
  # 推荐区域标题（支持中英文）
  recommended_title: "推荐文章"
  # 时效性衰减系数（值越大，旧文章权重下降越快；默认 0.3）
  recency_decay: 0.3
```
### 策略说明（单位：%）/Strategy Description (Unit: %)
|策略名称<br>Strategy Name|语义占比<br>Semantic Weight|标题占比<br>Title Weight|标签占比<br>Tag Weight|分类占比<br>Category Weight|时效占比<br>Recency Weight|
| ----- | ----- | ----- | ----- | ----- | ----- |
|`balanced`(默认)|50|20|15|10|5|
|title-focused|30|40|15|10|5|
|content-focused|70|10|10|5|5|

> 所有维度分数归一化后加权求和，最终总分 **0\~100**。

> All dimension scores are normalized and then weighted for summation, resulting in a final score ranging from 0 to 100.

---


## 使用方式/Usage
### 方式一：自动注入（默认）/Method 1: Auto-injection (Default)
只需开启 `inject: true`（默认），插件会自动在每篇文章底部插入推荐卡片。

Simply enable `inject: true` (the default setting), and the plugin will automatically insert a recommendation card at the bottom of each article.



### 方式二：手动调用（高级定制）/Method 2: Manual invocation (Advanced customization)


该插件通常通过 Hexo 的 injects 机制，将推荐内容注入到主题模板中的`</article> `标签之后。但是如果遇到`</article>`标签之后不适用，或者在该位置的背景颜色与插件默认的颜色不搭，可以尝试手动注入模板。如果您不想让推荐模块注入到文章页面底部，请在主博客`_config.yml`**关闭自动注入**`inject: false` 。以EJS为例，NJK同理，在你的主题模板（如 `post.ejs` 或 `post.swig`）中调用 Helper：

This plugin typically injects recommended content after the `</article>` tag in theme templates through Hexo’s injects mechanism. However, if this position is not suitable, or if the background color conflicts with the plugin’s default color, you may try manual injection. If you do not want the recommendation module to be injected at the bottom of article pages, please **disable automatic injection** in your main blog’s `_config.yml` by setting `inject: false`. Taking EJS as an example (the same applies to NJK), call the Helper in your theme template (such as `post.ejs` or `post.swig`):



```html
<%- recommended_posts_full(page, 4) %>
```


* 第一个参数：当前文章对象（通常为 `page`）
* 第二个参数：推荐数量（可选，默认为 `default_count`）
* The first parameter: The current article object (typically `page`)
* The second parameter: Number of recommendations (optional, defaults to `default_count`)

> ✅ 此方式**不依赖 ****inject**** 配置**，即使 `inject: false` 也能使用。

> ✅ This method does not depend on the `inject` configuration and can be used even when `inject: false` is set.



当调用 `recommended_posts_full(post, count)` 或自动注入时，每篇推荐文章包含以下字段：

When calling `recommended_posts_full(post, count)` or using auto-injection, each recommended article contains the following fields:

|字段名称|字段类型|返回值说明|Description|
| ----- | ----- | ----- | ----- |
|title|string|文章标题|Article title|
|path|string|文章路径（用于`url_for`）|Article path (for use with `url_for`)|
|`description`/`excerpt`/`content`|string|用于生成摘要|Used for generating the excerpt|
|`author`/`author_name`/`author_id`|string|作者信息（按优先级）|Author information (by priority)|
|author_title|string|作者头衔（默认 "原创文章"）|Author title (defaults to “Original Article”)|
|minutes|number|**估算阅读时间（分钟）**，由插件自动计算|Estimated reading time in minutes, automatically calculated by the plugin|
|_recommendType|string|`"related"`（语义相关）或`"fallback"`（兜底推荐）|“related” (semantically related) or “fallback” (fallback recommendation)|
|_recommendScore|number|**推荐分数（0.0 \~ 100.0）**，保留1位小数|Recommendation score (0.0 \~ 100.0)|

> ✅ 所有原始文章字段（如 `tags`, `categories`, `date` 等）也完整保留。

> ✅ All original article fields (such as `tags`, `categories`, `date`, etc.) are also fully preserved.



### 示例|Example：

#### EJS 模板（如 landscape、fluid 等主题）|EJS templates (such as landscape, fluid, and other themes)

在你的**主题目录**下（如 `/themes/your-theme/layout/_partial/`）新建文件：

_Create a new file in your theme directory (e.g.,` /themes/your-theme/layout/_partial/`):

```
themes/your-theme/layout/_partial/article-recommender.ejs
```

内容为：

The content is as follows:

```ejs
<% if (posts.length) { %>
<div class="hexo-article-recommender-section">
  <div class="hexo-article-recommender-section-divider">
    <div class="hexo-article-recommender-divider-line"></div>
    <div class="hexo-article-recommender-divider-text">
      <span><%= recommendedTitle %></span>
    </div>
  </div>
 
  <div class="hexo-article-recommender-posts">
    <% posts.forEach((link, idx) => { %>
      <% const bgColors = ['#6a89cc, #4a69bd', '#e55039, #eb2f06', '#3dc1d3, #0fb9b1', '#f6b93b, #e55039'] %>
      <% const avatarColors = ['#4a69bd', '#e55039', '#3dc1d3', '#f6b93b'] %>
      <div class="hexo-article-recommender-post-card" data-bg="<%= bgColors[idx % bgColors.length] %>">
        <!-- 左上角：站内标签 -->
        <div class="hexo-article-recommender-site-tag">站内</div>
 
        <!-- 左下角：关系类型标签 + 相关度 -->
        <div class="hexo-article-recommender-relation-tag <%= link._recommendType === 'related' ? 'related' : 'fallback' %>">
          <%= link._recommendType === 'related' ? '相关' : '推荐' %>
          <span class="hexo-article-recommender-score">(<%= (link._recommendScore).toFixed(1) %>%)
        </span>
        </div>
 
        <div class="hexo-article-recommender-card-header">
          <div class="hexo-article-recommender-reading-time">
            <i class="fas fa-clock"></i>
            <%= link.minutes || link.reading_time || (link.symbols_count_time && link.symbols_count_time.mins) || '阅读' %>分钟
          </div>
        </div>
        <div class="hexo-article-recommender-card-content">
          <h4 class="hexo-article-recommender-post-title">
            <a href="<%- url_for(link.path) %>"><%= link.title %></a>
          </h4>
          <p class="hexo-article-recommender-post-excerpt">
            <%- (link.description || (link.excerpt && strip_html(link.excerpt)) || (link.content && strip_html(link.content)) || '点击查看推荐内容。').substring(0, 80) %>
          </p>
          <div class="hexo-article-recommender-author">
            <div class="hexo-article-recommender-author-avatar" style="background: <%= avatarColors[idx % avatarColors.length] %>;">
              <%= idx + 1 %>
            </div>
            <div class="hexo-article-recommender-author-info">
              <div class="hexo-article-recommender-author-name"><%= link.author || link.author_name || link.author_id || '本站作者' %></div>
              <div class="hexo-article-recommender-author-title"><%= link.author_title || '原创文章' %></div>
            </div>
          </div>
        </div>
      </div>
    <% }) %>
  </div>
  <h2 class="hexo-article-recommender-section-over">--- over ---</h2>
</div>
 
<style>
.hexo-article-recommender-section {
  margin-top: 60px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
 
.hexo-article-recommender-section-divider {
  position: relative;
  margin: 60px 0;
}
 
.hexo-article-recommender-divider-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, #6a89cc, transparent);
}
 
.hexo-article-recommender-divider-text {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 0 15px;
}
 
.hexo-article-recommender-divider-text span {
  color: #6a89cc;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
}
 
.hexo-article-recommender-section-over {
  text-align: center;
  margin: 30px;
  color: #9e9e9e;
}
 
.hexo-article-recommender-posts {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  justify-content: center;
}
 
.hexo-article-recommender-post-card {
  width: 280px;
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
  display: flex;
  flex-direction: column;
  min-height: 270px;
  position: relative;
}
 
.hexo-article-recommender-post-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}
 
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
 
.hexo-article-recommender-card-header {
  height: 60px;
  position: relative;
  background: linear-gradient(135deg, var(--bg-start), var(--bg-end));
  background-size: 200% 200%;
  animation: gradientShift 4s ease infinite alternate;
}
 
.hexo-article-recommender-post-card[data-bg^="#6a89cc"] .hexo-article-recommender-card-header {
  --bg-start: #6a89cc; --bg-end: #4a69bd;
}
.hexo-article-recommender-post-card[data-bg^="#e55039"] .hexo-article-recommender-card-header {
  --bg-start: #e55039; --bg-end: #eb2f06;
}
.hexo-article-recommender-post-card[data-bg^="#3dc1d3"] .hexo-article-recommender-card-header {
  --bg-start: #3dc1d3; --bg-end: #0fb9b1;
}
.hexo-article-recommender-post-card[data-bg^="#f6b93b"] .hexo-article-recommender-card-header {
  --bg-start: #f6b93b; --bg-end: #e55039;
}
 
.hexo-article-recommender-reading-time {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255,255,255,0.25);
  backdrop-filter: blur(4px);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}
 
.hexo-article-recommender-card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 60px);
  justify-content: space-between;
}
 
.hexo-article-recommender-post-title {
  margin-top: 0;
  font-size: 1.2em;
  line-height: 1.4;
  color: #2c3e50;
}
 
.hexo-article-recommender-post-title a {
  color: inherit;
  text-decoration: none;
  transition: color 0.25s ease;
}
 
.hexo-article-recommender-post-title a:hover {
  color: #6a89cc;
}
 
.hexo-article-recommender-post-excerpt {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin: 10px 0;
  overflow: hidden;
}
 
.hexo-article-recommender-author {
  display: flex;
  align-items: center;
}
 
.hexo-article-recommender-author-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-right: 10px;
}
 
.hexo-article-recommender-author-name {
  font-weight: 600;
  font-size: 14px;
}
 
.hexo-article-recommender-author-title {
  font-size: 12px;
  color: #888;
}
 
/* ========== 左上角：站内标签 ========== */
.hexo-article-recommender-site-tag {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(42, 170, 138, 0.9);
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 0 0 8px 0;
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
 
/* ========== 左下角：关系类型标签 ========== */
.hexo-article-recommender-relation-tag {
  position: absolute;
  bottom: 0;
  left: 0;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 0 8px 0 0;
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0;
  transform: translateY(100%);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
 
.hexo-article-recommender-relation-tag.related {
  background-color: rgba(42, 170, 138, 0.9); /* 绿色：相关 */
}
 
.hexo-article-recommender-relation-tag.fallback {
  background-color: rgba(229, 80, 57, 0.9); /* 橙红：推荐 */
}
 
.hexo-article-recommender-post-card:hover .hexo-article-recommender-relation-tag {
  opacity: 1;
  transform: translateY(0);
}
 
/* 相关度分数样式 */
.hexo-article-recommender-relation-tag .hexo-article-recommender-score {
  font-size: 10px;
  opacity: 0.8;
  margin-left: 4px;
}
 
/* 响应式 */
@media (max-width: 768px) {
  .hexo-article-recommender-posts {
    flex-direction: column;
    align-items: center;
  }
  .hexo-article-recommender-post-card {
    width: calc(100% - 30px);
    max-width: 400px;
  }
}
</style>
<% } %>
```

之后在对应的post模板中（\themes\you-theme-name\layout\post.ejs）找到想注入的地方（自己喜欢在哪就添加在哪）添加，其中include内容要指向上一步添加的recommended-posts.ejs文件路径

Then, in the corresponding post template (e.g., \themes\your-theme-name\layout\post.ejs), find the desired injection location (add it wherever you prefer) and add the include statement, where the include content should point to the file path of the recommended-posts.ejs file added in the previous step.

```ejs
<% 
  const cfg = config.article_recommender || {};
  const _ar_data = { 
    posts: recommended_posts_full(page, (cfg.default_count) || 3),
    recommendedTitle: cfg.recommended_title || '推荐文章主题推荐'
  };
%>
<%- partial('_partial/article-recommender', _ar_data) %>
```

#### Nunjucks模板（如NexT主题等）|Nunjucks templates (such as NexT theme, etc.)

以NexT为例，在\themes\next\layout\_partials中新建文件

Taking NexT as an example, create a new file in `\themes\next\layout_partials`

```bash
\themes\next\layout\_partials\recommended-posts.njk
```

内容为:

The content is as follows:

```html
{%- if posts and posts.length > 0 -%}
<div class="hexo-article-recommender-section">
  <div class="hexo-article-recommender-section-divider">
    <div class="hexo-article-recommender-divider-line"></div>
    <div class="hexo-article-recommender-divider-text">
      <span>{{ recommendedTitle or '推荐文章' }}</span>
    </div>
  </div>
 
  <div class="hexo-article-recommender-posts">
    {%- for link in posts -%}
      {%- set bgColors = [
        '#6a89cc, #4a69bd',
        '#e55039, #eb2f06',
        '#3dc1d3, #0fb9b1',
        '#f6b93b, #e55039'
      ] -%}
      {%- set avatarColors = ['#4a69bd', '#e55039', '#3dc1d3', '#f6b93b'] -%}
      {%- set idx = loop.index0 -%}
      <div class="hexo-article-recommender-post-card" data-bg="{{ bgColors[idx % bgColors.length] }}">
        <div class="hexo-article-recommender-site-tag">站内</div>
 
        <div class="hexo-article-recommender-relation-tag {{ 'related' if link._recommendType == 'related' else 'fallback' }}">
          {{ '相关' if link._recommendType == 'related' else '推荐' }}
          <span class="hexo-article-recommender-score">({{ link._recommendScore | round(1) }}%)</span>
        </div>
 
        <div class="hexo-article-recommender-card-header">
          <div class="hexo-article-recommender-reading-time">
            <i class="fas fa-clock"></i>
            {{ link.minutes or link.reading_time or (link.symbols_count_time and link.symbols_count_time.mins) or '阅读' }}分钟
          </div>
        </div>
        <div class="hexo-article-recommender-card-content">
          <h4 class="hexo-article-recommender-post-title">
            <a href="{{ url_for(link.path) }}">{{ link.title }}</a>
          </h4>
          <p class="hexo-article-recommender-post-excerpt">
            {{ (link.description or (link.excerpt and strip_html(link.excerpt)) or (link.content and strip_html(link.content)) or '点击查看推荐内容。') | truncate(80, false) }}
          </p>
          <div class="hexo-article-recommender-author">
            <div class="hexo-article-recommender-author-avatar" style="background: {{ avatarColors[idx % avatarColors.length] }};">
              {{ idx + 1 }}
            </div>
            <div class="hexo-article-recommender-author-info">
              <div class="hexo-article-recommender-author-name">{{ link.author or link.author_name or link.author_id or '本站作者' }}</div>
              <div class="hexo-article-recommender-author-title">{{ link.author_title or '原创文章' }}</div>
            </div>
          </div>
        </div>
      </div>
    {%- endfor -%}
  </div>
  <h2 class="hexo-article-recommender-section-over">--- over ---</h2>
</div>
 
<style>
.hexo-article-recommender-section {
  margin-top: 60px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
 
.hexo-article-recommender-section-divider {
  position: relative;
  margin: 60px 0;
}
 
.hexo-article-recommender-divider-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, #6a89cc, transparent);
}
 
.hexo-article-recommender-divider-text {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 0 15px;
}
 
.hexo-article-recommender-divider-text span {
  color: #6a89cc;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
}
 
.hexo-article-recommender-section-over {
  text-align: center;
  margin: 30px;
  color: #9e9e9e;
}
 
.hexo-article-recommender-posts {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  justify-content: center;
}
 
.hexo-article-recommender-post-card {
  width: 280px;
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
  display: flex;
  flex-direction: column;
  min-height: 270px;
  position: relative;
}
 
.hexo-article-recommender-post-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}
 
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
 
.hexo-article-recommender-card-header {
  height: 60px;
  position: relative;
  background: linear-gradient(135deg, var(--bg-start), var(--bg-end));
  background-size: 200% 200%;
  animation: gradientShift 4s ease infinite alternate;
}
 
.hexo-article-recommender-post-card[data-bg^="#6a89cc"] .hexo-article-recommender-card-header {
  --bg-start: #6a89cc; --bg-end: #4a69bd;
}
.hexo-article-recommender-post-card[data-bg^="#e55039"] .hexo-article-recommender-card-header {
  --bg-start: #e55039; --bg-end: #eb2f06;
}
.hexo-article-recommender-post-card[data-bg^="#3dc1d3"] .hexo-article-recommender-card-header {
  --bg-start: #3dc1d3; --bg-end: #0fb9b1;
}
.hexo-article-recommender-post-card[data-bg^="#f6b93b"] .hexo-article-recommender-card-header {
  --bg-start: #f6b93b; --bg-end: #e55039;
}
 
.hexo-article-recommender-reading-time {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255,255,255,0.25);
  backdrop-filter: blur(4px);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}
 
.hexo-article-recommender-card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 60px);
  justify-content: space-between;
}
 
.hexo-article-recommender-post-title {
  margin-top: 0;
  font-size: 1.2em;
  line-height: 1.4;
  color: #2c3e50;
}
 
.hexo-article-recommender-post-title a {
  color: inherit;
  text-decoration: none;
  transition: color 0.25s ease;
}
 
.hexo-article-recommender-post-title a:hover {
  color: #6a89cc;
}
 
.hexo-article-recommender-post-excerpt {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin: 10px 0;
  overflow: hidden;
}
 
.hexo-article-recommender-author {
  display: flex;
  align-items: center;
}
 
.hexo-article-recommender-author-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-right: 10px;
}
 
.hexo-article-recommender-author-name {
  font-weight: 600;
  font-size: 14px;
}
 
.hexo-article-recommender-author-title {
  font-size: 12px;
  color: #888;
}
 
/* ========== 左上角：站内标签 ========== */
.hexo-article-recommender-site-tag {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(42, 170, 138, 0.9);
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 0 0 8px 0;
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
 
/* ========== 左下角：关系类型标签 ========== */
.hexo-article-recommender-relation-tag {
  position: absolute;
  bottom: 0;
  left: 0;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 0 8px 0 0;
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0;
  transform: translateY(100%);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
 
.hexo-article-recommender-relation-tag.related {
  background-color: rgba(42, 170, 138, 0.9); /* 绿色：相关 */
}
 
.hexo-article-recommender-relation-tag.fallback {
  background-color: rgba(229, 80, 57, 0.9); /* 橙红：推荐 */
}
 
.hexo-article-recommender-post-card:hover .hexo-article-recommender-relation-tag {
  opacity: 1;
  transform: translateY(0);
}
 
/* 相关度分数样式 */
.hexo-article-recommender-relation-tag .hexo-article-recommender-score {
  font-size: 10px;
  opacity: 0.8;
  margin-left: 4px;
}
 
/* 响应式 */
@media (max-width: 768px) {
  .hexo-article-recommender-posts {
    flex-direction: column;
    align-items: center;
  }
  .hexo-article-recommender-post-card {
    width: calc(100% - 30px);
    max-width: 400px;
  }
}
</style>
{%- endif -%}
```

然后，在对应的post模板中（`/themes/you-theme-name/layout/post.njk`）找到想注入的地方（自己喜欢在哪就添加在哪）添加，其中include内容要指向上一步添加的`recommended-posts.njk`文件路径。

Then, in the corresponding post template (e.g., `/themes/your-theme-name/layout/post.njk`), find the desired injection location (add it wherever you prefer) and add the include statement, where the include content should point to the file path of the `recommended-posts.njk` file added in the previous step.

```njk
  {% set cfg = config.article_recommender or {} %}
  {% set _ar_data = {
    posts: recommended_posts_full(page, cfg.default_count or 3),
    recommendedTitle: cfg.recommended_title or '推荐文章主题推荐'
  } %}
  {% set posts = _ar_data.posts %}
  {% set recommendedTitle = _ar_data.recommendedTitle %}
  {% include '_partials/recommended-posts.njk' %}
```



---


## 🎨 自定义样式/Custom Styling
插件内置 CSS 类名均以 `hexo-article-recommender-` 开头，你可以：

1. **覆盖变量**：通过 CSS 自定义颜色、间距等。
2. **完全重写模板**：复制 `node_modules/hexo-article-recommender/templates/recommendation.ejs` 到你的主题，并修改注入逻辑。
3. **禁用内置样式**：在自定义模板中移除 `<style>` 标签，自行引入 CSS。



All built-in CSS class names are prefixed with `hexo-article-recommender-`. You can:

1. **Override variables**: Customize colors, spacing, etc., via CSS.
2. **Completely rewrite the template**: Copy `node_modules/hexo-article-recommender/templates/recommendation.ejs` to your theme and modify the injection logic.
3. **Disable built-in styles**: Remove the `<style>` tag in your custom template and include your own CSS.

---


## 🌐 多语言支持
插件内置中英文停用词表，自动过滤无意义词汇（如“的”、“the”、“and”等），提升关键词提取准确性。

The plugin includes built-in Chinese and English stop word lists to automatically filter out meaningless words (such as “的”, “the”, “and”, etc.), thereby improving the accuracy of keyword extraction.

---


## 📦 依赖说明/Dependencies
* 无外部依赖（纯 Node.js）
* 兼容 Hexo 7.0+
* 不修改原始文章数据，仅读取



* No external dependencies (pure Node.js)
* Compatible with Hexo 7.0+
* Does not modify original article data, only reads from it

---


## ❓ 常见问题/Frequently Asked Questions
### Q: 推荐结果不准确？
A: 尝试切换 `strategy`：

* 标题关键词重要？ → `title-focused`
* 内容深度相似？ → `content-focused`

### Q: 如何关闭自动注入？
A: 在 `_config.yml` 中设置：

```yaml
article_recommender:
  inject: false
```
### Q: 阅读时间不准？
A: 插件按 **260字/分钟（中文）+ 200字/分钟（英文）计数** 估算。该数据是通过一些专业研究得出的并通过优化后得出的，对大多数用户，默认值已足够准确。后续可能会让这些常数置入\_config.yml中让您进行配置。

|语言|研究名称|数据来源|阅读速度|
| ----- | ----- | ----- | ----- |
|中文|快速读者与慢速读者研究（2024）|华东师范大学|259.5 字/分钟|
|中文|教育部课程标准（2005）|中国教育部|300～600 字/分钟（按年级）|
|中文|小学生眼动研究（2018）|天津小学实验|104～118 字/分钟|
|英文|阅读速度元分析（2024）|Audio-Reader|200～260 词/分钟|
|英文|全球阅读能力报告（2023）|IRA|200～250 词/分钟|
|中英文对比|Sun et al.（1985）|Perception & Psychophysics|382 vs 386（几乎相同）|





### **Q: The recommendation results are inaccurate?**
**A:** Try switching the strategy:
• Are title keywords important? → `title-focused`
• Is deep content similarity important? → `content-focused`

### **Q: How to disable auto-injection?**
**A:** Set the following in `_config.yml`:

```yaml
article_recommender:
  inject: false
```
### **Q: The reading time is inaccurate?**
**A:** The plugin estimates reading time based on 260 characters/minute (Chinese) + 200 words/minute (English). These figures are derived from professional research and optimized, and are sufficiently accurate for most users. These constants may be made configurable in `_config.yml` in a future update.

|Language|Research Name|Data Source|Reading Speed|
| ----- | ----- | ----- | ----- |
|Chinese|Fast and Slow Reader Study (2024)|East China Normal University|259.5 characters/minute|
|Chinese|Ministry of Education Curriculum Standards (2005)|Ministry of Education of the PRC|300-600 characters/minute (by grade level)|
|Chinese|Primary School Student Eye-Tracking Study (2018)|Tianjin Primary School Experiment|104-118 characters/minute|
|English|Reading Speed Meta-Analysis (2024)|Audio-Reader|200-260 words/minute|
|English|Global Literacy Report (2023)|IRA|200-250 words/minute|
|Chinese-English Comparison|Sun et al. (1985)|Perception & Psychophysics|382 vs 386|

---


## 🧠 流程图/**Flowchart**
为了让大家更好的理解这个插件，我特地制作了插件运行的流程图。To help everyone better understand this plugin, I have specially created a flowchart illustrating its operational process.

![image](https://github.com/i-NMB/hexo-article-recommender/blob/main/images/flowchart.png)



## 🙌 贡献与反馈/Contributions & Feedback
欢迎提交 Issue 或 PR！
GitHub: [https://github.com/i-NMB/hexo-article-recommender/issues](https://github.com/i-NMB/hexo-article-recommender/issues)



Issues and Pull Requests are welcome!

GitHub: [https://github.com/i-NMB/hexo-article-recommender/issues](https://github.com/i-NMB/hexo-article-recommender/issues)



## 📜 License
AGLPv3 © i囡漫笔（iNMB）

