import { Router } from "express";
import passport from "passport";

const router = Router();
const originMap = new Map();

// Step 1: Capture origin + redirect to Discord
router.get("/discord", (req, res) => {
  const origin = req.query.origin || "http://localhost:5173";
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI);
  const scope = encodeURIComponent("identify guilds");
  const responseType = "code";
  const prompt = "consent";
  const state = encodeURIComponent(origin);

  const discordURL = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&prompt=${prompt}&state=${state}`;
  console.log("➡️ Redirecting user to Discord OAuth:", discordURL);
  res.redirect(discordURL);
});


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

router.get('/discord/url', (req, res) => {
  const origin = req.query.origin || process.env.CLIENT_URL;
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;
  const scope = "identify guilds";
  const prompt = "consent";
  const responseType = "code";

  const relativeOauthPath = `/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&prompt=${prompt}&state=${encodeURIComponent(origin)}`;
  const loginWrapper = `https://discord.com/login?redirect_to=${encodeURIComponent(relativeOauthPath)}`;

  res.json({ url: loginWrapper });
});

export default router;