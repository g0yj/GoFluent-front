import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

/**
 * ES Module vs Common JS
 * [import & export] vs [require() & module.exports]
 */
// ES Module에서 __dirname, __filename 사용하기
// 원래는 CommonJS에서만 사용 가능한데, ES Module에서도 사용할 수 있도록 하는 코드
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: false,
      },
    },
  },
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
});
