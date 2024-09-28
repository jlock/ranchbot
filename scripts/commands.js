import { REST, Routes } from 'discord.js';
import config from '../config.json' with { type: "json" };
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { dirname } from 'path';

const { clientId, guildIds, token } = config.ranch;
const rest = new REST().setToken(token);

const action = process.argv[2];

switch (action) {
	case 'register': register(); break;
	case 'delete': deleteAllCommands(); break;
	default: console.log('Please provide an action. [register|delete]'); break;
}

async function register() {
	const commands = [];

	for (const commandFile of readdirSync('commands')) {
	  const {command} = await import(`../commands/${commandFile}`);
	
	  if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	  } else {
		console.log(`[WARNING] The command at ${commandFile} is missing a required "data" or "execute" property.`);
	  }
	}
	
	(async () => {
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);
	
			for (const guildId of guildIds) {
				const data = await rest.put(
					Routes.applicationGuildCommands(clientId, guildId),
					{ body: commands },
				);

				console.log(`Successfully reloaded ${data.length} application (/) commands.`);
			}
		} catch (error) {
			console.error(error);
		}
	})();	
}

async function deleteAllCommands() {
	for (const guildId of guildIds) {
		rest.put(Routes.applicationGuildCommands(clientId, guildId))
			.then(() => console.log('Successfully deleted commands'))
			.catch(console.error);

		rest.put(Routes.applicationCommands(clientId))
			.then(() => console.log('Successfully deleted global commands'))
			.catch(console.error);
	}
}
