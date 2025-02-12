import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { player } from '../utilities/player';
import { connect, getVoiceChannel } from '../utilities/connection';
import { getResource } from '../utilities/youtube';

export const command = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song. Can be a song from the songs list, a youtube URL or a search.')
        .addStringOption(option => option.setName('song').setDescription('Song to play').setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {
        try {
            let song = interaction.options.getString('song');
            
            if (!song) {
                await interaction.reply('You need to provide a song to play!');
                return;
            }

            const voiceChannel = getVoiceChannel(interaction);
            if (!voiceChannel) {
                await interaction.reply('You need to be in a voice channel to play a song');
                return;
            }

            let resource;
            try {
                resource = await getResource(song);
            } catch(error) {
                await interaction.reply('No song found on youtube or on the server');
                return;
            } 

            const connection = connect(voiceChannel);    
            const response = await player.play(resource.song, resource.audioResource, connection, interaction);
            
            await interaction.reply(response);
        } catch (error) {
            console.error(error);
            await interaction.reply(`${error}`);
        }
	},
};
