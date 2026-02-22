import express from "express";
import passport from "passport";

const router = express.Router();
const API = process.env.FRONTEND;

// Trigger Google Login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${API}/login`,
  }),
  (req, res) => {
    res.redirect(`${API}/dashboard`);
  },
);

// Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("API");
  });
});

// Check Current User Status
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

export default router;
