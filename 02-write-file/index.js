const fs = require('fs');
const path = require('path');
const os = require('os');
const { stdin, stdout } = process;

const pathToFile = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(pathToFile, { encoding: 'utf-8' });

stdout.write('How are you?\n');

const lowerExit = 'exit' + os.EOL;
const upperExit = 'EXIT' + os.EOL;

stdin.on('data', (input) => {
  input.toString() === lowerExit || input.toString() === upperExit
    ? process.exit()
    : output.write(input);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write(' See you again! '));
