import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  define: { __BUILD_ID__: JSON.stringify(process.env.WORKERS_CI_COMMIT_SHA?.slice(0, 12) || Date.now().toString(36)) },
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart({ server: { entry: "server" } }),
    viteReact(),
    tailwindcss(),
  ],
});
