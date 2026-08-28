import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

// 壳的前端。开发态代理到内核(9600);应用不走这里 —— 它们在 workerd 自己的端口上。
export default defineConfig({
  root: "shell/ui",
  plugins: [react(), tailwind()],
  server: {
    port: 5180,
    proxy: { "/api": "http://127.0.0.1:9600" },
  },
  build: { outDir: "../../dist/ui", emptyOutDir: true },
});
