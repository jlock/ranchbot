import { Events } from 'discord.js';

export const event = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}.\n${process.env.npm_package_name}: ${process.env.npm_package_version}`);
	},
};
