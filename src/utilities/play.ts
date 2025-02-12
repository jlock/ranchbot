import { createAudioPlayer, createAudioResource, StreamType, VoiceConnection } from "@discordjs/voice";

export function play(connection: VoiceConnection) {
    const audioPlayer = createAudioPlayer();
    connection.subscribe(audioPlayer);

    const gnomeSoundResource = createAudioResource("sounds/gnome.opus", {
      inlineVolume: true,
      inputType: StreamType.Opus,
    });

    gnomeSoundResource.volume?.setVolume(0.5);
    audioPlayer.play(gnomeSoundResource);
}