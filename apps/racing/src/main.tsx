// Entry point: mounts the app component. The shell only provides an iframe; mounting is the app's own responsibility.
import { createRoot } from "react-dom/client";
import "./wandesk/base.css";
import App from "./index";
createRoot(document.getElementById("root")!).render(<App appId="racing" />);
