const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const { EOL } = require('os');

const pathToFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFolder, { withFileTypes: true }, (err, files) => {
  if (err) {
    stdout.write(err.message);
  }
  for (const file of files) {
    if (file.isFile()) {
      const pathToFile = path.join(pathToFolder, file.name);
      const fileName = file.name.replace(`${path.extname(pathToFile)}`, '');
      const fileExtension = path.extname(pathToFile).replace('.', '');

      fs.stat(pathToFile, (err, stats) => {
        const convertToKb = (stats.size / 1024).toFixed(3);
        const fileInfo = `${fileName} - ${fileExtension} - ${convertToKb}kb${EOL}`;
        err ? stdout.write(err.message) : stdout.write(fileInfo);
      });
    }
  }
});
