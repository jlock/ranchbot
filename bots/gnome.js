import { Client, Collection, GatewayIntentBits } from 'discord.js';
import config from '../config.json' with { type: "json" };
import { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType } from '@discordjs/voice';

const guildId = process.argv[2];
const channelId = process.argv[3];
const secondsTimeout = process.argv[4];
const sounds = ['sounds/gnome.opus', 'sounds/reverb.opus'];
const volume = 0.1;

if (guildId === undefined || channelId === undefined || secondsTimeout === undefined) {
	console.error('Please provide a guild ID and a channel ID. `yarn gnome <guildId> <channelId> <secondsTimeout>`');
	process.exit(1);
}

const { token } = config.discord.gnome;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates] });

client.commands = new Collection();

client.on('debug', console.log);
client.on('warn', console.warn);
client.on('error', console.error);

client.login(token);

client.on('ready', async () => {
	startTheGnome();
});

const audioPlayer = createAudioPlayer();
audioPlayer.on('error', error => { console.error(error) });
audioPlayer.on('subscribe', connection => console.log('Subscribed to connection'));
audioPlayer.on('stateChange', (oldState, newState) => {
	console.log(`Player transitioned from ${oldState.status} to ${newState.status}`);
});

let timeToGnome = 0;
function countdown() {
	if (timeToGnome <= 0) {
		console.log(`No timeout set, waiting for next gnome`);
	} else {
		console.log(`Time to gnome: ${timeToGnome/1000}`);
	}	
	
	setTimeout(() => {
		timeToGnome -= 1000;
		countdown();
	}, 1000);
}
countdown();

function startTheGnome() {
	function getTimeout(max) {
		const random = Math.floor(Math.random() * (max * 1000)) + 5000;
		return random + 5000;
	}
	
	playSound();

	const timeout = getTimeout(secondsTimeout);
	timeToGnome = timeout;
	setTimeout(() => {
		startTheGnome();
	}, timeout);
}

async function playSound() {
	const connection = joinVoiceChannel({
		channelId,
		guildId,
		adapterCreator: client.guilds.cache.get(guildId).voiceAdapterCreator,
		selfDeaf: false,
	});

	connection.subscribe(audioPlayer);    
	
	const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
	console.log(`Playing ${randomSound}`);
	const gnomeSoundResource = createAudioResource(randomSound, {inlineVolume: true, inputType: StreamType.Opus});
	const volume = Math.random() * (0.5 - 0.1) + 0.1;
	console.log(`Setting volume to ${volume}`);
	gnomeSoundResource.volume.setVolume(volume);

    audioPlayer.play(gnomeSoundResource);
}