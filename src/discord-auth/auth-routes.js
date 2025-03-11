import { Router } from "express";
import passport from "passport";

const router = Router();

// Route to start the Discord OAuth process
router.get('/discord', passport.authenticate('discord'));

// Callback route for Discord to redirect to after successful login
router.get('/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/'); // Or redirect to your desired page (like dashboard)
  }
);

export default router;
