const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '..', 'src', 'data', 'words_common_1000.json'),
  path.join(__dirname, '..', 'src', 'data', 'words_short_1000.json')
];

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.warn('Missing', file);
    continue;
  }
  const txt = fs.readFileSync(file, 'utf8');
  let arr = JSON.parse(txt);
  arr = arr.map(obj => {
    if (obj.translation === undefined && obj.meaning !== undefined) {
      obj.translation = obj.meaning;
      delete obj.meaning;
    }
    return obj;
  });
  fs.writeFileSync(file, JSON.stringify(arr, null, 2), 'utf8');
  console.log('Updated', file);
}
