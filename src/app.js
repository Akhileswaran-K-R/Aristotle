import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import { configurePassport } from "./config/passport.js";

// Import Route Files
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/project.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: `${process.env.FRONTEND}`,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Don't create session until something is stored
    cookie: {
      secure: false, // MUST be false for localhost (HTTP)
      httpOnly: true,
      sameSite: "lax", // Allows cross-site cookies for local testing
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

app.options(/.*/, cors());

// Initialize Passport
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Use Routes
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);

app.get("/", (req, res) => {
  res.send("Aether-OS API is active!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));

export default app;
