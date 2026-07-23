import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import multer from "multer";
import exifr from "exifr";
import sharp from "sharp";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { initialPhotos, initialJournals, initialProjects } from "./src/data";
import { initialPages, initialHeroConfig } from "./src/dataPages";

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const TMP_DIR = path.join(UPLOADS_DIR, "tmp");
const ORIGINALS_DIR = path.join(UPLOADS_DIR, "originals");
const PREVIEWS_DIR = path.join(UPLOADS_DIR, "web");
const THUMBS_DIR = path.join(UPLOADS_DIR, "thumbs");

[UPLOADS_DIR, TMP_DIR, ORIGINALS_DIR, PREVIEWS_DIR, THUMBS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Stream uploaded files directly to temporary disk staging directory without RAM buffering
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TMP_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `upload-${uniqueSuffix}${ext}`);
  }
});

const uploadMiddleware = multer({
  storage: diskStorage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB max per file stream
});

function calculateFileSha256(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });
}

async function extractExifFromFilePath(filePath: string) {
  try {
    const raw = await exifr.parse(filePath, {
      tiff: true,
      exif: true,
      gps: true,
      translateKeys: true,
      translateValues: true,
      reviveValues: true
    });

    if (!raw) return {};

    let camera = "";
    if (raw.Make || raw.Model) {
      const make = (raw.Make || "").trim();
      const model = (raw.Model || "").trim();
      camera = model.toLowerCase().startsWith(make.toLowerCase()) ? model : `${make} ${model}`.trim();
    }

    const lens = raw.LensModel || raw.LensInfo || raw.Lens || "";
    const iso = raw.ISO ? `${raw.ISO}` : "";
    const aperture = raw.FNumber ? `f/${raw.FNumber}` : (raw.ApertureValue ? `f/${raw.ApertureValue}` : "");

    let shutterSpeed = "";
    if (raw.ExposureTime) {
      shutterSpeed = raw.ExposureTime < 1
        ? `1/${Math.round(1 / raw.ExposureTime)}s`
        : `${raw.ExposureTime}s`;
    }

    const focalLength = raw.FocalLength ? `${Math.round(raw.FocalLength)}mm` : "";

    let dateStr = "";
    if (raw.DateTimeOriginal || raw.CreateDate) {
      const d = new Date(raw.DateTimeOriginal || raw.CreateDate);
      if (!isNaN(d.getTime())) {
        dateStr = d.toISOString().split("T")[0];
      }
    }

    let gpsStr = "";
    if (raw.latitude !== undefined && raw.longitude !== undefined) {
      gpsStr = `${raw.latitude.toFixed(6)}, ${raw.longitude.toFixed(6)}`;
    }

    let orientation = "Landscape";
    const width = raw.ExifImageWidth || raw.ImageWidth;
    const height = raw.ExifImageHeight || raw.ImageHeight;
    if (width && height) {
      if (height > width) orientation = "Portrait";
      else if (height === width) orientation = "Square";
    }

    const dimensions = (width && height) ? `${width} x ${height}` : "";

    return {
      camera,
      lens,
      iso,
      aperture,
      shutterSpeed,
      focalLength,
      date: dateStr,
      gps: gpsStr,
      orientation,
      dimensions
    };
  } catch (err) {
    console.warn("Could not extract EXIF data:", err);
    return {};
  }
}

