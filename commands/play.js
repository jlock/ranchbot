import { SlashCommandBuilder } from 'discord.js';
import { createAudioResource } from '@discordjs/voice';
import { player } from '../utilities/player.js';
import { connect } from '../utilities/connection.js';
import ytdl from '@distube/ytdl-core';
import config from '../config.json' with { type: "json" };
import fs from 'node:fs';

export const command = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song. Can be a song from the songs list, a youtube URL or a search.')
        .addStringOption(option => option.setName('song').setDescription('Song to play').setRequired(true)),
	async execute(interaction) {
        try {
            let song = interaction.options.getString('song');
            
            if (!song) {
                await interaction.reply('You need to provide a song to play!');
                return;
            }

            const localFileName = `songs/${song}.opus`;
            let resource;
            if (fs.existsSync(localFileName)) {
                console.log('Local file found, playing');
                resource = createAudioResource(localFileName, { inlineVolume: true, inputType: StreamType.Opus });
            }

            if (ytdl.validateURL(song)) {
                console.log('Youtube URL detected, playing');
                const stream = ytdl(song, { filter: 'audioonly' });
                resource = createAudioResource(stream);    
            }

            song = await youtubeSearch(song);
            if (song) {
                console.log('Youtube search found', song);
                const stream = ytdl(song, { filter: 'audioonly' });
                resource = createAudioResource(stream);    
            } else {
                await interaction.reply('No song found on youtube or on the server');
                return;
            }

            const voiceChannel = interaction.member.voice.channel;
            const connection = connect(voiceChannel);    
        
            const response = await player.play(song, resource, connection, interaction);
            await interaction.reply(response);
        } catch (error) {
            console.error(error);
            await interaction.reply(error);
        }
	},
};

async function youtubeSearch(searchString) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(searchString)}&key=${config.google.key}`;
    const youtubeBaseUrl = 'https://www.youtube.com/watch?v=';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error('Search: Error fetching the top video:', response.statusText);
            return false;
        }
        const data = await response.json();
        
        if (data.items.length > 0) {
            console.log('Search: Found a video:', data.items[0]);
            return youtubeBaseUrl + data.items[0].id.videoId;
        } else {
            console.log('Search: No videos found');
            return false;
        }
    } catch (error) {
        console.error('Search: Error fetching the top video:', error);
        return false;
    }
}