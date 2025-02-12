import { AudioResource, createAudioPlayer, VoiceConnection } from "@discordjs/voice";
import { ChatInputCommandInteraction } from "discord.js";

interface QueueItem {
  song: string;
  resource: AudioResource<null>;
  interaction: ChatInputCommandInteraction;
}

class Player {
  private queue: QueueItem[] = [];
  private audioPlayer = createAudioPlayer();
  private currentInteraction: ChatInputCommandInteraction | undefined;

  constructor() {
    this.audioPlayer.on("error", (error) => {
      console.error(error);
    
      if (this.currentInteraction) {
        this.currentInteraction.followUp(`${error}`);
      }
    });
    
    this.audioPlayer.on("stateChange", (oldState, newState) => {
      console.log(
        `Player transitioned from ${oldState.status} to ${newState.status}`
      );
    
      if (newState.status === "idle") {
        this.next();
      }
    });
    
    this.audioPlayer.on("subscribe", (connection) => {
      console.log(`Subscribed to connection ${connection}`);
    });
  }

  async play(song: string, resource: AudioResource<null>, connection: VoiceConnection, interaction: ChatInputCommandInteraction) {
    this.currentInteraction = interaction;

    connection.subscribe(this.audioPlayer);

    if (this.audioPlayer.state.status === "idle") {
      try {
        this.audioPlayer.play(resource);
        return `Playing ${song}`;
      } catch (error) {
        console.error("Error playing song:", error);
        return `Error playing ${song}`;
      }
    } else {
      this.queue.push({
        song: song,
        resource: resource,
        interaction: interaction,
      });
      return `Queuing ${song}`;
    }
  }

  async pause() {
    console.log("Pausing player");
    this.audioPlayer.pause();
  }

  async resume() {
    console.log("Resuming player");
    this.audioPlayer.unpause();
  }

  async skip() {
    console.log("Skipping song");
    await this.next();
  }

  async next() {
    console.log("Playing next song");
    console.log("Queue:", this.queue.length);
  
    if (this.queue.length === 0) return;
  
    const next = this.queue.shift();
    try {
      if (!next) return;
      this.audioPlayer.play(next.resource);
    } catch (error) {
      console.error("Error playing next song:", error);
      if (next?.interaction) {
        await next.interaction.followUp("Error playing next song");
      }
      return;
    }
  
    if (next.interaction !== undefined) {
      next.interaction.followUp(`Playing ${next.song}`);
    }
  }
}

export const player = new Player();
