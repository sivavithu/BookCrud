import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";


export default defineConfig(({ mode }) => ({
   server: {
    host: "::",
    port: 8080,
    proxy: {
      '/auth': {
        target: 'https://api-gateway.icywater-e2b57c27.southeastasia.azurecontainerapps.io',//gateway
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'https://api-gateway.icywater-e2b57c27.southeastasia.azurecontainerapps.io',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
