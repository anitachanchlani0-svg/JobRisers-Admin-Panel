const fs = require('fs');

let code = fs.readFileSync('src/pages/Overview.tsx', 'utf8');

// Remove the local EmptyState and EmptyInline functions from the bottom
code = code.replace(/function EmptyState\([\s\S]*?\}[\n]+function EmptyInline\([\s\S]*?\}/, '');

fs.writeFileSync('src/pages/Overview.tsx', code);
