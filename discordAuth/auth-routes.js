import { Router } from "express";
import passport from "passport";

const router = Router();
const clientURL = process.env.CLIENT_URL || "http://localhost:5173";

// Route to start the Discord OAuth process
router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback',
    passport.authenticate('discord', { failureRedirect: '/' }),
    (req, res) => {
      console.log("Authenticated User:", "\nUsername:", req.user.username, "\nID:", req.user.id); 
      res.redirect(clientURL); 
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
