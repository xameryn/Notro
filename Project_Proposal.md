# CSTP 2204 IT Project

### Description
This is our project proposal document where we will layout two possible ideas to explore. 

## Contributors
- Arlexan [@Thatbox1](https://github.com/ThatBox1)
- Artem [@Artemgood477](https://github.com/Artemgood477)
- Ben [@benjaminjamesweb](https://github.com/benjaminjamesweb)
- Max [@xameryn](https://github.com/xameryn)
- Travis [@Travis975](https://github.com/Travis975)

## Main Idea
Project Name: Notro

- A self-hostable cloud storage for you and your friends with Discord compatibility.

### Description
The user will be able to set up a cloud server on their own local machine to store files and from there they can easily share with friends either embedded in discord or access to users' collection via the cloud frontend. The plan would be to make the frontend interface in React + JS that the user would run in browser to access the cloud server. The main aspect we are wanting to achieve is discord compatibility which would allow OAUTH with discord and embedding media links similar to youtube media. This will allow for easy sharing of videos and other media since discord has an 8mb limit for file sharing. 


### Features

- Deployable on user hardware
- Cloud limited to set users via whitelist / user roles synced with Discord
- Extensive config (also set by user) for upload limit, file types, amount of files, etc.
- Video embed support for Discord (basically a YouTube player when a video link from the server is sent) 
- Users have basic CRUD capabilities through React frontend
- Make collections to store media (images, videos, audio, etc. (sorted within Discord servers?))
- Set collection visability (filterable by user roles / whitelist)
- Sign in using Discord OAUTH2 to import Discord data (ie. servers & roles)
- React Frontend
- Potentially: Discord bot to act as a proxy for pulling / pushing data from Discord Servers (ie. user info, role info, post file via command, save file via command, etc.)
- Potentially: A centralized option for users who arn't able to self-host, would use a storage provider such as S3 and charge for use like other cloud storage providers

### Potential Issues
- Port Forwarding for sharing the local server
  - Solved by creating a tunnel (stretch goal as port-forwarding is not difficult)
    - Tunnelling introduces bandwidth concerns so would ideally be avoided
- Server uptime set by friend hosting
  - Not inherently an issue but something to keep in mind

## Secondary Idea
Project Name: NearReel

- An area based application to connect people in their given area and share short videos like a TikToks.

### Description
A TikTok-like social media website where users can view/post short videos (<5 seconds). The most unique feature of the app is that it’s location-based (like Tinder), so users can only view content from their area (they can specify the radius from <50m to <15km). The benefit of this is that users see/interact with local content, so using the app
connects them more to their real-life surroundings. The app would be coded in React. It would be a web app (in other words a website), only accessible through the browser (not the app store). However, responsive CSS would allow for the website to be used on mobile screens, iPad screens, and laptop screens, making it somewhat "cross-platform" (even if it’s web only). Cloud services like Amazon S3 could be used for storing the videos. To keep our Amazon bill low (or ideally non-existent), we might make it so that videos are converted to 144p when uploaded. The 5 second limit also helps with this.  

### Features
- Typical user secure sign up/log in 
- The “feed” (a TikTok-like timeline of short-form videos from other users) 
- Each video (or “post”) displays the poster’s username (which can be clicked on to view their profile/all videos) 
- Videos also have typical information like captions, hashtags, likes, comments 
- Every user has a personal (public) page where their videos can be viewed (as well as info like bio, number of subscribers, number of posts, etc.) 
- Users can follow other users 
- Users can message other users 
- Users can set their radius (like Tinder). However, the max radius should still be small (e.g. <15km). 
- All posts display the location of the video/picture in question. Clicking on that should take you to a map showing the location as a pin 
- Potentially: you can browse videos by map? 
- Potentially: all posts and time-based as well as location-based (so you only see videos from the last 48 hours, for example)? 
- Potentially: AI is used for giving priority to the most viral / interesting / personalized content – also for weeding out / flagging spam / inappropriate content? 

### Potential Issues
- Testing/development will be difficult as locations must be spoofed while uploading / viewing
- Relies on large userbase to have a saturation of visible posts
  - Hard to appeal to more rural market with an area-based feed
