import { Router } from "express";
import passport from "passport";

const router = Router();

// Route to start the Discord OAuth process
router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback',
    passport.authenticate('discord', { failureRedirect: '/' }),
    (req, res) => {
      console.log("Authenticated User:", req.user); 
      res.redirect('http://localhost:5173'); 
    }
  );

  // new endpoint added 04/05 by Ben for fetching info for current user
  router.get('/me', (req, res) => {
    console.log('Is Authenticated?', req.isAuthenticated());
    console.log('Session ID:', req.sessionID);
    console.log('User object:', req.user);
  
    if (req.isAuthenticated()) {
      return res.json(req.user);
    } else {
      return res.status(401).json({ error: 'Not authenticated' });
    }
  });

export default router;
