import { Client, Collection } from 'discord.js';

export function createClient({token, intents, ready}) {
    const client = new Client({ intents });

    client.commands = new Collection();

    client.login(token);

    client.on('debug', console.log);
    client.on('warn', console.warn);
    client.on('error', console.error);
    client.on('ready', ready);

    return client;
}