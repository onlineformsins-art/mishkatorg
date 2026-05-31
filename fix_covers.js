const fs = require('fs');
let covers = fs.readFileSync('covers.js', 'utf8');
const updates = [
  { id: 'B16', file: 'C:\\\\Users\\\\HP\\\\.gemini\\\\antigravity\\\\brain\\\\b9a4e8ca-e298-4482-9e07-c84cc65d205d\\\\media__1780226341330.jpg' },
  { id: 'B17', file: 'C:\\\\Users\\\\HP\\\\.gemini\\\\antigravity\\\\brain\\\\b9a4e8ca-e298-4482-9e07-c84cc65d205d\\\\media__1780233707217.png' },
  { id: 'B18', file: 'C:\\\\Users\\\\HP\\\\.gemini\\\\antigravity\\\\brain\\\\b9a4e8ca-e298-4482-9e07-c84cc65d205d\\\\media__1780234416943.png' },
  { id: 'B11', file: 'C:\\\\Users\\\\HP\\\\.gemini\\\\antigravity\\\\brain\\\\b9a4e8ca-e298-4482-9e07-c84cc65d205d\\\\media__1780234576809.jpg' },
  { id: 'B19', file: 'C:\\\\Users\\\\HP\\\\.gemini\\\\antigravity\\\\brain\\\\b9a4e8ca-e298-4482-9e07-c84cc65d205d\\\\media__1780243215855.png' },
  { id: 'B20', file: 'C:\\\\Users\\\\HP\\\\.gemini\\\\antigravity\\\\brain\\\\b9a4e8ca-e298-4482-9e07-c84cc65d205d\\\\media__1780244779683.jpg' }
];

let appended = "\n";
for (let u of updates) {
  let ext = u.file.endsWith('.png') ? 'png' : 'jpeg';
  let buf = fs.readFileSync(u.file);
  let b64 = buf.toString('base64');
  appended += `COVERS['${u.id}'] = 'data:image/${ext};base64,${b64}';\n`;
}

fs.writeFileSync('covers12.js', covers + appended, 'utf8');
