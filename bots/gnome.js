import { GatewayIntentBits } from 'discord.js';
import config from '../config.json' with { type: "json" };
import { joinVoiceChannel } from '@discordjs/voice';
import { listen } from '../utilities/listen.js';
import { createClient } from '../utilities/client.js';
import yargs from 'yargs';
const argv = yargs(process.argv.slice(2))
  .option('guild', {
    alias: 'g',
    description: 'Discord guild (server) ID',
    type: 'string',
    demandOption: true
  })
  .option('channel', {
    alias: 'c', 
    description: 'Voice channel ID',
    type: 'string',
    demandOption: true
  })
  .argv;

const guildId = argv.guild;
const channelId = argv.channel;

const { token } = config.discord.gnome;
const intents = [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates];
const client = createClient({token, intents, ready: () => {
	const connection = joinVoiceChannel({
		channelId,
		guildId,
		adapterCreator: client.guilds.cache.get(guildId).voiceAdapterCreator,
		selfDeaf: true,
	});

	listen(connection);
}});