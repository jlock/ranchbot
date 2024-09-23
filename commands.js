import { REST, Routes } from 'discord.js';
import config from './config.json' with { type: "json" };
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { dirname } from 'path';

const { clientId, jaysId: guildId, token } = config;
const rest = new REST().setToken(token);

const action = process.argv[2];

console.log(process.argv);

switch (action) {
	case 'register': register(); break;
	case 'delete': deleteCommand(process.argv[3]); break;
	default: console.log('Please provide an action. [register|delete]'); break;
}

async function register() {
	const commands = [];

	for (const commandFile of readdirSync('commands')) {
	  const {command} = await import(join(dirname(import.meta.url), 'commands', commandFile));
	
	  if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	  } else {
		console.log(`[WARNING] The command at ${commandFile} is missing a required "data" or "execute" property.`);
	  }
	}
	
	(async () => {
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);
	
			const data = await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: commands },
			);
	
			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		} catch (error) {
			console.error(error);
		}
	})();	
}

async function deleteCommand(commandId) {
	rest.delete(Routes.applicationCommand(clientId, commandId))
		.then(() => console.log('Successfully deleted application command'))
		.catch(console.error);
}
