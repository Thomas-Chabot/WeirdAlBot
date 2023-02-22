import { Scraper } from "../Twitter";
import { Bot } from "../Discord";
import { TargetUsers, Interval } from "../Configuration.json" 
import { Control as Log } from "../Logs/Logger"

let lastTweet = null;

const scraper = new Scraper();
const bot = new Bot();

const GetTweetLink = scraper.GetMostRecentTweetUrl.bind(scraper, "WeirdAlStims");
const FixTweetLink = (link: string)=>link.replace("twitter", "fxtwitter");

let firstRun = true;

async function CheckForNewTweet(){
    let newestTweet;
    try {
        newestTweet = await GetTweetLink();
    } catch (ex) {
        Log("Failed to find new tweet with exception: ", ex.message);
    }

    if (newestTweet === lastTweet){
        return;
    }

    // Otherwise, we have a new tweet
    lastTweet = newestTweet;
    Log("Found new tweet: ", newestTweet);

    // NOTE: If this is the first tweet found, we don't want to send the video.
    // This is to prevent spamming if the bot gets rebooted
    if (firstRun){
        firstRun = false;
        return;
    }

    // Alert everyone
    const fixedLink = FixTweetLink(newestTweet);
    TargetUsers.forEach(userId => {
        try {
            bot.SendMessage(userId, fixedLink);
        } catch (ex) {
            Log("Failed to send message to", userId, "with exception:", ex.message);
        }
    });
}

export async function Loop(){
    try {
        await CheckForNewTweet();
    } catch {

    }
    setTimeout(Loop, Interval * 1000);
}

export async function Setup(){
    await bot.Login(process.env.BOT_TOKEN);
}