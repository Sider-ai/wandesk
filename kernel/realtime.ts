// WebSocket:内核 → 壳的单向广播。
//
// 只有一条链路,不做房间不做订阅 —— 壳是唯一的客户端,事件量也小。
// 应用不直接连这里:应用的 UI 请求经 env.UI → HostGate → 内核 → 这里 → 壳。
import type { IncomingMessage } from "http";
import type { Duplex } from "stream";
import { createHash } from "crypto";

type Client = { socket: Duplex; alive: boolean };
const clients = new Set<Client>();

const GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

/** 极简 WebSocket 服务端:只发文本帧、不收业务消息,省掉一个依赖。 */
export const handleUpgrade = (req: IncomingMessage, socket: Duplex) => {
  const key = req.headers["sec-websocket-key"];
  if (typeof key !== "string") { socket.destroy(); return; }
  const accept = createHash("sha1").update(key + GUID).digest("base64");
  socket.write(
    "HTTP/1.1 101 Switching Protocols\r\n" +
    "Upgrade: websocket\r\nConnection: Upgrade\r\n" +
    `Sec-WebSocket-Accept: ${accept}\r\n\r\n`,
  );
  const client: Client = { socket, alive: true };
  clients.add(client);
  const drop = () => { client.alive = false; clients.delete(client); };
  socket.on("close", drop);
  socket.on("error", drop);
  socket.on("end", drop);
};

const frame = (text: string): Buffer => {
  const payload = Buffer.from(text, "utf8");
  const len = payload.length;
  let header: Buffer;
  if (len < 126) {
    header = Buffer.from([0x81, len]);
  } else if (len < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x81; header[1] = 126; header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81; header[1] = 127; header.writeBigUInt64BE(BigInt(len), 2);
  }
  return Buffer.concat([header, payload]);
};

export const broadcast = (event: string, payload: unknown = {}) => {
  if (!clients.size) return;
  const buf = frame(JSON.stringify({ event, payload }));
  for (const client of clients) {
    if (!client.alive) continue;
    try { client.socket.write(buf); } catch { client.alive = false; clients.delete(client); }
  }
};
