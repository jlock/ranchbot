import { exec } from 'child_process';

const folder = process.argv[2];
const fileName = process.argv[3];
const url = process.argv[4];

const command = `yt-dlp -o '${folder}/${fileName}.%(ext)s' ${url} --audio-format opus -x`;
console.log(command);
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});