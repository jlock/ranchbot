import fs from "fs";
import { pipeline, PassThrough } from "node:stream";
import {
  createAudioPlayer,
  createAudioResource,
  StreamType,
} from "@discordjs/voice";

let speakerCount = 0;
let timer;

export async function listen(connection) {
  console.log("Listening...");

  connection.receiver.speaking.on("start", async (userId) => {
    clearTimeout(timer);

    console.log(`User ${userId} started speaking`);
    speakerCount++;
    console.log("speakers", speakerCount);
  });

  connection.receiver.speaking.on("end", async (userId) => {
    console.log(`User ${userId} stopped speaking`);
    speakerCount--;
    console.log("speakers", speakerCount);

    if (speakerCount === 0 && timer === undefined) {
      timer = setTimeout(function () {
        playGnome();
      }, 5000);
    }
  });

  function playGnome() {
    const audioPlayer = createAudioPlayer();
    connection.subscribe(audioPlayer);

    const gnomeSoundResource = createAudioResource("sounds/gnome.opus", {
      inlineVolume: true,
      inputType: StreamType.Opus,
    });
    gnomeSoundResource.volume.setVolume(0.5);

    audioPlayer.play(gnomeSoundResource);

    clearTimeout(timer);
  }
}
