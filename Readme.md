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


如果您不想让推荐模块注入到文章页面底部，请在主博客`_config.yml`**关闭自动注入**`inject: false` 。以EJS为例，NJK同理，在你的主题模板（如 `post.ejs` 或 `post.swig`）中调用 Helper：

If you do not want the recommendation module to be injected at the bottom of article pages, please **disable auto-injection** by setting `inject: false` in your main blog’s `_config.yml`.The example below uses EJS; the same principle applies to Nunjucks (NJK).Call the Helper in your theme template (e.g., `post.ejs` or `post.swig`):



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



### 示例/Example：
```html
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
<% } %>
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

