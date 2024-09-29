import { SlashCommandBuilder } from 'discord.js';
import { connect } from '../utilities/connection.js';
import { listen } from '../utilities/listen.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('connect')
		.setDescription('Add the bot to your channel'),
	async execute(interaction) {
        try {            
            const voiceChannel = interaction.member.voice.channel;
            const connection = connect(voiceChannel);

            listen(connection);
            
            await interaction.reply(`Connected to ${voiceChannel.name}`);
        } catch (error) {
            console.error(error);
            await interaction.reply(error);
        }
	},
};
