import { joinVoiceChannel, getVoiceConnection } from '@discordjs/voice';

export function connect(voiceChannel) {
    if (!voiceChannel) {
        throw 'You need to be in a voice channel to play music!';
    }

    let connection = getVoiceConnection(voiceChannel.guild.id);

    if (!connection) {
        connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
    }

    return connection;
}