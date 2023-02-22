import { Scraper } from "./Twitter/Scrape";
import { Bot } from "./Discord/Bot";

require('dotenv').config();
(async () => {
    const bot = new Bot();
    await bot.Login(process.env.BOT_TOKEN);
    console.log("Logged in");

    await bot.SendMessage('209020511383060491', "Hello");
    
    // const scraper = new Scraper();
    // const href = await scraper.GetMostRecentTweetUrl("WeirdAlStims");
    // console.log(href);

    // await scraper.Cleanup();

    //Init();
})();