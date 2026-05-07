const fs = require('fs');
const xml = fs.readFileSync('docx_temp/word/document.xml', 'utf8');
const text = xml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
console.log(text);
