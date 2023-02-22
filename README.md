# Intro
This is an app that connects between Twitter and Discord.
The app will retrieve from a specific user's Twitter feed, looking for any new posts, and embed them into private messages for specified users in Discord via a Discord bot.

# Why?
Because Drizzerd needs to know about Weird Al.

# How to use
You can run the development version by running `npm run dev` in the console. This will build and run the app.
Twitter stores the logic for connecting to Twitter and finding the newest Tweet from someone's feed.
Discord stores the logic for connecting the Discord bot.
Control is the main loop, which will check the Twitter feed and respond with Discord messages.

# Installation
`npm install`
