import { Router } from "express";
import passport from "passport";

const router = Router();
const originMap = new Map(); // In-memory map of IP -> origin

// Step 1: Capture origin before OAuth
router.get("/discord", (req, res, next) => {
  const origin = req.query.origin;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (origin) {
    originMap.set(ip, origin);
    console.log("🧭 Captured origin for", ip, "->", origin);
  }

  next(); // continue to passport flow
}, passport.authenticate("discord"));

// Step 2: Handle callback + redirect dynamically
router.get("/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const redirectTo = originMap.get(ip) || "http://localhost:5173";
    originMap.delete(ip); // cleanup

    console.log("✅ Authenticated User:", req.user.username, "| IP:", ip);
    res.redirect(redirectTo); // go back to where they came from
  }
);

// Endpoint for fetching current user info
router.get('/me', (req, res) => {
  console.log('Is Authenticated?', req.isAuthenticated());
  console.log('Session ID:', req.sessionID);
  // console.log('User object:', req.user); // Very long log

  if (req.isAuthenticated()) {
    return res.json(req.user);
  } else {
    return res.status(401).json({ error: 'Not authenticated' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { 
      console.error("Logout error:", err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

export default router;
