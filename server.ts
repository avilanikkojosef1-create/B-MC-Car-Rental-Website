import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

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
    } catch (error: any) {
      res.json({ connected: false, error: error.message });
    }
  });

  app.get("/api/user", async (req, res) => {
    // Keep this for potential future user auth, but for now it just checks the app token
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
