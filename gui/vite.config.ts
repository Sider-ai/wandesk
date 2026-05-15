import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
var stdin_default = defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/ws": { target: "ws://localhost:9502", ws: true },
      "/api": { target: "http://localhost:9502" },
      "/apps": { target: "http://localhost:9502" }
    }
  },
  build: {
    outDir: "dist",
    emptyOutDir: true
  }
});
export {
  stdin_default as default
};
