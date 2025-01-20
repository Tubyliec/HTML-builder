const path = require('path');
const fs = require('fs');
const { stdout } = require('process');

const filePath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(filePath, 'utf-8');

let fullData = '';

stream.on('data', (chunk) => (fullData += chunk));
stream.on('end', () => stdout.write(fullData));
stream.on('error', (error) => stdout.write(error.message));
