import { joinVoiceChannel, getVoiceConnection } from '@discordjs/voice';
import { ChatInputCommandInteraction, VoiceBasedChannel } from 'discord.js';

export function getVoiceChannel(interaction: ChatInputCommandInteraction) {
    const member = interaction.member;
    let voiceChannel;
    if (member && 'voice' in member) {
        voiceChannel = member.voice.channel;
    }

    return voiceChannel;
}

export function connect(voiceChannel: VoiceBasedChannel) {
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