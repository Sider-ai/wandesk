# 算一卦 (fortune)

周易六爻起卦 + AI 解卦。一次性:写下求问 → 摇三枚铜钱六次成卦 → 卦师断吉凶。
只用通用的 `agent` 能力 — 没有 per-app 后端,也不再用 `db`。

## Data — 不存历史,只缓存最后一卦

- **无历史、无数据库**。求问是一次性的;只把「最后一卦」缓存在浏览器
  `localStorage["wandesk.fortune.last"]`(`{question,hexName,yaos,changing,pair,reading}`),
  以便重开应用时仍见上一卦。点「重新起卦」即清掉该缓存、回到起卦。
- 旧的 `readings` 表(`schema.sql`)已弃用,不再写入(留着不影响)。

## How a divination works (`ui/src/apps/fortune/index.tsx`)

1. **起卦(纯前端)**:用确定性的伪随机摇三枚铜钱六次,每次得一爻(阴/阳),
   自下而上组成六爻,按 8×8 卦表查出 64 卦之一的卦名。摇卦过程有铜钱旋转动画。
2. **解卦(AI)**:把"求问 + 所得卦名 + 六爻阴阳"组成 prompt,
   调用 `agent(appId, prompt, { system: 卦师人设 })` —— 人设让 Claude 扮演学识渊博、
   文笔古雅的算命先生,要求只返回 JSON `{signName,signPoem,good,bad,advice}`。
   前端解析 JSON(容错:从文本中抽取 `{...}`),渲染到卦象签卡。
3. **缓存(仅最后一卦)**:解卦成功后把这一卦写入 `localStorage`,不落库、不建历史。

## 布局(`ui/src/apps/fortune/index.tsx`)

单列、居中、可上下滚动:起卦前是**居中输入框**(求问 + 起卦按钮);起卦后依次
展示 **卦区**(六爻卦象)与 **解读区**(签诗 / 宜忌 / 解读),最底部是「**重新起卦**」按钮。

## Notes

- 卦象与铜钱的随机性在前端;AI 只负责解读所得之卦,不改卦象。
- 仅供娱乐参考 — 尽人事,听天命。
