import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user.id); 
  done(null, user); 
});

passport.deserializeUser((user, done) => {
  console.log("Deserializing user:", user.id); 
  done(null, user);
});

async function fetchUserGuilds(accessToken) {
    try {
      const response = await fetch("https://discord.com/api/users/@me/guilds", {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      const data = await response.json();
  
      // If rate-limited, wait before retrying
      if (data.message === "You are being rate limited.") {
        const waitTime = data.retry_after * 1000; // Convert seconds to milliseconds
        console.warn(`⏳ Rate limited! Retrying after ${waitTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        return fetchUserGuilds(accessToken); // Retry after waiting
      }
  
      console.log("✅ User Guilds:", data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("❌ Error fetching guilds:", error);
      return [];
    }
  }
  
  passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: process.env.DISCORD_REDIRECT_URI,
        scope: ["identify", "guilds"],
      },
      async (accessToken, refreshToken, profile, done) => {
        const guilds = await fetchUserGuilds(accessToken);
        console.log("✅ User's Server IDs:", guilds.map((g) => g.id));
  
        return done(null, {
          id: profile.id,
          username: profile.username,
          avatar: profile.avatar,
          discriminator: profile.discriminator,
          guilds: guilds.map((g) => g.id),
        });
      }
    )
  );
  
  

export default passport;
