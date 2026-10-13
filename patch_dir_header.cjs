const fs = require('fs');
let code = fs.readFileSync('src/pages/Directory.tsx', 'utf8');

const regex = /<div className="flex flex-wrap items-end justify-between gap-4">[\s\S]*?<\/div>\n      <\/div>/;
code = code.replace(regex, '');

fs.writeFileSync('src/pages/Directory.tsx', code);
