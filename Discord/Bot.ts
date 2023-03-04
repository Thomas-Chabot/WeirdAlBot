const { Client, GatewayIntentBits } = require('discord.js');
import { Discord as Log } from "../Logs/Logger";

export class Bot {
    _client;
    
    constructor(){
        this._client = new Client({ intents: [GatewayIntentBits.Guilds] });
    }

    Login(token: string): Promise<void>{
        return new Promise((fulfill) => {
            this._client.login(token);
            this._client.on('ready', fulfill);
        });
    }

    async SendMessage(targetUserId: string, message: string): Promise<void>{
        const user = await this._client.users.fetch(targetUserId, false);

        Log("Sending message to user: ", user.username);
        await user.send(message);
    }
}