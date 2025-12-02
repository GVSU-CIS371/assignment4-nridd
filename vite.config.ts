import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const repoName = "assignment4-nridd"; 

export default defineConfig({
  base: `/${repoName}/`,
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
