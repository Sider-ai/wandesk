# 记账本 (finance)

一本拟物黑皮存折:皮革书脊 + 烫金书名、金属订线、米色账页 + 蓝色暗纹、点阵打印机字体。
按月翻查(◄ ►,当月不能再往后),一张流水表,行内双击改、底部一行录入。纯本地,无 AI。

## 数据

`app_finance_transactions`:一笔一行。`type` income/expense、`amount` 金额、`note` 摘要、
`date` 存 `YYYY-MM-DDT12:00:00`(按 `substr(date,1,7)` 归月)。首次打开若整表为空,播种几条
示例流水,顺手演示用法。

## 界面

- 头部:月份翻页 + 汇总盒(本月 收入 / 支出 / 结余)。
- 账表:日期 / 摘要 / 支出 / 存入 / 操作。支出记在"支出"列(红),收入记在"存入"列(绿);
  双击单元格改日期/摘要/金额,底部一行填数回车即记,悬停出删除。末尾留空行凑账本样子。

## 目录与修改

- `app.json` 清单 · `APP.md` 本文件 · `server.js` 后端(Worker,建表脚本在里面)· `public/` 前端产物 · `src/` 前端源码(React)
- **改前端**:改 `src/`,然后在本目录 `npm install && npm run build`,产物落回 `public/`,窗口刷新即生效。需要本机装有 Node.js;不改就不需要。
- **改后端**:直接改 `server.js`,下一次请求即生效,不用重启。
- **数据**:`data.db` 是本应用的 SQLite,`sqlite3 data.db` 可直接查;表结构见 `server.js` 顶部的 SCHEMA。
