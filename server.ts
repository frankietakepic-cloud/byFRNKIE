import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { initialPhotos, initialJournals, initialProjects } from "./src/data";
import { initialPages, initialHeroConfig } from "./src/dataPages";

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Lazy Gemini AI initialization
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Ensure local directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const PHOTOS_PATH = path.join(DATA_DIR, "photos.json");
const JOURNALS_PATH = path.join(DATA_DIR, "journals.json");
const PROJECTS_PATH = path.join(DATA_DIR, "projects.json");
const PAGES_PATH = path.join(DATA_DIR, "pages.json");
const HERO_CONFIG_PATH = path.join(DATA_DIR, "hero_config.json");

// Helper to read JSON file or return default
function readDataFile<T>(filePath: string, defaultData: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content) as T;
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return defaultData;
}

// Helper to write JSON file
function writeDataFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
  }
}

// Seed initial files if they do not exist
if (!fs.existsSync(PHOTOS_PATH)) {
  writeDataFile(PHOTOS_PATH, initialPhotos);
}
if (!fs.existsSync(JOURNALS_PATH)) {
  writeDataFile(JOURNALS_PATH, initialJournals);
}
if (!fs.existsSync(PROJECTS_PATH)) {
  writeDataFile(PROJECTS_PATH, initialProjects);
}
if (!fs.existsSync(PAGES_PATH)) {
  writeDataFile(PAGES_PATH, initialPages);
}
if (!fs.existsSync(HERO_CONFIG_PATH)) {
  writeDataFile(HERO_CONFIG_PATH, initialHeroConfig);
}

