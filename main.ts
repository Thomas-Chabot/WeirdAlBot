import { Scraper } from "./Twitter/Scrape";
import { Bot } from "./Discord/Bot";
import { Setup, Loop } from "./Control/Loop";

require('dotenv').config();
(async () => {
    await Setup();
    await Loop();
})();