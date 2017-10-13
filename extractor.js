const Parser = require('i18next-scanner').Parser;
const recursive = require("recursive-readdir");
const { readFileSync, writeFileSync } = require('fs');
const { i18nextToPot } = require('i18next-conv');
const lngs = ['en'];

// i18next-scanner options
const options = {
  keySeparator: '|',
  lngs: lngs
};

let content = '';
const parser = new Parser(options);

const getFileExtension = (filename) => {
  return filename.split('.').pop();
};

// save file to disk
const save = (target) => {
  return result => {
    writeFileSync(target, result);
  };
};

recursive("src", function (err, files) {
  for (let file of files) {
    if (getFileExtension(file) === 'js') {
      content = readFileSync(file, 'utf-8');
      parser.parseFuncFromString(content);
    }
  }
  const translations = parser.get();
  for (let lng of lngs) {
    const currentTranslationsInJsonString = JSON.stringify(translations[lng].translation);
    i18nextToPot(lng, currentTranslationsInJsonString).then(save('i18n/' + lng + '.pot'));
  }
});
