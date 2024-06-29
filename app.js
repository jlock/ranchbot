import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
} from 'discord-interactions';
import { VerifyDiscordRequest } from './utils.js';
import ytdl from 'ytdl-core';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.post('/interactions', async function (req, res) {
  const { type, data, member } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = data;

    switch (name) {
    case 'hyuck': return hyuck(res);
    case 'restart': return restart(res);
    case 'play': 
    console.log(member.user.voice);
      const voiceChannel = member.user.voice.channel;
      const song = options[0].value;
      if (!voiceChannel) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'You need to be in a voice channel to use this command.',
          },
        });
      }

      const connection = await voiceChannel.join();
      const stream = ytdl(song, { filter: 'audioonly' });
      const dispatcher = connection.play(stream);

      dispatcher.on('finish', () => {
        voiceChannel.leave();
      });

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Playing audio from YouTube...',
        },
      });
    default:
      console.error('Unknown command:', name);
    }
  }
});

async function hyuck(res) {
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: 'Ahyuck!',
    },
  });
}

async function play(res, song, member) {
  
}

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
