import { SlashCommandBuilder } from 'discord.js';
import ytdl from '@distube/ytdl-core';
import { exec } from 'child_process';

export const command = {
	data: new SlashCommandBuilder()
		.setName('download')
		.setDescription('Download a song from youtube URL')
        .addStringOption(option => option.setName('song').setDescription('Song to download').setRequired(true))
        .addStringOption(option => option.setName('name').setDescription('Name the song').setRequired(true)),
	async execute(interaction) {
        try {
            let song = interaction.options.getString('song');
            
            if (!song) {
                await interaction.reply('You need to provide a song to play!');
                return;
            }

            const name = interaction.options.getString('name');
            if (!song) {
                await interaction.reply('Name your song!');
                return;
            }

           if (ytdl.validateURL(song)) {
                console.log('Youtube URL detected, downloading'); 
                await interaction.reply(`Downloading ${name}`);
                
                exec(`yarn download songs ${name} ${song}`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                    console.error(`stderr: ${stderr}`);
                });
            } else {
               await interaction.reply('Invalid youtube link');
               return;
            }
        } catch (error) {
            console.error(error);
            await interaction.reply(error);
        }
	},
};