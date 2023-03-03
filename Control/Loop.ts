import { Scraper } from "../Twitter";
import { Bot } from "../Discord";
import { TargetUsers, Interval } from "../Configuration.json" 
import { Control as Log } from "../Logs/Logger"
import * as CacheDb from "../Database/cache";

const scraper = new Scraper();
const bot = new Bot();

const GetTweetLink = scraper.GetMostRecentTweetUrl.bind(scraper, "WeirdAlStims");
const FixTweetLink = (link: string)=>link.replace("twitter", "fxtwitter");
const GetTweetId = (link: string)=>link.match(/\d+$/)[0];

let firstRun = true;

async function CheckForNewTweet(){
    let newestTweet;
    try {
        newestTweet = await GetTweetLink();
    } catch (ex) {
        Log("Failed to find new tweet with exception: ", ex.message);

        // Reboot the browser in case the browser session closed
        await scraper.Reboot();

        return;
    }

    // If we've already sent this tweet, ignore it
    const tweetId = GetTweetId(newestTweet);
    const alreadySeenTweet = await CacheDb.HasTweet(tweetId);
    if (alreadySeenTweet){
        return;
    }

    // Add the tweet to the database
    await CacheDb.AddTweet(tweetId);

    // New tweet
    Log("Found new tweet: ", newestTweet);

    // NOTE: If this is the first tweet found, we don't want to send the video.
    // This is to prevent spamming if the bot gets rebooted
    if (firstRun){
        firstRun = false;
        return;
    }

    // Alert everyone
    const fixedLink = FixTweetLink(newestTweet);
    TargetUsers.forEach(async userId => {
        try {
            await bot.SendMessage(userId, fixedLink);
        } catch (ex) {
            Log("Failed to send message to", userId, "with exception:", ex.message);
            return;
        }
    });
}

export async function Loop(){
    try {
        await CheckForNewTweet();
    } catch {

    }


    // Note: This is pretty hardcoded, ideally 
    setTimeout(Loop, Interval * 1000);
}

export async function Setup(){
    await bot.Login(process.env.BOT_TOKEN);
    console.log("Discord bot logged in");

    await CacheDb.CreateDbTable();
    console.log("Cache database created");
}