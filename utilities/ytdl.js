import fs from 'fs';
import ytdl from '@distube/ytdl-core';

const agent = ytdl.createAgent(JSON.parse(fs.readFileSync("cookies.json")));

export {
    agent
}
