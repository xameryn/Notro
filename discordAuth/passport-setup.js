import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI } = process.env;

passport.serializeUser((user, done) => {
    console.log("Serializing user:", user); 
    done(null, user); 
  });
  
  passport.deserializeUser((user, done) => {
    console.log("Deserializing user:", user); 
    done(null, user);
  });
  
  

// Discord OAuth Strategy
passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: process.env.DISCORD_REDIRECT_URI,
        scope: ["identify", "email"],
      },
      (accessToken, refreshToken, profile, done) => {
        const user = {
          id: profile.id,
          username: profile.username,
          avatar: profile.avatar,
          discriminator: profile.discriminator,
        };
  
        console.log("User object to store:", user); 
        return done(null, user); // Only store essential user fields
      }
    )
  );
  
export default passport;
