import { useReader } from './lib/useReader';
import { Shelf } from './components/Shelf';
import { ReaderView } from './components/ReaderView';
import './style.css';

/* ════════════════════════════════════════════════════
   阅读 —— 晨光里的浅桦木书架(iReader Birch)。
   首屏"书架":浅桦木书柜,书封按体裁排版;阅读页:米白纸面通栏长文,
   宋体、朱红首字下沉、"你选择了"朱批,抉择随内容滚动。
   一本 book 对应一个引擎会话(原生多轮续写),失效则用已存 pages 重建;
   进度全量持久化,重开整篇载入并停在抉择点。
   本文件只做视图切换;状态与逻辑在 lib/useReader,数据在 db.ts,
   人设/解析在 lib/story,视图在 components/。
   ════════════════════════════════════════════════════ */

export default function Reader({ appId }: { appId: string }) {
  const rd = useReader(appId);
  return rd.view === 'shelf' ? <Shelf rd={rd} /> : <ReaderView rd={rd} />;
}
