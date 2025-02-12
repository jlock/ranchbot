import { Client, Collection, GatewayIntentBits } from 'discord.js';

export function createClient({token, intents, ready}: {token: string, intents: GatewayIntentBits[], ready: (client: Client) => void}) {
    const client = new Client({ intents });

    client.login(token);

    // @ts-ignore
    client.commands = new Collection();

    client.on('debug', console.log);
    client.on('warn', console.warn);
    client.on('error', console.error);
    client.on('ready', () => {
        ready(client);
    });

    return client;
}