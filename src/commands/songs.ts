import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

import fs from 'fs';

function getAllSongs() {
    const songs = fs.readdirSync('songs').filter(file => file.endsWith('.opus'));
    return songs.map(song => {
        return song.replace('.opus', '');
    }).join('\n');
}

export const command = {
	data: new SlashCommandBuilder()
		.setName('songs')
		.setDescription('List available songs in the library'),
	async execute(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.reply(getAllSongs());
        } catch (error) {
            console.error(`Error: ${error}`);
            await interaction.reply(`Error: ${error}`);
        }
	},
};
