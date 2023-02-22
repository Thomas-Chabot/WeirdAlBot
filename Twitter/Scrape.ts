import puppeteer from 'puppeteer';

const TweetLinkSelector = "div[aria-label*='Timeline'] a[dir*='ltr']";

export class Scraper {
    _browser;
    _page;

    constructor(){
        this._browser = null;
        this._page = null;
    }

    async GetMostRecentTweetUrl(username: string){
        const page = await this.GetPage();
        await page.goto(`https://twitter.com/${username}`);

        await page.waitForSelector(TweetLinkSelector);
        return page.$eval(TweetLinkSelector, (el) => el.href);
    }

    async Cleanup(){
        await this._browser.close();

        this._browser = null;
        this._page = null;
    }

    private async GetPage(){
        if (this._browser === null){
            this._browser = await puppeteer.launch();
        }

        if (this._page === null){
            this._page = await this._browser.newPage();
        }

        return this._page;
    }
}