async function processImageDerivatives(sourceFilePath: string, baseFilename: string) {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const webDir = path.join(PREVIEWS_DIR, year, month);
  const thumbDir = path.join(THUMBS_DIR, year, month);

  if (!fs.existsSync(webDir)) fs.mkdirSync(webDir, { recursive: true });
  if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

  const webFilename = `${baseFilename}-web.webp`;
  const thumbFilename = `${baseFilename}-thumb.webp`;

  const webPath = path.resolve(path.join(webDir, webFilename));
  const thumbPath = path.resolve(path.join(thumbDir, thumbFilename));

  console.log(`[Sharp Process] Derivatives generation starting:`);
  console.log(`  Source absolute path: ${path.resolve(sourceFilePath)}`);
  console.log(`  Target Web Preview path: ${webPath}`);
  console.log(`  Target Thumbnail path: ${thumbPath}`);

  let hasWeb = false;
  let hasThumb = false;
  let webSize = 0;
  let thumbSize = 0;
  let dominantHex = "#1e1e1e";
  let blurDataUrl = "";

  // Extract color stats & generate 20px blur placeholder
  try {
    const stats = await sharp(sourceFilePath).stats();
    if (stats && stats.dominant) {
      dominantHex = `#${((1 << 24) + (stats.dominant.r << 16) + (stats.dominant.g << 8) + stats.dominant.b).toString(16).slice(1)}`;
    }
    const blurBuffer = await sharp(sourceFilePath)
      .rotate()
      .resize(20, 20, { fit: "inside" })
      .webp({ quality: 20 })
      .toBuffer();
    blurDataUrl = `data:image/webp;base64,${blurBuffer.toString("base64")}`;
  } catch (statErr) {
    console.warn("Could not extract image stats or blur placeholder:", statErr);
  }

  // High performance WebP Web Preview (max 1920px)
  try {
    await sharp(sourceFilePath)
      .rotate()
      .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(webPath);
    
    hasWeb = fs.existsSync(webPath);
    if (hasWeb) {
      webSize = fs.statSync(webPath).size;
      console.log(`[Sharp Process] Web Preview generated successfully: ${webPath} (${webSize} bytes)`);
    } else {
      console.error(`[Sharp Process] Web Preview output file MISSING on disk after toFile(): ${webPath}`);
    }
  } catch (err: any) {
    console.error(`[Sharp FULL ERROR STACK] Failed to generate web preview for ${sourceFilePath}:`);
    console.error(err.stack || err);
  }

  // Fast WebP Thumbnail (500px cover)
  try {
    await sharp(sourceFilePath)
      .rotate()
      .resize({ width: 500, height: 500, fit: "cover" })
      .webp({ quality: 80 })
      .toFile(thumbPath);

    hasThumb = fs.existsSync(thumbPath);
    if (hasThumb) {
      thumbSize = fs.statSync(thumbPath).size;
      console.log(`[Sharp Process] Thumbnail generated successfully: ${thumbPath} (${thumbSize} bytes)`);
    } else {
      console.error(`[Sharp Process] Thumbnail output file MISSING on disk after toFile(): ${thumbPath}`);
    }
  } catch (err: any) {
    console.error(`[Sharp FULL ERROR STACK] Failed to generate thumbnail for ${sourceFilePath}:`);
    console.error(err.stack || err);
  }

  // Fallback hierarchy: thumbnail -> webPreview -> original
  const webPreviewUrl = hasWeb ? `/uploads/web/${year}/${month}/${webFilename}` : null;
  const thumbnailUrl = hasThumb ? `/uploads/thumbs/${year}/${month}/${thumbFilename}` : webPreviewUrl;

  return {
    webPreviewUrl,
    thumbnailUrl,
    hasWeb,
    hasThumb,
    webPath,
    thumbPath,
    webFilename,
    thumbFilename,
    webSize,
    thumbSize,
    dominantHex,
    blurDataUrl
  };
}

