# Notro
No Nitro? No Problem.

## Description
Notro offers a self-hosted solution to Discord's file upload size limitations. It is a configurable file-sharing server designed for seamless integration with Discord, enabling native embedding of large files and videos. Ideal for small groups, Notro allows friends to host and share content effortlessly within their friend groups.

## Features
- Local file saving
- Configurable upload limits
- Discord embed support
- Video streaming for large files
- User-friendly web portal for media upload/managment
- Discord bot for posting / uploading via command

## Group Members
- [artemgood477](https://github.com/artemgood477)
- [benjaminjamesweb](https://github.com/benjaminjamesweb)
- [ThatBox1](https://github.com/ThatBox1)
- [Travis975](https://github.com/Travis975)
- [xameryn](https://github.com/xameryn)

## User Guide

### 1. Setup

- Clone the repository from GitHub using HTTPS:

```sh
git clone https://github.com/xameryn/Notro.git
cd notro
```

### Install dependencies:

- run `bun i`

### Run:

- Start the development server:

  `run_client.bat` and `run_server.bat`

<br>

### 2. Accessing Notro

1. Open a browser and navigate to http://localhost:3000.

2. Sign in using your Discord account.

3. Start uploading and sharing files with your whitelisted friends.

4. Fetching Files via Discord Bot

5. Ensure the Notro bot is added to your Discord server.

6. Use the command /fetch filename to retrieve a file.

7. The bot will provide a link to the requested file for download or preview.

<br>

### 3. Troubleshooting

- Issue: Server does not start.

    - Solution: Ensure Bun and MongoDB are installed and running.

- Issue: Discord OAuth is not working.

    - Solution: Check Discord developer settings and make sure the redirect URI matches your local setup.

- Issue: Files are not accessible.

    - Solution: Verify that MongoDB is running and the correct permissions are set.
