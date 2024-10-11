import { readdirSync } from 'node:fs';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import config from '../config.json' with { type: "json" };

const { token } = config.discord.ranch;

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent, 
		GatewayIntentBits.GuildMembers
	] 
});

client.commands = new Collection();

const commandPath = 'commands'
for (const commandFile of readdirSync(commandPath)) {
	const {command} = await import(`../${commandPath}/${commandFile}`);
	
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
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

client.on('debug', console.log);
client.on('warn', console.warn);
client.on('error', console.error);

client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}`);
});

client.login(token);
