import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';

InstallGlobalCommands(process.env.APP_ID, [
  {
    name: 'hyuck',
    description: 'Make a goofy noise',
    type: 1,
  },
  {
    name: 'play',
    description: 'Play a song from youtube',
    type: 1,
    options: [
      {
        name: 'song',
        description: 'The song url',
        type: 3,
        required: true,
      },
    ],
  }
]);