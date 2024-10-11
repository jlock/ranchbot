import {SpeechClient} from '@google-cloud/speech'
import fs from 'fs';
import {pipeline, PassThrough} from 'node:stream';
import { createAudioPlayer, createAudioResource, StreamType } from '@discordjs/voice';


const speechClient = new SpeechClient();

export async function listen(connection) {
    console.log('Listening...');

    connection.receiver.speaking.on("start", async userId => { 
        console.log(`User ${userId} started speaking`);

        // const audioPath = `speech/${userId}.wav`;
        // const file = fs.createWriteStream(audioPath);
        // const audioStream = new PassThrough();

        // pipeline(audioStream, file, (err) => {
        //     if (err) {
        //         console.error('Pipeline failed:', err);
        //     }
        // });

        // audioStream.on('end', async () => {
        //     const file = fs.readFileSync(audioPath);
        //     const request = {
        //         audio: { content: file.toString('base64') },
        //         config: {
        //             encoding: 'LINEAR16',
        //             sampleRateHertz: 16000,
        //             languageCode: 'en-US',
        //         },
        //     };

        //     const [response] = await speechClient.recognize(request);
        //     const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
        //     console.log(`Transcription: ${transcription}`);
        // });
    });

    connection.receiver.speaking.on("end", async userId => { 
        console.log(`User ${userId} stopped speaking`);

        const audioPlayer = createAudioPlayer();
        connection.subscribe(audioPlayer);    
	
        const gnomeSoundResource = createAudioResource('sounds/gnome.opus', {inlineVolume: true, inputType: StreamType.Opus});
        gnomeSoundResource.volume.setVolume(0.5);

        audioPlayer.play(gnomeSoundResource);
    });
}