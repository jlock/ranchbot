import { SlashCommandBuilder } from 'discord.js';
import { createAudioResource } from '@discordjs/voice';
import { player } from '../utilities/player.js';
import { connect } from '../utilities/connection.js';
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
            const connection = connect(voiceChannel);    
            const stream = ytdl(song, { filter: 'audioonly' });
            const resource = createAudioResource(stream);
        
            const response = await player.play(song, resource, connection, interaction);
            await interaction.reply(response);
        } catch (error) {
            console.error(error);
            await interaction.reply(error);
        }
	},
};
