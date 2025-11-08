import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";


export default defineConfig(({ mode }) => {
  // Load environment variables
  const apiUrl = process.env.VITE_API_URL || 'https://localhost:5000';
  
  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        '/auth': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: apiUrl,
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
  };
});