function resolvePhotoUrls(photo: any) {
  if (!photo) return photo;

  const checkFileOnDisk = (urlStr: string | null | undefined): boolean => {
    if (!urlStr) return false;
    if (urlStr.startsWith("http://") || urlStr.startsWith("https://") || urlStr.startsWith("data:")) return true;
    if (!urlStr.startsWith("/uploads/")) return true;

    const relPath = urlStr.replace(/^\/uploads\//, "");
    const absPath = path.join(UPLOADS_DIR, relPath);
    return fs.existsSync(absPath) && fs.statSync(absPath).isFile();
  };

  const origUrl = photo.originalUrl || photo.url;
  const webUrl = photo.webPreviewUrl;
  const thumbUrl = photo.thumbnailUrl;

  const hasOrig = checkFileOnDisk(origUrl);
  const hasWeb = checkFileOnDisk(webUrl);
  const hasThumb = checkFileOnDisk(thumbUrl);

  const finalOrig = hasOrig ? origUrl : photo.url;
  const finalWeb = hasWeb ? webUrl : (hasOrig ? finalOrig : photo.url);
  const finalThumb = hasThumb ? thumbUrl : (hasWeb ? finalWeb : (hasOrig ? finalOrig : photo.url));

  return {
    ...photo,
    originalUrl: finalOrig,
    webPreviewUrl: finalWeb,
    thumbnailUrl: finalThumb,
    url: finalWeb || photo.url
  };
}

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

// Helper to write JSON file atomically with tmp write + rename
function writeDataFile<T>(filePath: string, data: T): void {
  const tmpPath = `${filePath}.tmp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  try {
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tmpPath, filePath);
  } catch (error) {
    if (fs.existsSync(tmpPath)) {
      try { fs.unlinkSync(tmpPath); } catch {}
    }
    console.error(`Error writing atomically to ${filePath}:`, error);
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
  if (!process.env.OFFICINA_PASSCODE || !process.env.OFFICINA_PASSCODE.trim()) {
    console.warn("[byFRNK Security Warning] OFFICINA_PASSCODE environment variable is missing. Defaulting to fallback passcode.");
  }

  const app = express();

  const allowedOrigins = [
    "https://byfrnk.com",
    "https://www.byfrnk.com"
  ];

  app.use(cors({
    origin: (origin, callback) => {
      console.log("========== CORS ==========");
      console.log("Origin:", origin);
      console.log("APP_URL:", process.env.APP_URL);
      console.log("NODE_ENV:", process.env.NODE_ENV);

      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        console.log("✅ CORS ALLOWED");
        callback(null, true);
      } else {
        console.log("❌ CORS BLOCKED:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Duplicate-Action"],
    optionsSuccessStatus: 200
  }));

  // Support JSON and urlencoded with a larger limit for base64 uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Authentication helper for L'Officina internal operations
  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = (authHeader || "").replace(/^Bearer\s+/i, "").trim();
    const effectivePasscode = (process.env.OFFICINA_PASSCODE || "1234").trim();

    if (!process.env.OFFICINA_PASSCODE || token === effectivePasscode) {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized access to L'Officina" });
    }
  };

  // Auth endpoint
  app.post("/api/officina/auth", (req, res) => {
    const rawPasscode = (req.body?.passcode || "").toString().trim();
    const effectivePasscode = (process.env.OFFICINA_PASSCODE || "1234").trim();

    if (!process.env.OFFICINA_PASSCODE || rawPasscode === effectivePasscode) {
      res.json({ success: true, token: effectivePasscode });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
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

// System Health Endpoints for Railway, Vercel & Container Probes
  app.get("/api/health", async (req, res) => {
    const photosCount = readDataFile<any[]>(PHOTOS_PATH, []).length;
    const journalsCount = readDataFile<any[]>(JOURNALS_PATH, []).length;
    const projectsCount = readDataFile<any[]>(PROJECTS_PATH, []).length;
    const pagesCount = readDataFile<any[]>(PAGES_PATH, []).length;

    const mem = process.memoryUsage();
    let sharpAvailable = false;
    try {
      const testBuffer = await sharp({
        create: { width: 1, height: 1, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } }
      }).png().toBuffer();
      sharpAvailable = testBuffer.length > 0;
    } catch {
      sharpAvailable = false;
    }

    res.json({
      status: "ok",
      version: "3.0.0",
      system: "byFRNK L'Officina OS",
      environment: process.env.NODE_ENV || "development",
      commit: process.env.GIT_COMMIT || "phase-1-hardened",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: {
        rssMB: Math.round(mem.rss / 1024 / 1024),
        heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
        heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024)
      },
      counts: {
        photos: photosCount,
        journals: journalsCount,
        projects: projectsCount,
        pages: pagesCount
      },
      storage: {
        dataDir: DATA_DIR,
        dataWritable: fs.existsSync(DATA_DIR),
        uploadsDir: UPLOADS_DIR,
        uploadsWritable: fs.existsSync(UPLOADS_DIR),
        sharpAvailable
      }
    });
  });

  app.get("/api/version", (req, res) => {
    res.json({
      version: "3.0.0",
      name: "byFRNK L'Officina OS",
      environment: process.env.NODE_ENV || "development",
      commit: process.env.GIT_COMMIT || "phase-1-hardened",
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    });
  });

  app.get("/api/ready", (req, res) => {
    try {
      const isDataWritable = fs.existsSync(DATA_DIR);
      const isUploadsWritable = fs.existsSync(UPLOADS_DIR);

      if (isDataWritable && isUploadsWritable) {
        res.status(200).json({ ready: true, status: "Ready for traffic" });
      } else {
        res.status(503).json({ ready: false, error: "Storage unmounted or unwritable" });
      }
    } catch (err: any) {
      res.status(503).json({ ready: false, error: err.message });
    }
  });

  // API Endpoints
  app.get("/api/photos", (req, res) => {
    const photos = readDataFile<any[]>(PHOTOS_PATH, []);
    const resolvedPhotos = photos.map(resolvePhotoUrls);
    res.json(resolvedPhotos);
  });

  app.post("/api/photos", uploadMiddleware.single("file"), requireAuth, async (req, res) => {
    let tempFilePath: string | null = null;
    try {
      if (req.file) {
        tempFilePath = req.file.path;
      } else if (req.body?.imageBase64 && req.body.imageBase64.startsWith("data:")) {
        const matches = req.body.imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, "base64");
          const tempName = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.jpg`;
          tempFilePath = path.join(TMP_DIR, tempName);
          fs.writeFileSync(tempFilePath, buffer);
        }
      }

      if (!tempFilePath && !req.body?.url) {
        res.status(400).json({ error: "Image file or URL is required" });
        return;
      }

      const photos = readDataFile<any[]>(PHOTOS_PATH, []);
      let sha256 = "";
      let exif: any = {};
      let derivResult: any = {};
      let originalUrl = req.body?.url || "";
      let webPreviewUrl = req.body?.url || "";
      let thumbnailUrl = req.body?.url || "";

      if (tempFilePath) {
        // Step A: Stream calculate SHA256 hash without loading into RAM
        sha256 = await calculateFileSha256(tempFilePath);

        // Step B: Fast duplicate check
        const existingIndex = photos.findIndex((p) => p.sha256 === sha256);
        const duplicateAction = (req.headers["x-duplicate-action"] || "check").toString().toLowerCase();

        if (existingIndex !== -1) {
          const existingPhoto = photos[existingIndex];
          if (duplicateAction === "check") {
            if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
            res.status(409).json({
              error: "Duplicate photograph detected",
              duplicate: true,
              existingPhoto: resolvePhotoUrls(existingPhoto)
            });
            return;
          } else if (duplicateAction === "skip") {
            if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
            res.status(200).json({
              message: "Duplicate photograph skipped",
              duplicate: true,
              action: "skipped",
              photo: resolvePhotoUrls(existingPhoto)
            });
            return;
          }
          // If 'replace' or 'keep', continue
        }

        // Step C: Move to partitioned directory structure (/uploads/originals/YYYY/MM/)
        const now = new Date();
        const year = now.getFullYear().toString();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const origDir = path.join(ORIGINALS_DIR, year, month);
        if (!fs.existsSync(origDir)) fs.mkdirSync(origDir, { recursive: true });

        const ext = path.extname(tempFilePath) || ".jpg";
        const baseFilename = `photo-${Date.now()}-${sha256.substring(0, 8)}`;
        const originalFilename = `${baseFilename}${ext}`;
        const finalOriginalPath = path.join(origDir, originalFilename);

        const uploadTempFilePathForLog = tempFilePath;
        // Move temp file to partitioned originals folder
        fs.renameSync(tempFilePath, finalOriginalPath);
        tempFilePath = null; // Cleared

        console.log(`\n--- UPLOAD RENAME VERIFICATION ---`);
        console.log(`tempFilePath: ${uploadTempFilePathForLog}`);
        console.log(`finalOriginalPath: ${finalOriginalPath}`);
        console.log(`fs.existsSync(finalOriginalPath): ${fs.existsSync(finalOriginalPath)}`);
        console.log(`----------------------------------\n`);

        originalUrl = `/uploads/originals/${year}/${month}/${originalFilename}`;

        // Step D: Extract EXIF & Generate WebP derivatives (Web Preview & Thumbnail)
        exif = await extractExifFromFilePath(finalOriginalPath);
        
        derivResult = {};
        try {
          derivResult = await processImageDerivatives(finalOriginalPath, baseFilename);
          webPreviewUrl = derivResult.webPreviewUrl || originalUrl;
          thumbnailUrl = derivResult.thumbnailUrl || webPreviewUrl || originalUrl;
        } catch (derivErr: any) {
          console.error("[Sharp FULL ERROR STACK] Derivative generation failed, falling back to original:");
          console.error(derivErr.stack || derivErr);
          webPreviewUrl = originalUrl;
          thumbnailUrl = originalUrl;
        }

        const origAbsPath = path.resolve(finalOriginalPath);
        const origExists = fs.existsSync(origAbsPath);
        const origSize = origExists ? fs.statSync(origAbsPath).size : 0;

        const webAbsPath = derivResult.webPath || path.resolve(path.join(UPLOADS_DIR, webPreviewUrl.replace(/^\/uploads\//, "")));
        const webExists = fs.existsSync(webAbsPath);
        const webSize = webExists ? fs.statSync(webAbsPath).size : (derivResult.webSize || 0);

        const thumbAbsPath = derivResult.thumbPath || path.resolve(path.join(UPLOADS_DIR, thumbnailUrl.replace(/^\/uploads\//, "")));
        const thumbExists = fs.existsSync(thumbAbsPath);
        const thumbSize = thumbExists ? fs.statSync(thumbAbsPath).size : (derivResult.thumbSize || 0);

        console.log(`\n==================================================`);
        console.log(`[Upload Pipeline Audit] REALTIME RUNTIME LOGS`);
        console.log(`==================================================`);
        console.log(`1. Filenames:`);
        console.log(`   Original uploaded filename: ${req.file?.originalname || "Base64 payload"}`);
        console.log(`   Generated base filename: ${baseFilename}`);
        console.log(`   Generated original filename: ${originalFilename}`);
        console.log(`   Generated web preview filename: ${derivResult.webFilename || baseFilename + "-web.webp"}`);
        console.log(`   Generated thumbnail filename: ${derivResult.thumbFilename || baseFilename + "-thumb.webp"}`);
        console.log(``);
        console.log(`2. Output Paths:`);
        console.log(`   Original output path: ${origAbsPath}`);
        console.log(`   Web preview output path: ${webAbsPath}`);
        console.log(`   Thumbnail output path: ${thumbAbsPath}`);
        console.log(``);
        console.log(`3. Sharp Conversion Status:`);
        console.log(`   Sharp Web Preview success: ${derivResult.hasWeb ? "SUCCESS" : "FALLBACK"}`);
        console.log(`   Sharp Thumbnail success: ${derivResult.hasThumb ? "SUCCESS" : "FALLBACK"}`);
        console.log(``);
        console.log(`4. File Sizes & Existence on Disk:`);
        console.log(`   Original: ${origSize} bytes (${origExists ? "EXISTS" : "MISSING"})`);
        console.log(`   Web Preview: ${webSize} bytes (${webExists ? "EXISTS" : "MISSING"})`);
        console.log(`   Thumbnail: ${thumbSize} bytes (${thumbExists ? "EXISTS" : "MISSING"})`);
        console.log(``);
        console.log(`5. URLs saved into Database:`);
        console.log(`   originalUrl: ${originalUrl}`);
        console.log(`   webPreviewUrl: ${webPreviewUrl}`);
        console.log(`   thumbnailUrl: ${thumbnailUrl}`);
        console.log(`==================================================\n`);

        if (duplicateAction === "replace" && existingIndex !== -1) {
          const existingPhoto = photos[existingIndex];
          const updatedPhoto = resolvePhotoUrls({
            ...existingPhoto,
            ...req.body,
            originalUrl,
            webPreviewUrl,
            thumbnailUrl,
            url: webPreviewUrl,
            sha256,
            camera: req.body?.camera || exif.camera || existingPhoto.camera || "",
            lens: req.body?.lens || exif.lens || existingPhoto.lens || "",
            focalLength: req.body?.focalLength || exif.focalLength || existingPhoto.focalLength || "",
            aperture: req.body?.aperture || exif.aperture || existingPhoto.aperture || "",
            shutterSpeed: req.body?.shutterSpeed || exif.shutterSpeed || existingPhoto.shutterSpeed || "",
            iso: req.body?.iso || exif.iso || existingPhoto.iso || "",
            gps: req.body?.gps || exif.gps || existingPhoto.gps || "",
            orientation: req.body?.orientation || exif.orientation || existingPhoto.orientation || "Landscape",
            dimensions: req.body?.dimensions || exif.dimensions || existingPhoto.dimensions || "",
            updatedAt: new Date().toISOString()
          });

          photos[existingIndex] = updatedPhoto;
          writeDataFile(PHOTOS_PATH, photos);
          res.json(updatedPhoto);
          return;
        }
      }

      const timestamp = Date.now();
      const rawTitle = req.body?.title || "";
      const slugTitle = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

      const newPhoto = resolvePhotoUrls({
        id: `photo-${timestamp}`,
        originalUrl: originalUrl || webPreviewUrl,
        webPreviewUrl: webPreviewUrl || originalUrl,
        thumbnailUrl: thumbnailUrl || webPreviewUrl || originalUrl,
        url: webPreviewUrl || originalUrl, // Gallery defaults to lightweight web preview
        sha256,
        dominantHex: derivResult?.dominantHex || "#1e1e1e",
        blurDataUrl: derivResult?.blurDataUrl || "",
        title: rawTitle,
        caption: req.body?.caption || "",
        story: req.body?.story || "",
        date: req.body?.date || exif.date || new Date().toISOString().split("T")[0],
        time: req.body?.time || "",
        location: req.body?.location || "",
        country: req.body?.country || "",
        camera: req.body?.camera || exif.camera || "",
        lens: req.body?.lens || exif.lens || "",
        focalLength: req.body?.focalLength || exif.focalLength || "",
        aperture: req.body?.aperture || exif.aperture || "",
        shutterSpeed: req.body?.shutterSpeed || exif.shutterSpeed || "",
        iso: req.body?.iso || exif.iso || "",
        gps: req.body?.gps || exif.gps || "",
        orientation: req.body?.orientation || exif.orientation || "Landscape",
        dimensions: req.body?.dimensions || exif.dimensions || "",
        colorProfile: req.body?.colorProfile || "sRGB",
        status: req.body?.status || "draft",
        category: req.body?.category || "",
        collections: Array.isArray(req.body?.collections) ? req.body.collections : [],
        tags: Array.isArray(req.body?.tags) ? req.body.tags : [],
        rating: req.body?.rating !== undefined ? Number(req.body.rating) : 0,
        flag: req.body?.flag || "none",
        favorite: !!req.body?.favorite,
        colorLabel: req.body?.colorLabel || "none",
        slug: slugTitle ? `photo-${slugTitle}` : `photo-${timestamp}`,
        publishedDate: req.body?.status === "published" ? new Date().toISOString() : undefined
      });

      photos.unshift(newPhoto);
      writeDataFile(PHOTOS_PATH, photos);

      res.status(201).json(newPhoto);
    } catch (error) {
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        try { fs.unlinkSync(tempFilePath); } catch {}
      }
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

      photos[index] = resolvePhotoUrls(photos[index]);
      writeDataFile(PHOTOS_PATH, photos);
      res.json(photos[index]);
    } catch (error) {
      console.error("Failed to update photo:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/photos/:id", requireAuth, (req, res) => {
    const { id } = req.params;
    const photos = readDataFile<any[]>(PHOTOS_PATH, []);
    const index = photos.findIndex(p => p.id === id);

    if (index === -1) {
      res.status(404).json({ error: "Photo not found" });
      return;
    }

    photos[index] = resolvePhotoUrls({
      ...photos[index],
      ...req.body,
      id: photos[index].id,
      updatedAt: new Date().toISOString()
    });

    writeDataFile(PHOTOS_PATH, photos);
    res.json(photos[index]);
  });

  app.post("/api/photos/:id/publish", requireAuth, (req, res) => {
    const { id } = req.params;
    const photos = readDataFile<any[]>(PHOTOS_PATH, []);
    const index = photos.findIndex(p => p.id === id);

    if (index === -1) {
      res.status(404).json({ error: "Photo not found" });
      return;
    }

    const currentStatus = photos[index].status || "draft";
    const newStatus = currentStatus === "published" ? "draft" : "published";

    photos[index] = resolvePhotoUrls({
      ...photos[index],
      status: newStatus,
      publishedDate: newStatus === "published" ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString()
    });

    writeDataFile(PHOTOS_PATH, photos);
    res.json(photos[index]);
  });

  app.delete("/api/photos/:id", requireAuth, (req, res) => {
    const { id } = req.params;
    let photos = readDataFile<any[]>(PHOTOS_PATH, []);
    const targetPhoto = photos.find(p => p.id === id);

    if (!targetPhoto) {
      res.status(404).json({ error: "Photo not found" });
      return;
    }

    // Unlink physical files on disk with path traversal guard
    const resolvedUploadsDir = path.resolve(UPLOADS_DIR);
    [targetPhoto.originalUrl, targetPhoto.webPreviewUrl, targetPhoto.thumbnailUrl, targetPhoto.url].forEach(urlStr => {
      if (urlStr && typeof urlStr === "string" && urlStr.startsWith("/uploads/")) {
        const relPath = urlStr.replace(/^\/uploads\//, "");
        const absPath = path.resolve(path.join(UPLOADS_DIR, relPath));
        if (absPath.startsWith(resolvedUploadsDir) && fs.existsSync(absPath)) {
          try { fs.unlinkSync(absPath); } catch {}
        }
      }
    });

    photos = photos.filter(p => p.id !== id);
    writeDataFile(PHOTOS_PATH, photos);
    res.json({ message: "Photo deleted successfully", id });
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

  // Static Upload Request Middleware (Items 6, 7, and 9)
  app.use("/uploads", (req, res, next) => {
    const reqUrl = req.originalUrl;
    const relPath = req.path.replace(/^\//, "");
    const resolvedPath = path.resolve(path.join(UPLOADS_DIR, relPath));
    const exists = fs.existsSync(resolvedPath);

    console.log(`\n[Static Request Audit] Incoming /uploads request:`);
    console.log(`  Requested URL: ${reqUrl}`);
    console.log(`  Resolved filesystem path: ${resolvedPath}`);
    console.log(`  Exists: ${exists}`);

    if (exists) {
      try {
        const stats = fs.statSync(resolvedPath);
        console.log(`  File size: ${stats.size} bytes`);
      } catch (err) {
        console.error(`  Error checking file stats for ${resolvedPath}:`, err);
      }
    } else {
      console.warn(`  404 MISSING`);
      console.warn(`  Resolved path: ${resolvedPath}`);
      console.warn(`  Reason: File does not exist on disk at ${resolvedPath}. Express static will return 404.`);
    }

    next();
  });

  app.use("/uploads", (req, res, next) => {
    console.log("========== IMAGE REQUEST ==========");
    console.log("URL:", req.originalUrl);
    next();
  });

  // Serve static uploads
  app.use(
    "/uploads",
    express.static(UPLOADS_DIR, {
      etag: true,
      immutable: true,
      maxAge: "365d"
    })
  );

  // Catch unmatched /uploads requests so they never fall through to SPA fallback or Vite
  app.use("/uploads", (req, res) => {
    res.status(404).send("File not found");
  });

  // Catch unmatched /api requests so they return JSON 404 instead of HTML
  app.use("/api", (req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });

  // Serve Vite or static build with explicit SPA fallback
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Fallback for HTML navigation requests (e.g. /officina or deep links in Safari)
    app.use("*", async (req, res, next) => {
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
    console.log(`\n--- SERVER STARTUP DIRECTORY VERIFICATION ---`);
    console.log(`process.cwd(): ${process.cwd()}`);
    console.log(`UPLOADS_DIR: ${UPLOADS_DIR}`);
    console.log(`TMP_DIR: ${TMP_DIR}`);
    console.log(`ORIGINALS_DIR: ${ORIGINALS_DIR}`);
    console.log(`PREVIEWS_DIR: ${PREVIEWS_DIR}`);
    console.log(`THUMBS_DIR: ${THUMBS_DIR}`);
    console.log(`fs.existsSync(UPLOADS_DIR): ${fs.existsSync(UPLOADS_DIR)}`);
    console.log(`fs.existsSync(ORIGINALS_DIR): ${fs.existsSync(ORIGINALS_DIR)}`);
    console.log(`---------------------------------------------\n`);
  });
}

startServer();
