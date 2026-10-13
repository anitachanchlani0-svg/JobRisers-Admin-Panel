const fs = require('fs');
let code = fs.readFileSync('src/pages/Overview.tsx', 'utf8');

// Find the end of `ActivityRow` which is `  );\n}`.
const match = code.match(/function ActivityRow[\s\S]*?\}\n/);
if (match) {
  const index = code.indexOf(match[0]) + match[0].length;
  code = code.substring(0, index);
  fs.writeFileSync('src/pages/Overview.tsx', code);
} else {
  console.log("ActivityRow not found");
}

