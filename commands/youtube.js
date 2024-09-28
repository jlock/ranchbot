import { SlashCommandBuilder } from 'discord.js';
import { createAudioResource } from '@discordjs/voice';
import { getPlayer } from '../ultilities/player.js';
import { getConnection } from '../ultilities/connection.js';
import ytdl from '@distube/ytdl-core';

export const command = {
	data: new SlashCommandBuilder()
		.setName('youtube')
		.setDescription('Play a song from youtube')
        .addStringOption(option => option.setName('song').setDescription('Youtube song to play').setRequired(true)),
	async execute(interaction) {
        try {
            const song = interaction.options.getString('song');

            if (!ytdl.validateURL(song)) {
                await interaction.reply('Invalid YouTube URL!');
                return;
            }

            if (!song) {
                await interaction.reply('You need to provide a song to play!');
                return;
            }
            
            const voiceChannel = interaction.member.voice.channel;
            const connection = getConnection(voiceChannel);    
            const player = getPlayer(connection);

            const stream = ytdl(song, { filter: 'audioonly' });
            const resource = createAudioResource(stream);
        
            const response = await player.play(song, resource, connection, interaction);
            await interaction.reply(response);
        } catch (error) {
            console.error(`Error: ${error}`);
            await interaction.reply(error);
        }
	},
};
