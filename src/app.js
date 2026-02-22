import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import { configurePassport } from "./config/passport.js";

// Import Route Files
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/project.js";
import githubRoutes from "./routes/github.js";

const app = express();

// 1. TRUST PROXY: Critical for Render/Vercel to handle secure cookies correctly
app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.FRONTEND, // Ensure no trailing slash in .env
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// 2. DYNAMIC SESSION CONFIG
const isProduction = process.env.NODE_ENV === "production";

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true, // Tells session to trust the reverse proxy (Render)
    cookie: {
      secure: isProduction, // true on Render (HTTPS), false on localhost
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax", // 'none' required for cross-domain cookies on HTTPS
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// Pre-flight requests
app.options(/.*/, cors());

// Initialize Passport
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Use Routes
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/github", githubRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Aether-OS API is active!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
