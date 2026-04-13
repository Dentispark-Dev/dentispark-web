const fs = require('fs');
const path = require('path');

const fixes = [
  // Missing useEffect imports
  'src/app/(dashboard)/ai-hub/acceptance-odds/page.tsx',
  'src/app/(dashboard)/ai-hub/study-planner/page.tsx',
  'src/app/(website)/services/[slug]/page.tsx',
];

for (const rel of fixes) {
  const file = path.join(__dirname, rel);
  let content = fs.readFileSync(file, 'utf8');
  // Check if useEffect is used but not imported
  if (/\buseEffect\(/.test(content) && !content.includes('useEffect')) {
    console.log(`SKIP ${rel} - false positive`);
    continue;
  }
  if (/\buseEffect\(/.test(content)) {
    // Fix import line - add useEffect if missing from the react import
    const reactImportRe = /import\s+(?:React,\s*)?\{([^}]*)\}\s*from\s+["']react["']/;
    const m = reactImportRe.exec(content);
    if (m) {
      const imports = m[1];
      if (!imports.includes('useEffect')) {
        const newImports = imports.trim() + ', useEffect';
        content = content.replace(m[0], m[0].replace(m[1], newImports));
        fs.writeFileSync(file, content, 'utf8');
        console.log(`FIXED useEffect import in: ${rel}`);
      } else {
        console.log(`ALREADY OK: ${rel}`);
      }
    } else {
      // No react import at all - check for default import
      if (content.includes("import React") && !content.includes('useEffect')) {
        content = content.replace(
          /import React from ["']react["']/,
          "import React, { useEffect } from 'react'"
        );
        fs.writeFileSync(file, content, 'utf8');
        console.log(`FIXED useEffect (default import) in: ${rel}`);
      } else {
        // Add import
        content = "import { useEffect } from 'react';\n" + content;
        fs.writeFileSync(file, content, 'utf8');
        console.log(`ADDED useEffect import to: ${rel}`);
      }
    }
  }
}
console.log('Done.');
