import { player } from '../utilities/player.js';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resume song'),
	async execute(interaction: ChatInputCommandInteraction) {
        player.resume();
        await interaction.reply('Song resumed');
	},
};