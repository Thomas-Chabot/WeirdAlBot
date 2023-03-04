/*
    This is the workaround to use the Twitter API.
    For now, it is built around Twitter API v1;
        this is because I have a very old developer account that had access to V1, which I don't have access to anymore.
    Ideally I'd like to get a new one to work off of but Twitter takes forever to grant access.
*/
const Twitter = require("twitter");
import { ITwitterInterface } from "../Interfaces";
export class TwitterApi implements ITwitterInterface {
    private client;

    constructor(consumerKey, consumerSecret, accessKey, accessSecret){
        this.client = new Twitter({
            consumer_key: consumerKey,
            consumer_secret: consumerSecret,
            access_token_key: accessKey,
            access_token_secret: accessSecret
        });
    }

    async GetMostRecentTweetId(username: string): Promise<string> {
        let tweets = await this.client.get('statuses/user_timeline', {
            screen_name: username,
            count: 1,
            trim_user: true
        });

        return tweets[0].id_str;
    }

    async GetMostRecentTweetUrl(username: string): Promise<string>{
        let tweetId = await this.GetMostRecentTweetId(username);
        return this.ConvertToUrl(tweetId);
    }

    ConvertToUrl(tweetId: string): string {
        return `https://twitter.com/weirdalstims/status/${tweetId}`;
    }
}