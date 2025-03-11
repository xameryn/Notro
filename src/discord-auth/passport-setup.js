const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI } = process.env;

// Setup Passport session (store only basic metadata)
passport.serializeUser((user, done) => {
  done(null, user.id); // Store only user ID for session
});

passport.deserializeUser((id, done) => {
  done(null, { id }); // Store only user ID in session
});

// Discord OAuth Strategy
passport.use(new DiscordStrategy({
    clientID: DISCORD_CLIENT_ID,
    clientSecret: DISCORD_CLIENT_SECRET,
    callbackURL: DISCORD_REDIRECT_URI,
    scope: ['identify'], // Only requesting basic Discord identity info
  },
  (accessToken, refreshToken, profile, done) => {
    // Send basic user profile info (user ID) to session
    return done(null, { id: profile.id, username: profile.username });
  }
));
