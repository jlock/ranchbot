import { createAudioPlayer } from '@discordjs/voice';

const audioPlayer = createAudioPlayer();

audioPlayer.on('error', error => {
    console.error(error);
});

audioPlayer.on('stateChange', (oldState, newState) => {
    console.log(`Player transitioned from ${oldState.status} to ${newState.status}`);  
    
    if (newState.status === 'idle' && queue.length > 0) {
        const next = queue.shift();
        audioPlayer.play(next.resource);
        if (next.interaction !== undefined) {
            next.interaction.followUp(`Playing ${next.song}`);
        }
    }
});

audioPlayer.on('subscribe', connection => {
    console.log(`Subscribed to connection ${connection}`);
});

const queue = [];
export const player = {
    async play(song, resource, connection, interaction) {
        connection.subscribe(audioPlayer);

        if (audioPlayer.state.status === 'idle') {
            audioPlayer.play(resource);
            return `Playing ${song}`;
        } else {
            queue.push({
                song: song, 
                resource: resource, 
                interaction: interaction
            });
            return `Queuing ${song}`;
        }
    }
};
