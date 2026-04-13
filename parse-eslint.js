const fs = require('fs');
try {
  let fileContent = fs.readFileSync('eslint.json', 'utf16le');
  // Strip BOM if present
  if (fileContent.charCodeAt(0) === 0xFEFF) {
    fileContent = fileContent.slice(1);
  }
  const data = JSON.parse(fileContent);
  const errors = [];
  for (const file of data) {
    for (const msg of file.messages) {
      if (msg.severity === 2) {
        errors.push(`${file.filePath}:${msg.line}:${msg.column} - ${msg.ruleId}`);
      }
    }
  }
  fs.writeFileSync('eslint-clean.log', errors.join('\n'));
  console.log(`Found ${errors.length} errors. Written to eslint-clean.log`);
} catch (e) {
  console.log('JSON not ready or failed to parse', e.message);
}
