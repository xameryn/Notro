const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route to start the Discord OAuth process
router.get('/discord', passport.authenticate('discord'));

// Callback route for Discord to redirect to after successful login
router.get('/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/' }),
  (req, res) => {
    // Successful login: redirect to home page
    res.redirect('/'); // Or redirect to your desired page (like dashboard)
  }
);

module.exports = router;
