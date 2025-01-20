const fs = require('fs/promises');
const path = require('path');
const { stdout } = require('process');
const { EOL } = require('os');

const pathToSource = path.join(__dirname, 'files');
const pathToDestination = path.join(__dirname, 'files-copy');

async function copyDirectory() {
  try {
    await fs.rm(pathToDestination, { recursive: true, force: true });
    await fs.mkdir(pathToDestination, { recursive: true });

    const files = await fs.readdir(
      pathToSource,
      { withFileTypes: true },
      (err, files) => {
        if (err) {
          stdout.write(err.message);
        }
        return files;
      },
    );

    for (const file of files) {
      if (file.isFile()) {
        const pathToOriginFile = path.join(pathToSource, file.name);
        const pathToCopyFile = path.join(pathToDestination, file.name);
        fs.copyFile(pathToOriginFile, pathToCopyFile);
        stdout.write(`File "${file.name}" copied successfully!${EOL}`);
      }
    }
  } catch (err) {
    stdout.write(err.message);
  }
}
copyDirectory();
