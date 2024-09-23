import { createAudioPlayer } from '@discordjs/voice';

let player;

export function getPlayer(connection) {
    if (!player) {
        createPlayer();
    }

    connection.subscribe(player);
    
    return player;
}

function createPlayer() {
    player = createAudioPlayer();

    player.on('error', error => {
        console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
    });
    
    player.on('stateChange', (oldState, newState) => {
        console.log(`Player transitioned from ${oldState.status} to ${newState.status}`);    
    });

    player.on('subscribe', connection => {
        console.log(`Subscribed to connection ${connection}`);
    });
}