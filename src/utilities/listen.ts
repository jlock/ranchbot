import { play } from "./play.js";
import { VoiceConnection } from "@discordjs/voice";
const TIMER_DURATION = 15000;
let speakerCount = 0;
let timer: NodeJS.Timeout | undefined;

export async function listen(connection: VoiceConnection) {
  console.log("Listening...");

  connection.receiver.speaking.on("start", async (userId) => {
    clearTimer();

    speakerCount++;
    console.log(`${userId} started speaking, speakers:`, speakerCount);
  });

  connection.receiver.speaking.on("end", async (userId) => {
    console.log(`${userId} stopped speaking, speakers:`, speakerCount);
    speakerCount--;

    if (speakerCount === 0 && timer === undefined) {
      console.log("Silence detected, starting timer");
      timer = setTimeout(function () {
        playGnome();
      }, TIMER_DURATION);
    }
  });

  function playGnome() {
    play(connection);
    clearTimer();
  }

  function clearTimer() {
    clearTimeout(timer);
    timer = undefined;
  }
}
