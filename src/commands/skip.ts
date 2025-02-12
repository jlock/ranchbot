import { player } from '../utilities/player.js';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip current song'),
	async execute(interaction: ChatInputCommandInteraction) {
        player.skip();
        await interaction.reply('Song skipped');
	},
};