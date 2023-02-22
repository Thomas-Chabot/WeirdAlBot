import { Scraper } from "./Twitter/Scrape";

(async () => {
    const scraper = new Scraper();
    const href = await scraper.GetMostRecentTweetUrl("WeirdAlStims");
    console.log(href);

    await scraper.Cleanup();
})();