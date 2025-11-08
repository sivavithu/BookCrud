import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";


export default defineConfig(({ mode }) => {
  // Load environment variables - fall back to localhost only in development
  const apiUrl = process.env.VITE_API_URL || (mode === 'development' ? 'http://localhost:5000' : '');
  
  if (!apiUrl) {
    console.warn('⚠️  VITE_API_URL is not set. API proxy will not be configured.');
  }
  
  return {
    server: {
      host: "::",
      port: 8080,
      proxy: apiUrl ? {
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
      } : undefined,
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
