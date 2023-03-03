import { GetDb } from "./db";
import { Database as Log } from "../Logs/Logger";

export async function CreateDbTable(){
    const db = await GetDb();
    await db.exec(`CREATE TABLE IF NOT EXISTS Cache
    (
        TweetId STRING PRIMARY KEY
    )
    `);

    Log("Created Db Cache table");
}
export async function HasTweet(tweetId: string){
    const db = await GetDb();
    return await db.get(`SELECT * FROM Cache WHERE TweetId = '${tweetId}'`) !== undefined;
}
export async function AddTweet(tweetId: string){
    const db = await GetDb();
    await db.exec(`INSERT INTO Cache (TweetId) VALUES ('${tweetId}');`)
}