async function startServer() {
  const app = express();

  // Support JSON and urlencoded with a larger limit for base64 uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Authentication helper for L'Officina internal operations
  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    const passcode = process.env.OFFICINA_PASSCODE || "takecareofthework";
    if (authHeader === `Bearer ${passcode}`) {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized access to L'Officina" });
    }
  };

  // Auth endpoint
  app.post("/api/officina/auth", (req, res) => {
    const { passcode } = req.body;
    const correctPasscode = process.env.OFFICINA_PASSCODE || "takecareofthework";
    if (passcode === correctPasscode) {
      res.json({ success: true, token: correctPasscode });
    } else {
      res.status(401).json({ error: "Invalid passcode" });
    }
  });

  // AI Editorial Assistant Endpoint
  app.post("/api/officina/ai-suggest", requireAuth, async (req, res) => {
    const { action, photo, journal, prompt } = req.body;
    try {
      const ai = getGenAI();
      if (!ai) {
        // Fallback intelligent response if no GEMINI_API_KEY set
        if (action === "suggest_metadata") {
          return res.json({
            title: photo?.title || "Untitled Observation",
            story: "A moment captured in quiet light. Reflecting the calm textures of daily life.",
            tags: ["#Observation", "#Minimalism", "#QuietLight"],
            collections: ["Street", "Minimalism"],
            colorPalette: ["#121212", "#404040", "#A3A3A3", "#E5E5E5"]
          });
        }
        return res.json({ suggestion: "AI Assistant ready. Add GEMINI_API_KEY in Secrets for live inference." });
      }

      let systemInstruction = "You are L'Officina's editorial AI assistant for byFRNK. You assist Frankie with photo curation, metadata extraction suggestions, tags, collections, and writing refinements. Never auto-publish. Speak quietly, precisely, and respectfully.";
      
      let aiPrompt = prompt || "Provide suggestions for this archive entry.";
      if (action === "suggest_metadata" && photo) {
        aiPrompt = `Examine this photo object: Title: "${photo.title}", Caption: "${photo.caption}", Location: "${photo.location}", Camera: "${photo.camera}". Suggest a short evocative title, 3-5 editorial tags starting with #, 2 relevant collections (e.g., Street, Architecture, Travel, Morning, Film, Workshop, Minimalism, Favorites, Portfolio, Book), and 4 hex color codes for the dominant color palette. Return JSON.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: aiPrompt,
        config: {
          systemInstruction,
        }
      });

      res.json({ result: response.text });
    } catch (error) {
      console.error("AI Editorial Assistant error:", error);
      res.status(500).json({ error: "Failed to generate AI suggestion." });
    }
  });

  // API Endpoints
  app.get("/api/photos", (req, res) => {
    const photos = readDataFile(PHOTOS_PATH, []);
    res.json(photos);
  });

  app.post("/api/photos", requireAuth, (req, res) => {
    const { 
      title, caption, story, location, country, date, time, camera, lens, 
      focalLength, aperture, shutterSpeed, iso, gps, orientation, dimensions, 
      colorProfile, status, category, collections, tags, rating, flag, favorite, colorLabel, imageBase64 
    } = req.body;
    
    if (!imageBase64 && !req.body.url) {
      res.status(400).json({ error: "Image is required" });
      return;
    }

    try {
      let url = req.body.url || "";
      if (imageBase64 && imageBase64.startsWith("data:")) {
        const matches = imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, "base64");

          let extension = "jpg";
          if (mimeType.includes("png")) extension = "png";
          else if (mimeType.includes("webp")) extension = "webp";

          const filename = `photo-${Date.now()}.${extension}`;
          const filePath = path.join(UPLOADS_DIR, filename);
          fs.writeFileSync(filePath, buffer);
          url = `/uploads/${filename}`;
        }
      }

      const photos = readDataFile<any[]>(PHOTOS_PATH, []);
      const timestamp = Date.now();
      const slugTitle = (title || "untitled").toLowerCase().replace(/[^a-z0-0]+/g, "-").replace(/^-|-$/g, "");

      const newPhoto = {
        id: `photo-${timestamp}`,
        url,
        title: title || "",
        caption: caption || "",
        story: story || "",
        date: date || new Date().toISOString().split("T")[0],
        time: time || "",
        location: location || "",
        country: country || "",
        camera: camera || "",
        lens: lens || "",
        focalLength: focalLength || "",
        aperture: aperture || "",
        shutterSpeed: shutterSpeed || "",
        iso: iso || "",
        gps: gps || "",
        orientation: orientation || "Landscape",
        dimensions: dimensions || "",
        colorProfile: colorProfile || "sRGB",
        status: status || "draft",
        category: category || "",
        collections: Array.isArray(collections) ? collections : [],
        tags: Array.isArray(tags) ? tags : [],
        rating: rating !== undefined ? rating : 0,
        flag: flag || "none",
        favorite: !!favorite,
        colorLabel: colorLabel || "none",
        slug: slugTitle ? `photo-${slugTitle}` : `photo-${timestamp}`,
        publishedDate: status === "published" ? new Date().toISOString() : undefined
      };

      photos.unshift(newPhoto);
      writeDataFile(PHOTOS_PATH, photos);

      res.status(201).json(newPhoto);
    } catch (error) {
      console.error("Failed to save photo:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/photos", requireAuth, (req, res) => {
    const { photos } = req.body;
    if (!Array.isArray(photos)) {
      res.status(400).json({ error: "Invalid photos array" });
      return;
    }
    writeDataFile(PHOTOS_PATH, photos);
    res.json({ message: "Photos updated successfully", photos });
  });

  app.put("/api/photos/:id", requireAuth, (req, res) => {
    const { id } = req.params;
    const photos = readDataFile<any[]>(PHOTOS_PATH, []);
    const index = photos.findIndex(p => p.id === id);

    if (index === -1) {
      res.status(404).json({ error: "Photo not found" });
      return;
    }

    try {
      let url = photos[index].url;
      if (req.body.imageBase64 && req.body.imageBase64.startsWith("data:")) {
        const matches = req.body.imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, "base64");

          let extension = "jpg";
          if (mimeType.includes("png")) extension = "png";
          else if (mimeType.includes("webp")) extension = "webp";

          const filename = `photo-edit-${Date.now()}.${extension}`;
          fs.writeFileSync(path.join(UPLOADS_DIR, filename), buffer);
          url = `/uploads/${filename}`;
        }
      }

      photos[index] = {
        ...photos[index],
        ...req.body,
        url,
        // Preserve ID
        id: photos[index].id
      };

      delete photos[index].imageBase64;

      writeDataFile(PHOTOS_PATH, photos);
      res.json(photos[index]);
    } catch (error) {
      console.error("Failed to update photo:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/photos/:id", requireAuth, (req, res) => {
    const { id } = req.params;
    let photos = readDataFile<any[]>(PHOTOS_PATH, []);
    const photoExists = photos.some(p => p.id === id);

    if (!photoExists) {
      res.status(404).json({ error: "Photo not found" });
      return;
    }

    photos = photos.filter(p => p.id !== id);
    writeDataFile(PHOTOS_PATH, photos);
    res.json({ message: "Photo deleted successfully" });
  });

  app.get("/api/journals", (req, res) => {
    const journals = readDataFile(JOURNALS_PATH, []);
    res.json(journals);
  });

  app.post("/api/journals", requireAuth, (req, res) => {
    const { title, category, content, date } = req.body;

    if (!title || !content) {
      res.status(400).json({ error: "Title and Content are required" });
      return;
    }

    const journals = readDataFile<any[]>(JOURNALS_PATH, []);
    const newJournal = {
      id: `journal-${Date.now()}`,
      title,
      category: category || "Philosophy",
      date: date || new Date().toISOString().split("T")[0],
      content
    };

    journals.unshift(newJournal);
    writeDataFile(JOURNALS_PATH, journals);

    res.status(201).json(newJournal);
  });

  app.put("/api/journals/:id", requireAuth, (req, res) => {
    const { id } = req.params;
    const { title, category, content, date } = req.body;

    const journals = readDataFile<any[]>(JOURNALS_PATH, []);
    const index = journals.findIndex(j => j.id === id);

    if (index === -1) {
      res.status(404).json({ error: "Journal entry not found" });
      return;
    }

    journals[index] = {
      ...journals[index],
      title: title || journals[index].title,
      category: category || journals[index].category,
      content: content || journals[index].content,
      date: date || journals[index].date
    };

    writeDataFile(JOURNALS_PATH, journals);
    res.json(journals[index]);
  });

  app.delete("/api/journals/:id", requireAuth, (req, res) => {
    const { id } = req.params;
    let journals = readDataFile<any[]>(JOURNALS_PATH, []);
    const journalExists = journals.some(j => j.id === id);

    if (!journalExists) {
      res.status(404).json({ error: "Journal entry not found" });
      return;
    }

    journals = journals.filter(j => j.id !== id);
    writeDataFile(JOURNALS_PATH, journals);
    res.json({ message: "Journal entry deleted successfully" });
  });

  app.get("/api/projects", (req, res) => {
    const projects = readDataFile(PROJECTS_PATH, []);
    res.json(projects);
  });

  app.post("/api/projects", requireAuth, (req, res) => {
    const { title, category, description, process, outcome, imageBase64 } = req.body;

    if (!title || !description || !process || !outcome) {
      res.status(400).json({ error: "All project fields are required" });
      return;
    }

    let imageUrl = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop";

    try {
      if (imageBase64) {
        const matches = imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, "base64");
          let extension = "jpg";
          if (mimeType.includes("png")) extension = "png";
          const filename = `project-${Date.now()}.${extension}`;
          fs.writeFileSync(path.join(UPLOADS_DIR, filename), buffer);
          imageUrl = `/uploads/${filename}`;
        }
      }

      const projects = readDataFile<any[]>(PROJECTS_PATH, []);
      const newProject = {
        id: `project-${Date.now()}`,
        title,
        category: category || "Workshop",
        description,
        process,
        outcome,
        imageUrl
      };

      projects.unshift(newProject);
      writeDataFile(PROJECTS_PATH, projects);

      res.status(201).json(newProject);
    } catch (error) {
      console.error("Failed to save project:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/projects/:id", requireAuth, (req, res) => {
    const { id } = req.params;
    const { title, category, description, process, outcome, imageBase64 } = req.body;

    const projects = readDataFile<any[]>(PROJECTS_PATH, []);
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    try {
      let imageUrl = projects[index].imageUrl;
      if (imageBase64 && imageBase64.startsWith("data:")) {
        const matches = imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, "base64");
          let extension = "jpg";
          if (mimeType.includes("png")) extension = "png";
          const filename = `project-edit-${Date.now()}.${extension}`;
          fs.writeFileSync(path.join(UPLOADS_DIR, filename), buffer);
          imageUrl = `/uploads/${filename}`;
        }
      }

      projects[index] = {
        ...projects[index],
        title: title || projects[index].title,
        category: category || projects[index].category,
        description: description || projects[index].description,
        process: process || projects[index].process,
        outcome: outcome || projects[index].outcome,
        imageUrl
      };

      writeDataFile(PROJECTS_PATH, projects);
      res.json(projects[index]);
    } catch (error) {
      console.error("Failed to update project:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/projects/:id", requireAuth, (req, res) => {
    const { id } = req.params;
    let projects = readDataFile<any[]>(PROJECTS_PATH, []);
    const projectExists = projects.some(p => p.id === id);

    if (!projectExists) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    projects = projects.filter(p => p.id !== id);
    writeDataFile(PROJECTS_PATH, projects);
    res.json({ message: "Project deleted successfully" });
  });

  // Pages (Site Builder) API Endpoints
  app.get("/api/pages", (req, res) => {
    const pages = readDataFile(PAGES_PATH, initialPages);
    res.json(pages);
  });

  app.get("/api/pages/:id", (req, res) => {
    const { id } = req.params;
    const pages = readDataFile<any[]>(PAGES_PATH, initialPages);
    const page = pages.find(p => p.id === id || p.slug === id);
    if (!page) {
      res.status(404).json({ error: "Page not found" });
      return;
    }
    res.json(page);
  });

  app.put("/api/pages/:id", requireAuth, (req, res) => {
    const { id } = req.params;
    const pages = readDataFile<any[]>(PAGES_PATH, initialPages);
    const index = pages.findIndex(p => p.id === id || p.slug === id);

    if (index === -1) {
      res.status(404).json({ error: "Page layout not found" });
      return;
    }

    const existingPage = pages[index];
    const updatedPage = {
      ...existingPage,
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    pages[index] = updatedPage;
    writeDataFile(PAGES_PATH, pages);
    res.json(updatedPage);
  });

  app.post("/api/pages", requireAuth, (req, res) => {
    const { title, slug, components, description } = req.body;
    if (!title) {
      res.status(400).json({ error: "Page title is required" });
      return;
    }

    const pages = readDataFile<any[]>(PAGES_PATH, initialPages);
    const timestamp = Date.now();
    const formattedSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const newPage = {
      id: `page-${timestamp}`,
      slug: formattedSlug || `page-${timestamp}`,
      title,
      description: description || "",
      status: req.body.status || "draft",
      updatedAt: new Date().toISOString(),
      components: Array.isArray(components) ? components : [],
      versions: [
        {
          id: `v-${timestamp}`,
          timestamp: new Date().toISOString(),
          label: "Created page",
          components: Array.isArray(components) ? components : []
        }
      ]
    };

    pages.push(newPage);
    writeDataFile(PAGES_PATH, pages);
    res.status(201).json(newPage);
  });

  app.delete("/api/pages/:id", requireAuth, (req, res) => {
    const { id } = req.params;
    let pages = readDataFile<any[]>(PAGES_PATH, initialPages);
    const pageExists = pages.some(p => p.id === id);

    if (!pageExists) {
      res.status(404).json({ error: "Page not found" });
      return;
    }

    pages = pages.filter(p => p.id !== id);
    writeDataFile(PAGES_PATH, pages);
    res.json({ message: "Page deleted successfully" });
  });

  // Hero Manager API Endpoints
  app.get("/api/hero-config", (req, res) => {
    const heroConfig = readDataFile(HERO_CONFIG_PATH, initialHeroConfig);
    res.json(heroConfig);
  });

  app.put("/api/hero-config", requireAuth, (req, res) => {
    const heroConfig = readDataFile(HERO_CONFIG_PATH, initialHeroConfig);
    const updatedConfig = {
      ...heroConfig,
      ...req.body
    };

    writeDataFile(HERO_CONFIG_PATH, updatedConfig);
    res.json(updatedConfig);
  });

  // Serve static uploads
  app.use("/uploads", express.static(UPLOADS_DIR));

  // Serve Vite or static build with explicit SPA fallback
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Fallback for HTML navigation requests (e.g. /officina or deep links in Safari)
    app.use("*", async (req, res, next) => {
      if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/uploads")) {
        return next();
      }
      try {
        const indexPath = path.join(process.cwd(), "index.html");
        let template = fs.readFileSync(indexPath, "utf-8");
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[byFRNK Server] Running on http://0.0.0.0:${PORT} [ENV: ${process.env.NODE_ENV || "development"}]`);
  });
}

startServer();
