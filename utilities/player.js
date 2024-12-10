import { createAudioPlayer } from '@discordjs/voice';

const audioPlayer = createAudioPlayer();
const queue = [];

// Hold onto the previous interaction from play to send messages
let currentInteraction;

audioPlayer.on('error', error => {
    console.error(error);

    if (currentInteraction) {
        currentInteraction.followUp(`${error}`);
    }
});

audioPlayer.on('stateChange', (oldState, newState) => {
    console.log(`Player transitioned from ${oldState.status} to ${newState.status}`);  
    
    if (newState.status === 'idle') {
        playNext();
    }
});

audioPlayer.on('subscribe', connection => {
    console.log(`Subscribed to connection ${connection}`);
});

async function playNext() {
    console.log('Playing next song');
    console.log('Queue:', queue.length);

    if (queue.length === 0) return; 

    const next = queue.shift();
    try {
        await audioPlayer.play(next.resource);
    } catch (error) {
        console.error('Error playing next song:', error);
        await next.interaction.followUp('Error playing next song');
        return;
    }

    if (next.interaction !== undefined) {
        next.interaction.followUp(`Playing ${next.song}`);
    }
}

export const player = {
    async play(song, resource, connection, interaction) {
        connection.subscribe(audioPlayer);
        currentInteraction = interaction;

        if (audioPlayer.state.status === 'idle') {
            try {
                await audioPlayer.play(resource);
                return `Playing ${song}`;
            } catch (error) {
                console.error('Error playing song:', error);
                return `Error playing ${song}`;
            }
        } else {
            queue.push({
                song: song, 
                resource: resource, 
                interaction: interaction
            });
            return `Queuing ${song}`;
        }
    },
    async pause() {
        audioPlayer.pause();
    },
    async resume() {
        audioPlayer.unpause();
    },
    async skip() {
        console.log('Skipping song');
        await playNext();
    },
};
