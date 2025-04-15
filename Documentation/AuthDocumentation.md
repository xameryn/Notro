# Notro Discord Authentication Documentation

## Overview

This document explains how Discord OAuth authentication works in the Notro project, including how user sessions are managed, how guild access is verified, and how authenticated user data is handled across the backend and frontend.

---

## Architecture Summary

- **OAuth Provider**: [Discord](https://discord.com/developers/docs/topics/oauth2)
- **Passport Strategy**: `passport-discord`
- **Session Store**: MongoDB via `connect-mongo`
- **Auth Server**: Runs separately on `http://localhost:4001`
- **Client Redirects**: Handled via the `state` parameter

---

## Authentication Flow

### 1. Frontend Initiation

User clicks a **“Connect using Discord”** button.  
Frontend sends user to:

```
GET /auth/discord?origin=http://localhost:5173
```

---

### 2. Redirect to Discord

The server constructs an OAuth2 URL using:

- `client_id`
- `redirect_uri`
- `scope: identify guilds`
- `response_type: code`
- `state: origin (for redirecting back)`

**Example generated URL:**

```
https://discord.com/api/oauth2/authorize?client_id=...&redirect_uri=...&state=http://localhost:5173
```

---

### 3. Discord → Backend Callback

Discord redirects back to:

```
GET /auth/discord/callback?code=...&state=http://localhost:5173
```

`passport-discord` handles token exchange and user profile fetch.

---

### 4. User Session

On successful login:

- Session is stored in MongoDB in the `sessions` collection
- User is serialized into `req.session.passport.user`

---

### 5. Final Redirect

Server redirects back to the frontend using the original `origin` passed in the `state` parameter.

---

## Passport Setup

```js
passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: `${authServerUrl}/auth/discord/callback`,
  scope: ['identify', 'guilds']
}, async (accessToken, _, profile, done) => {
  const guilds = await fetchUserGuilds(accessToken);
  const user = {
    id: profile.id,
    username: profile.username,
    avatar: profile.avatar,
    discriminator: profile.discriminator,
    guilds
  };
  return done(null, user);
}));
```

---

## Guild Filtering

After fetching `/users/@me/guilds`, the list is filtered against MongoDB:

```js
const filteredGuilds = guilds.filter(g => 
  databaseServers.some(s => s._id === g.id)
);
```

Only guilds already in the database are returned.

---

## Session Storage Schema

Sessions are stored in MongoDB via `connect-mongo`. Example structure:

```json
{
  "_id": "session_id",
  "expires": "2024-05-01T15:00:00Z",
  "session": {
    "cookie": { ... },
    "passport": {
      "user": {
        "id": "123456789",
        "username": "NotroUser",
        "avatar": "a_bunchofletters",
        "discriminator": "1234",
        "guilds": ["server_1", "server_2"]
      }
    }
  }
}
```

---

## Endpoints

| Method | Endpoint                      | Description                              |
|--------|-------------------------------|------------------------------------------|
| GET    | `/auth/discord`               | Start OAuth login                        |
| GET    | `/auth/discord/callback`      | Handle redirect from Discord             |
| GET    | `/auth/me`                    | Get authenticated user info              |
| POST   | `/auth/logout`                | Logs out user and clears session         |
| GET    | `/auth/discord/url`           | Generates login+redirect URL (Not You?)  |

---

## Example: `/auth/me` Response

```json
{
  "id": "1234567890",
  "username": "Notro",
  "avatar": "a_23abc...",
  "discriminator": "0001",
  "guilds": [
    {
      "id": "server_id",
      "name": "Cool Server",
      "icon": "servericonhash"
    }
  ]
}
```

---

## Error Handling

- If not authenticated, `/auth/me` returns:
```json
{ "error": "Not authenticated" }
```

- Rate limits from Discord’s API are detected and retried automatically with a delay.

---

## Environment Variables

```env
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_REDIRECT_URI=http://localhost:4001/auth/discord/callback
AUTH_SERVER_URL=http://localhost:4001
SERVER_URL=http://localhost:4000
SESSION_SECRET=your_session_secret
MONGO_URI=mongodb://localhost:27017/notro_database
```

---
 
## Summary

This authentication system allows users to securely log in with Discord and only see servers they're part of that are also stored in the Notro backend. Sessions are persisted via MongoDB, and all logic is split across a dedicated auth server (`port 4001`) and main app backend (`port 4000`).
  