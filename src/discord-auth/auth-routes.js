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
  

export default router;
