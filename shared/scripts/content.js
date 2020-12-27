
const YAML = require('yamljs');
const path = require('path');
const fs = require('fs');

const coreFiles = fs.readdirSync(`${__dirname}/../content/core`);
const vagabondFiles = fs.readdirSync(`${__dirname}/../content/vagabonds`);

const fData = {
  core: {},
  vagabonds: {}
};

coreFiles.forEach(file => {
  const data = YAML.load(`${__dirname}/../content/core/${file}`);
  fData.core[file.split('.')[0]] = data;
});

vagabondFiles.forEach(file => {
  const data = YAML.load(`${__dirname}/../content/vagabonds/${file}`);
  fData.vagabonds[data.archetype] = data;
});

if(!fs.existsSync('shared/_output')) fs.mkdirSync('shared/_output');
fs.writeFileSync(`shared/_output/content.json`, JSON.stringify(fData, null, 4));