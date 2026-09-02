// 入口:挂载应用组件。壳只提供一个 iframe,挂载是应用自己的事。
import { createRoot } from "react-dom/client";
import "./wandesk/base.css";
import App from "./index";
createRoot(document.getElementById("root")!).render(<App appId="fortune" />);
