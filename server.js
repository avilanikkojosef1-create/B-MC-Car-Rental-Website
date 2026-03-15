import express from "express";
import axios from "axios";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("=== SERVER STARTUP INITIATED ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT env var:", process.env.PORT);
console.log("K_SERVICE env var:", process.env.K_SERVICE ? "Present (Cloud Run)" : "Not present");

async function startServer() {
  try {
    const app = express();
    const PORT = Number(process.env.PORT) || 3000;
    console.log(`Configured to listen on port: ${PORT}`);

    app.use(express.json());
    app.use(cookieParser());

    // Health check endpoint for Cloud Run
    app.get("/health", (req, res) => {
      res.status(200).send("OK");
    });

    // GitHub API URLs
    const GITHUB_USER_URL = "https://api.github.com/user";

    // API Routes
    app.get("/api/github/status", async (req, res) => {
      const rawToken = process.env.GITHUB_TOKEN;
      const token = rawToken?.trim();
      
      if (!token) {
        return res.json({ 
          connected: false, 
          error: "GITHUB_TOKEN not configured",
          debug: {
            exists: rawToken !== undefined,
            length: rawToken?.length || 0
          }
        });
      }

      try {
        const response = await axios.get(GITHUB_USER_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Agent": "Seff-Car-Rental-App",
          },
          timeout: 5000, // Add timeout
        });
        res.json({ 
          connected: true, 
          user: response.data,
          isProduction: process.env.NODE_ENV === 'production'
        });
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || String(error);
        console.error("GitHub Status Error:", errorMessage);
        res.json({ 
          connected: false, 
          error: errorMessage,
          statusCode: error.response?.status,
          isProduction: process.env.NODE_ENV === 'production'
        });
      }
    });

    app.get("/api/user", async (req, res) => {
      const token = process.env.GITHUB_TOKEN?.trim();
      if (!token) {
        return res.json({ user: null });
      }

      try {
        const response = await axios.get(GITHUB_USER_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Agent": "Seff-Car-Rental-App",
          },
          timeout: 5000,
        });
        res.json({ user: response.data });
      } catch (error) {
        console.error("GitHub User Error:", error.response?.data?.message || error.message);
        res.json({ user: null });
      }
    });

    // Detect production environment (Cloud Run always sets K_SERVICE)
    const distPath = path.join(__dirname, "dist");
    const distExists = fs.existsSync(path.join(distPath, "index.html"));
    const isProduction = (process.env.NODE_ENV === "production" || !!process.env.K_SERVICE) && distExists;
    
    console.log(`Is Production Mode: ${isProduction} (dist exists: ${distExists})`);

    if (!isProduction) {
      console.log("Initializing Vite middleware for development...");
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("Vite middleware initialized.");
    } else {
      console.log("Setting up static file serving for production...");
      
      // Serve static files, but NOT index.html automatically
      app.use(express.static(distPath, { index: false }));
      
      // Serve index.html with injected environment variables
      app.get('*all', (req, res) => {
        try {
          let html = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
          const envScript = `<script>
            window.ENV = {
              VITE_EMAILJS_SERVICE_ID: ${JSON.stringify(process.env.VITE_EMAILJS_SERVICE_ID || process.env.EMAILJS_SERVICE_ID || '')},
              VITE_EMAILJS_TEMPLATE_ID: ${JSON.stringify(process.env.VITE_EMAILJS_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID || '')},
              VITE_EMAILJS_RESET_TEMPLATE_ID: ${JSON.stringify(process.env.VITE_EMAILJS_RESET_TEMPLATE_ID || process.env.EMAILJS_RESET_TEMPLATE_ID || '')},
              VITE_EMAILJS_PUBLIC_KEY: ${JSON.stringify(process.env.VITE_EMAILJS_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY || '')},
              VITE_ADMIN_USERNAME: ${JSON.stringify(process.env.VITE_ADMIN_USERNAME || process.env.ADMIN_USERNAME || '')},
              VITE_ADMIN_PASSWORD: ${JSON.stringify(process.env.VITE_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || '')}
            };
          </script>`;
          html = html.replace('</head>', `${envScript}</head>`);
          res.send(html);
        } catch (err) {
          console.error("Error serving index.html:", err);
          res.status(500).send("Server Error");
        }
      });
      console.log(`Serving static files from: ${distPath}`);
    }

    console.log(`Attempting to bind to 0.0.0.0:${PORT}...`);
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`=== SERVER SUCCESSFULLY LISTENING ON PORT ${PORT} ===`);
    });

    server.on('error', (error) => {
      console.error("=== SERVER LISTEN ERROR ===", error);
    });

  } catch (error) {
    console.error("=== FATAL ERROR DURING STARTUP ===", error);
    process.exit(1);
  }
}

startServer();
