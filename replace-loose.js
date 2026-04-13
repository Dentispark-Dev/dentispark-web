const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');
let changed = 0;
for (const file of files) {
  if (file.includes('loose.ts')) continue;
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/Record<string,\s*any>/g, 'LooseRecord');
  if (content !== newContent) {
    if (!newContent.includes('LooseRecord')) continue;
    if (!newContent.includes('from "@/src/types/loose"')) {
        const importStatement = `import { LooseRecord } from "@/src/types/loose";\n`;
        const lastImportIndex = newContent.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
            const endOfLine = newContent.indexOf('\n', lastImportIndex);
            newContent = newContent.slice(0, endOfLine + 1) + importStatement + newContent.slice(endOfLine + 1);
        } else {
            if (newContent.includes('"use client"')) {
                const eol = newContent.indexOf('\n', newContent.indexOf('"use client"'));
                newContent = newContent.slice(0, eol + 1) + importStatement + newContent.slice(eol + 1);
            } else {
                newContent = importStatement + newContent;
            }
        }
    }
    fs.writeFileSync(file, newContent, 'utf8');
    changed++;
    console.log(`Updated ${file}`);
  }
}
console.log(`Changed ${changed} files.`);
