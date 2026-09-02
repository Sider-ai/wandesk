import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

// The shell front end. In dev, /api is proxied to the kernel (9600); apps do not go through here — they run on workerd's own port.
export default defineConfig({
  root: "shell/ui",
  plugins: [react(), tailwind()],
  server: {
    port: 5180,
    proxy: { "/api": "http://127.0.0.1:9600" },
  },
  build: { outDir: "../../dist/ui", emptyOutDir: true },
});
