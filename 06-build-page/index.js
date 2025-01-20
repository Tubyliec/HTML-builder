const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const { stdout } = require('process');
const { EOL } = require('os');

const pathToProject = path.join(__dirname, 'project-dist');
const pathToAssets = path.join(__dirname, 'assets');
const pathToProjectAssets = path.join(pathToProject, 'assets');
const pathToStyles = path.join(__dirname, 'styles');
const pathToProjectStyles = path.join(pathToProject, 'style.css');

async function createMainFile() {
  const pathToTemplate = path.join(__dirname, 'template.html');
  const pathToMainFile = path.join(pathToProject, 'index.html');

  try {
    await fsPromises.copyFile(pathToTemplate, pathToMainFile);

    let mainFile = await fsPromises.readFile(pathToMainFile, {
      encoding: 'utf-8',
    });

    const pathToComponents = path.join(__dirname, 'components');
    const components = await fsPromises.readdir(
      pathToComponents,
      {
        withFileTypes: true,
      },
      (err, components) => {
        if (err) {
          stdout.write(err.message);
        }
        return components;
      },
    );

    for (const component of components) {
      if (component.isFile()) {
        const pathToComponent = path.join(pathToComponents, component.name);
        const fileExtension = path.extname(pathToComponent);
        if (fileExtension === '.html') {
          const fileContent = await fsPromises.readFile(
            pathToComponent,
            'utf-8',
          );
          const fileName = component.name.replace(fileExtension, '');
          mainFile = mainFile.replace(`{{${fileName}}}`, fileContent);
          await fsPromises.writeFile(pathToMainFile, mainFile);
          stdout.write(
            `Component "${component.name}" copied successfully!${EOL}`,
          );
        }
      }
    }
  } catch (err) {
    stdout.write(err.message);
  }
}

async function copyDirectory(source, destination) {
  try {
    await fsPromises.mkdir(destination, { recursive: true });

    const files = await fsPromises.readdir(
      source,
      { withFileTypes: true },
      (err, files) => {
        if (err) {
          stdout.write(err.message);
        }
        return files;
      },
    );

    for (const file of files) {
      const pathToOriginFile = path.join(source, file.name);
      const pathToCopyFile = path.join(destination, file.name);
      if (file.isDirectory()) {
        copyDirectory(pathToOriginFile, pathToCopyFile);
        stdout.write(`Directory "${file.name}" copied successfully!${EOL}`);
      }
      if (file.isFile()) {
        fsPromises.copyFile(pathToOriginFile, pathToCopyFile);
        stdout.write(`File "${file.name}" copied successfully!${EOL}`);
      }
    }
  } catch (err) {
    stdout.write(err.message);
  }
}

async function mergeCss(source) {
  const output = fs.createWriteStream(pathToProjectStyles, {
    encoding: 'utf-8',
  });
  try {
    const files = await fsPromises.readdir(
      source,
      { withFileTypes: true },
      (err, files) => {
        if (err) {
          stdout.write(err.message);
        }
        return files;
      },
    );

    for (const file of files) {
      const pathToFile = path.join(source, file.name);
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

async function buildProject() {
  await fsPromises.rm(pathToProject, { recursive: true, force: true });
  await fsPromises.mkdir(pathToProject, { recursive: true });
  await createMainFile();
  await copyDirectory(pathToAssets, pathToProjectAssets);
  await mergeCss(pathToStyles);
}

buildProject();
