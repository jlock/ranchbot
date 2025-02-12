import { GatewayIntentBits } from 'discord.js';
import config from '../../config.json' assert { type: "json" };
import { joinVoiceChannel } from '@discordjs/voice';
import { listen } from '../utilities/listen';
import { createClient } from '../utilities/client';
import yargs from 'yargs';

const argv = await yargs(process.argv.slice(2)) 
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

const _ = createClient({token, intents, ready: client => {
  const adapterCreator = client.guilds.cache.get(guildId)?.voiceAdapterCreator;

  if (adapterCreator) {
    const connection = joinVoiceChannel({
      channelId,
      guildId,
      adapterCreator,
      selfDeaf: true,
    });

    listen(connection);
  }
}});