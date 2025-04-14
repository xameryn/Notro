import { Router } from "express";
import passport from "passport";

const router = Router();
const originMap = new Map();

// Step 1: Capture origin + redirect to Discord
router.get("/discord", (req, res, next) => {
  const origin = req.query.origin;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  console.log("🛬 [GET /auth/discord] Received request");
  console.log("🌐 Origin param:", origin);
  console.log("🌍 IP detected:", ip);

  if (origin) {
    originMap.set(ip, origin);
    console.log("🧭 Captured origin for", ip, "->", origin);
  } else {
    console.warn("⚠️ No origin provided");
  }

  next(); // Continue to passport middleware
}, passport.authenticate("discord", {
  prompt: "consent"
}));

// Step 2: Handle callback from Discord
router.get("/discord/callback",
  (req, res, next) => {
    console.log("🛬 [GET /auth/discord/callback] Callback hit");
    console.log("📥 Query params:", req.query);
    next();
  },
  passport.authenticate("discord", {
    failureRedirect: "/",
    session: true
  }),
  (req, res) => {
    const redirectTo = decodeURIComponent(req.query.state || "http://localhost:5173");
    console.log("✅ Authenticated user:", req.user?.username || "[Unknown]");
    console.log("🎯 Redirecting user back to:", redirectTo);
    res.redirect(redirectTo);
  }
);

// Endpoint for fetching current user info
router.get('/me', (req, res) => {
  console.log("👤 [GET /auth/me] Authenticated?", req.isAuthenticated());
  console.log("🔑 Session ID:", req.sessionID);
  if (req.user) console.log("👨‍🚀 User object:", req.user);

  if (req.isAuthenticated()) {
    return res.json(req.user);
  } else {
    return res.status(401).json({ error: 'Not authenticated' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  console.log("👋 [POST /auth/logout] Logging out");
  req.logout(function(err) {
    if (err) {
      console.error("❌ Logout error:", err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

export default router;