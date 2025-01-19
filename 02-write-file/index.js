const fs = require('fs');
const path = require('path');
const os = require('node:os');
const { stdin, stdout } = process;

const pathToFile = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(pathToFile, { encoding: 'utf-8' });

stdout.write('How are you?\n');

stdin.on('data', (input) => {
  if (
    input.toString() === 'exit' + os.EOL ||
    input.toString() === 'EXIT' + os.EOL
  ) {
    process.exit();
  } else {
    output.write(input);
  }
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write(' See you again! '));
