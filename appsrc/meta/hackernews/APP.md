# Hacker News (hackernews)

HN 头条阅读器。用 Algolia HN API 一次取一页,切换热门(front_page)/最新(date 排序)/
Ask HN。纯联网、无数据库。

## 数据

无本地表。`proxy(appId, url)` 拉 `https://hn.algolia.com/api/v1/search…`,解析 body JSON 的 `hits`。

## 界面

顶部分段(热门/最新/Ask)+ 列表:序号、标题、分数、作者、评论数、来源域名。
点标题 `window.open` 原文;点评论 `window.open` 到 `news.ycombinator.com/item?id=…`。
