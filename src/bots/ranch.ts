import { readdirSync } from 'node:fs';
import { GatewayIntentBits } from 'discord.js';
import config from '../../config.json' with { type: "json" };
import {createClient} from '../utilities/client.js';

const { token } = config.discord.ranch;
const intents = [
	GatewayIntentBits.Guilds, 
	GatewayIntentBits.GuildVoiceStates,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent, 
	GatewayIntentBits.GuildMembers
] 
const client = createClient({token, intents, ready: client => {
	console.log(`Logged in as ${client.user?.tag}`);
}});

const commandPath = 'commands'
for (const commandFile of readdirSync(commandPath)) {
	const {command} = await import(`../${commandPath}/${commandFile}`);
	
	if ('data' in command && 'execute' in command) {
		// @ts-ignore
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${command} is missing a required "data" or "execute" property.`);
	}
}

const eventPath = 'events'
for (const eventFile of readdirSync(eventPath)) {
	const {event} = await import(`../${eventPath}/${eventFile}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
