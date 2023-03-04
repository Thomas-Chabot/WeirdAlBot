export interface ITwitterInterface {
    GetMostRecentTweetId(username: string): Promise<string>;
    GetMostRecentTweetUrl(username: string): Promise<string>;

    ConvertToUrl(tweetId: string): string;
}