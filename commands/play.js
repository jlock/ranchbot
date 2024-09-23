import { SlashCommandBuilder } from 'discord.js';
import { createAudioResource, StreamType } from '@discordjs/voice';
import { getPlayer } from '../player.js';
import { getConnection } from '../connection.js';

const VOLUME = 0.5;

export const command = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song from the library')
        .addStringOption(option => option.setName('song').setDescription('Youtube song to play').setRequired(true)),
	async execute(interaction) {
        try {
            const song = interaction.options.getString('song');
            if (!song) {
                await interaction.reply('You need to provide a song to play!');
                return;
            }
            
            const voiceChannel = interaction.member.voice.channel;
            const connection = getConnection(voiceChannel);    
            const player = getPlayer(connection);

            const resource = createAudioResource(`songs/${song}.opus`, {inlineVolume: true, inputType: StreamType.Opus});
            resource.volume.setVolume(VOLUME);
            // const stream = ytdl(song, { filter: 'audioonly' });
            // console.log('stream', stream);
            // const resource = createAudioResource(stream);
        
            player.play(resource);

            const songTitle = song.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            await interaction.reply(`Playing ${songTitle}`);
        } catch (error) {
            console.error(`Error: ${error}`);
            await interaction.reply(error);
        }
	},
};
