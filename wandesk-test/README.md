# wandesk-test

干净运行 Wandesk OSS,**不污染源码**。

`npm run dev` 会就地烤(把 `__T_` token 替换成字面量),直接在仓库根跑会把源码改脏。
这里把仓库根 rsync 到一次性副本 `run/`(已 gitignore),在副本里烤 + 跑。源码保持干净的 token 态。

```bash
cd wandesk-test
node test.js r3      # 首次:同步 + 装依赖 + 起 dev(英文)
node test.js r1      # 之后:同步 + 起 dev(保 db/deps)
node test.js r2      # 同步 + 清 db + 起 dev
AIOS_LANG=zh node test.js r1   # 烤中文
```

起来后浏览器开 http://localhost:9502
