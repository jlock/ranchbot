import { createAudioPlayer, createAudioResource, StreamType } from "@discordjs/voice";

export function play(connection) {
    const audioPlayer = createAudioPlayer();
    connection.subscribe(audioPlayer);

    const gnomeSoundResource = createAudioResource("sounds/gnome.opus", {
      inlineVolume: true,
      inputType: StreamType.Opus,
    });
    gnomeSoundResource.volume.setVolume(0.5);

    audioPlayer.play(gnomeSoundResource);
}