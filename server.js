import express from "express";
import axios from "axios";
import cookieParser from "cookie-parser";
import path from "path";
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
      const token = process.env.GITHUB_TOKEN;
      if (!token) {
        return res.json({ connected: false, error: "GITHUB_TOKEN not configured" });
      }

      try {
        const response = await axios.get(GITHUB_USER_URL, {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        res.json({ connected: true, user: response.data });
      } catch (error) {
        res.json({ connected: false, error: error instanceof Error ? error.message : String(error) });
      }
    });

    app.get("/api/user", async (req, res) => {
      const token = process.env.GITHUB_TOKEN;
      if (!token) {
        return res.json({ user: null });
      }

      try {
        const response = await axios.get(GITHUB_USER_URL, {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        res.json({ user: response.data });
      } catch (error) {
        res.json({ user: null });
      }
    });

    // Detect production environment (Cloud Run always sets K_SERVICE)
    const isProduction = process.env.NODE_ENV === "production" || !!process.env.K_SERVICE;
    console.log(`Is Production Mode: ${isProduction}`);

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
      const distPath = path.join(__dirname, "dist");
      app.use(express.static(distPath));
      app.use((req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
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
