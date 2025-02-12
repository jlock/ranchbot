//ollama run llama3.2

import { SlashCommandBuilder } from "discord.js";
import { spawn } from "child_process";

export const command = {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Message llama3.2")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("Prompt for the AI")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const prompt = interaction.options.getString("prompt");

      if (!prompt) {
        await interaction.reply("You need to provide a prompt");
        return;
      }

      await interaction.reply("give me a hyuck");

      const command = [
        "powershell.exe",
        "ollama",
        "run",
        "llama3.2",
        `${prompt}`,
      ];
      console.log("running command:", command);

      const process = spawn(command[0], command.slice(1)); // Use spawn with separate command and arguments

      process.stdout.on("data", (data) => {
        interaction.followUp(data.toString());
      });

      process.stderr.on("data", (data) => {
        console.error("stderr:", data.toString());
        interaction.followUp("No output from command");
      });

      process.on("error", (error) => {
        console.error("Error executing command:", error);
        interaction.followUp("Error executing command: " + error.message);
      });

      process.on("close", (code) => {
        if (code !== 0) {
          console.log(`Command exited with code ${code}`);
        }
      });
    } catch (error) {
      console.error(error);
      await interaction.reply(error);
    }
  },
};
