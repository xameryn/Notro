import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";

const serverUrl = import.meta.env.SERVER_URL || "http://localhost:4000";
const authServerUrl = import.meta.env.AUTH_SERVER_URL || 'http://localhost:4001';

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

    return await getServersInDatabase(data);

  } catch (error) {
    console.error("❌ Error fetching guilds:", error);
    return [];
  }
}

async function getServersInDatabase(guilds) {
  try {
    const response = await fetch(`${serverUrl}/api/servers`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("Error fetching servers from database:", response.statusText);
      return guilds;
    }

    const databaseServers = await response.json();
    
    // Filter guilds to only include those in the database by matching IDs
    const filteredGuilds = guilds.filter((guild) =>
      databaseServers.some((server) => server._id === guild.id)
    );
    
    return filteredGuilds.map(guild => {
      const dbServer = databaseServers.find(server => server._id === guild.id);
      if (dbServer) {
        return {
          ...guild,
          name: dbServer.name || guild.name,
          icon: dbServer.icon || guild.icon
        };
      }
      return guild;
    });
  } catch (error) {
    console.error("❌ Error fetching servers from database:", error);
    return guilds;
  }
}

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: `${authServerUrl}/auth/discord/callback`,
      scope: ["identify", "guilds"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const guilds = await fetchUserGuilds(accessToken);
        
        const user = {
          id: profile.id,
          username: profile.username,
          avatar: profile.avatar,
          discriminator: profile.discriminator,
          guilds: guilds // no longer mapping IDs, might change if db can be updated from here in the future
        };
        
        console.log("✅ Authenticated user:", user.username);
        console.log("✅ User has access to", guilds.length, "servers");
        
        return done(null, user);
      } catch (error) {
        console.error("❌ Error in authentication:", error);
        return done(error, null);
      }
    }
  )
);

export default passport;