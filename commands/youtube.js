import { SlashCommandBuilder } from 'discord.js';
import { createAudioResource, StreamType } from '@discordjs/voice';
import { getPlayer } from '../player.js';
import { getConnection } from '../connection.js';

const VOLUME = 0.5;

export const command = {
	data: new SlashCommandBuilder()
		.setName('youtube')
		.setDescription('Play a song from youtube')
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

            const stream = ytdl(song, { filter: 'audioonly' });
            const resource = createAudioResource(stream);
        
            player.play(resource);

            await interaction.reply(`Playing ${song}`);
        } catch (error) {
            console.error(`Error: ${error}`);
            await interaction.reply(error);
        }
	},
};
