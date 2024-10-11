import { SlashCommandBuilder } from 'discord.js';
import { createAudioResource, StreamType } from '@discordjs/voice';
import { player } from '../utilities/player.js';
import { connect } from '../utilities/connection.js';

const VOLUME = 0.5;

export const command = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song from the library')
        .addStringOption(option => option.setName('song').setDescription(`Song to play`).setRequired(true)),
	async execute(interaction) {
        try {
            const song = interaction.options.getString('song');
            if (!song) {
                await interaction.reply('You need to provide a song to play!');
                return;
            }
            
            const voiceChannel = interaction.member.voice.channel;
            const connection = connect(voiceChannel);    

            const resource = createAudioResource(`songs/${song}.opus`, {inlineVolume: true, inputType: StreamType.Opus});
            resource.volume.setVolume(VOLUME);
        
            const response = await player.play(song, resource, connection, interaction);
            await interaction.reply(response);
        } catch (error) {
            console.error(`Error: ${error}`);
            await interaction.reply(error);
        }
	},
};
