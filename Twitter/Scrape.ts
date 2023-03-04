import puppeteer from 'puppeteer';
import { ITwitterInterface } from '../Interfaces';

const TweetLinkSelector = "div[aria-label*='Timeline'] a[dir*='ltr']";

export class Scraper implements ITwitterInterface {
    _browser;
    _page;

    constructor(){
        this._browser = null;
        this._page = null;
    }

    async GetMostRecentTweetId(username: string){
        const tweetUrl = await this.GetMostRecentTweetUrl(username);
        return tweetUrl.match(/\d+$/)[0];
    }

    async GetMostRecentTweetUrl(username: string){
        const page = await this.GetPage();
        await page.goto(`https://twitter.com/${username}`);

        await page.waitForSelector(TweetLinkSelector);
        return page.$eval(TweetLinkSelector, (el) => el.href);
    }

    ConvertToUrl(tweetId: string){
        return `https://twitter.com/weirdalstims/status/${tweetId}`;
    }

    async Cleanup(){
        await this._browser.close();

        this._browser = null;
        this._page = null;
    }

    async Reboot(){
        await this.Cleanup();

        // Next time we call GetPage, it'll launch and grab the new page
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