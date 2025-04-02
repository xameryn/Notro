# Project Report

## Notro
No Nitro? No Problem.

Notro – A self-hostable and deployable cloud storage service for personal and friend-based file sharing.

<br>

## 1. Motivation of the Project

The motivation behind Notro is to provide users with a personal cloud storage solution that does not rely on third-party cloud providers. Many existing cloud services are either expensive, have storage limits, or impose privacy concerns. With Notro, users can host their own cloud storage on their local machines, ensuring complete control over their data while enabling seamless file sharing with friends via Discord integration.

### Key motivations:

- Privacy and Control: Users maintain full control over their files without third-party involvement.

- Self-Hosting: Avoid reliance on external cloud providers.

- Fast and Efficient: The system is hardware-dependent, allowing optimal performance on high-end setups.

- Seamless Sharing: Integration with Discord for easy file access and sharing.

- Lightweight Deployment: Designed to run on minimal resources using Bun for backend efficiency.

<br>

## 2. Features and Specifications

### Features:

- Self-Hosting: Runs locally on a user’s machine.

- Fast Performance: Optimized backend using Bun for speed and efficiency.

- File Storage & Management: Users can upload, update, retrieve, and delete files (CRUD operations).

- ### Discord Integration:

    - OAuth sign-in with Discord.

    - A Discord bot that allows file retrieval via commands.

    - Embedded video playback when sharing video links in Discord (similar to YouTube preview functionality).

    - Authentication & Whitelisting: Only authorized friends can access and upload files.

    - React-Based GUI: A modern, user-friendly interface accessible via the browser.

    - MongoDB Storage: Stores file metadata (not the files themselves) to manage access and retrieval.

    - Docker Support: Optional containerization for easy deployment and management.


### Technical Specifications:

- Frontend: React + JavaScript (runs in the browser).

- Backend: Bun (for a lightweight and high-performance server).

- Database: MongoDB (stores metadata and access permissions).

- Authentication: Discord OAuth for secure user authentication.

- Hosting: Localhost (self-hosted by the user, with optional network access for friends).

<br>

## 3. Project Design

### Architecture:

#### The project follows a client-server architecture:

- Frontend: React-based UI for file management and authentication.

- Backend: Bun-powered API handling file metadata, user authentication, and Discord bot interactions.

- Database: MongoDB stores metadata (file paths, user permissions, etc.).

- Discord Bot: Fetches file links based on commands and enforces access controls.

### System Flow:

- User Authentication: Logs in via Discord OAuth.

- File Upload/Management: Users upload files via the React UI.

- Metadata Storage: MongoDB stores file paths and permissions.

- File Sharing: Users can share files via generated links or Discord bot commands.

- Embedded Playback: Video files shared in Discord are previewed like YouTube embeds.

- Security Considerations:

- OAuth for authentication: Ensures only authorized users access the system.

- Whitelist system: Restricts access to specified friends.

- Local hosting: Files remain on the user’s machine, reducing external risks.

<br>

## 4. Insights from the Project

### Developing Notro offers insights into:

- The Challenges of Self-Hosting: Handling local file serving efficiently while maintaining security.

- Performance Optimization: Using Bun for backend speed and MongoDB for lightweight data management.

- Discord API Integration: Leveraging OAuth and bot interactions to enhance the user experience.

- Balancing Privacy and Accessibility: Ensuring easy sharing while maintaining access controls.

By addressing these challenges, Notro aims to be a fast, lightweight, and secure cloud storage solution that empowers users with full control over their data while maintaining seamless connectivity with friends.