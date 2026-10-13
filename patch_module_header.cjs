const fs = require('fs');
let code = fs.readFileSync('src/pages/Module.tsx', 'utf8');

const regex = /<div className="mb-7">[\s\S]*?<\/div>\n      <\/div>/;
code = code.replace(regex, '');

fs.writeFileSync('src/pages/Module.tsx', code);
