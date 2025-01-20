const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const { stdout } = require('process');
const { EOL } = require('os');

const PathToOriginFiles = path.join(__dirname, 'styles');
const PathToMergedFile = path.join(__dirname, 'project-dist', 'bundle.css');

const output = fs.createWriteStream(PathToMergedFile, { encoding: 'utf-8' });

async function mergeCss() {
  try {
    const files = await fsPromises.readdir(
      PathToOriginFiles,
      { withFileTypes: true },
      (err, files) => {
        if (err) {
          stdout.write(err.message);
        }
        return files;
      },
    );

    for (const file of files) {
      const pathToFile = path.join(PathToOriginFiles, file.name);
      const fileExtension = path.extname(pathToFile);
      if (file.isFile()) {
        if (fileExtension === '.css') {
          const input = fs.createReadStream(pathToFile, {
            encoding: 'utf-8',
          });
          input.on('data', (chunk) => output.write(chunk));
          stdout.write(`Style "${file.name}" copied successfully!${EOL}`);
        }
      }
    }
  } catch (err) {
    stdout.write(err.message);
  }
}

mergeCss();
