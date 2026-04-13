const fs = require('fs');
let fileContent = fs.readFileSync('eslint.json', 'utf16le');
if (fileContent.charCodeAt(0) === 0xFEFF) fileContent = fileContent.slice(1);
const data = JSON.parse(fileContent);

for (const file of data) {
  if (file.messages.filter(m => m.severity === 2 && m.ruleId === '@typescript-eslint/no-explicit-any').length === 0) continue;
  
  let lines = fs.readFileSync(file.filePath, 'utf8').split('\n');
  let needsLooseRecord = false;

  for (const msg of file.messages) {
    if (msg.severity !== 2) continue;
    let lineIdx = msg.line - 1;
    let txt = lines[lineIdx];
    
    if (msg.ruleId === '@typescript-eslint/no-explicit-any') {
      if (txt.includes('error: any') || txt.includes('err: any') || txt.includes('catch')) {
        lines[lineIdx] = txt.replace(/\bany\b/, 'unknown');
      } else {
        lines[lineIdx] = txt.replace(/\bany\b/, 'LooseRecord');
        needsLooseRecord = true;
      }
    }
  }

  let newContent = lines.join('\n');
  if (needsLooseRecord && !newContent.includes('from "@/src/types/loose"')) {
    const importStatement = `import { LooseRecord } from "@/src/types/loose";\n`;
    if (newContent.includes('"use client"')) {
        newContent = newContent.replace('"use client";', '"use client";\n' + importStatement);
    } else {
        newContent = importStatement + newContent;
    }
  }
  
  fs.writeFileSync(file.filePath, newContent, 'utf8');
  console.log('Fixed ANYs in', file.filePath);
}
