import { player } from '../utilities/player.js';
import { SlashCommandBuilder } from 'discord.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause current song'),
	async execute(interaction) {
        player.pause();
        await interaction.reply('Song paused');
	},
};
