import { AudioResource, createAudioResource, StreamType } from '@discordjs/voice';
import ytdl from '@distube/ytdl-core';
import fs from 'node:fs';
import config from '../../config.json' with { type: "json" };

const URL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=';
const BASE_URL = 'https://www.youtube.com/watch?v=';

interface Resource {
    audioResource: AudioResource<null>;
    song: string;
}

const agent = ytdl.createAgent(JSON.parse(fs.readFileSync("cookies.json").toString()));

export async function getResource(song: string): Promise<Resource> {
    const localFileName = `songs/${song}.opus`;

    if (fs.existsSync(localFileName)) {
        console.log('Local file found');
        const audioResource = createAudioResource(localFileName, { inlineVolume: true, inputType: StreamType.Opus });

        return Promise.resolve({audioResource, song});
    } else if (ytdl.validateURL(song)) {
        console.log('Youtube URL detected');
        const stream = ytdl(song, { filter: 'audioonly', agent });
        const audioResource = createAudioResource(stream);
        
        return Promise.resolve({audioResource, song});
    } else {
        console.log('No song found, searching youtube');

        const songName = await youtubeSearch(song);
        if (songName) {
            console.log('Youtube search found', songName);
            const stream = ytdl(songName, { filter: 'audioonly', agent });
            const audioResource = createAudioResource(stream); 

            return Promise.resolve({audioResource, song: songName});
        }
    }

    return Promise.reject('No song found on youtube or on server');
}

export async function youtubeSearch(searchString: string) {
    const url = `${URL}${encodeURIComponent(searchString)}&key=${config.google.key}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error('Search: Error fetching the top video:', response);
            return undefined;
        }
        const data = await response.json();
        
        if (data.items.length > 0) {
            console.log('Search: Found a video:', data.items[0]);
            return BASE_URL + data.items[0].id.videoId;
        } else {
            console.log('Search: No videos found');
            return undefined;
        }
    } catch (error) {
        console.error('Search: Error fetching the top video:', error);
        return undefined;
    }
}