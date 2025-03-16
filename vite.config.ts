import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/edu-hub-connector-21/", // Add this for GitHub Pages
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Fix alias for "@/components/..."
    },
  },
});