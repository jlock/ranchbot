import { SlashCommandBuilder } from "discord.js";
import { connect } from "../utilities/connection.js";

export const command = {
  data: new SlashCommandBuilder()
    .setName("connect")
    .setDescription("Add the bot to your channel"),
  async execute(interaction) {
    try {
      const voiceChannel = interaction.member.voice.channel;
      const _ = connect(voiceChannel);

      await interaction.reply(`Connected to ${voiceChannel.name}`);
    } catch (error) {
      console.error(error);
      await interaction.reply(error);
    }
  },
};
