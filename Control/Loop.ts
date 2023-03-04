import { TwitterApi } from "../Twitter";
import { Bot } from "../Discord";
import { TargetUsers, Interval } from "../Configuration.json" 
import { Control as Log } from "../Logs/Logger"
import * as CacheDb from "../Database/cache";
import { ITwitterInterface } from "../Interfaces";

let twitter : ITwitterInterface;
const bot = new Bot();

const accountName = "WeirdAlStims";
let GetTweetId: ()=>Promise<string>;
const FixTweetLink = (link: string)=>link.replace("twitter", "fxtwitter");

async function CheckForNewTweet(){
    let tweetId;
    try {
        tweetId = await GetTweetId();
    } catch (ex) {
        Log("Failed to find new tweet with exception: ", ex.message);
        return;
    }

    // If we've already sent this tweet, ignore it
    const alreadySeenTweet = await CacheDb.HasTweet(tweetId);
    Log("Checking for tweet; found ", tweetId);
    Log("\tThis tweet has been seen before: ", alreadySeenTweet);
    if (alreadySeenTweet){
        return;
    }

    // Add the tweet to the database
    await CacheDb.AddTweet(tweetId);

    // Alert everyone
    const fixedLink = FixTweetLink(twitter.ConvertToUrl(tweetId));
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

    // Twitter API keys
    const consumerKey = process.env.TWITTER_CONSUMER_KEY;
    const consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
    const accessTokenKey = process.env.TWITTER_ACCESS_KEY;
    const accessTokenSecret = process.env.TWITTER_ACCESS_SECRET;
    twitter = new TwitterApi(consumerKey, consumerSecret, accessTokenKey, accessTokenSecret);
    
    GetTweetId = twitter.GetMostRecentTweetId.bind(twitter, accountName);
}