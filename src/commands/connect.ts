import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { connect } from "../utilities/connection.js";
import { getVoiceChannel } from "../utilities/connection.js";
export const command = {
  data: new SlashCommandBuilder()
    .setName("connect")
    .setDescription("Add the bot to your channel"),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const voiceChannel = getVoiceChannel(interaction);
      if (!voiceChannel) {
        await interaction.reply("You need to be in a voice channel to connect the bot");
        return;
      }

      const _ = connect(voiceChannel);

      await interaction.reply(`Connected to ${voiceChannel.name}`);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: `An error occurred: ${error}`, ephemeral: true });
    }
  },
};
