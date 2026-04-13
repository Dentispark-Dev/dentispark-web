const fs = require('fs');
const path = require('path');

// ── Build route map from app directory ──────────────────────────────────────
function getRoutes(dir, base = '') {
  const routes = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Unwrap (groups), keep [params] as-is
      const segment = entry.name.startsWith('(') && entry.name.endsWith(')')
        ? ''
        : '/' + entry.name;
      routes.push(...getRoutes(full, base + segment));
    } else if (entry.name === 'page.tsx' || entry.name === 'page.ts') {
      routes.push(base || '/');
    }
  }
  return routes;
}

const appDir = path.join(__dirname, 'src', 'app');
const routes = [...new Set(getRoutes(appDir))].sort();

// ── Walk all tsx/ts files ────────────────────────────────────────────────────
function walk(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.next') {
      files = files.concat(walk(full));
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      files.push(full);
    }
  }
  return files;
}

const srcDir = path.join(__dirname, 'src');
const files = walk(srcDir);

// ── Extract internal links ───────────────────────────────────────────────────
const LINK_RE = /(?:href|router\.push|router\.replace)\(?\s*["'`](\/[^"'`\s\?#)]*)/g;
const links = new Map(); // url -> [{file, line}]

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    let m;
    const re = /(?:href|push|replace)\(?\s*["'`](\/[^"'`\s\?#)]+)/g;
    while ((m = re.exec(lines[i])) !== null) {
      const url = m[1];
      if (!url.startsWith('//') && !url.includes('http')) {
        if (!links.has(url)) links.set(url, []);
        links.get(url).push({ file: path.relative(__dirname, file), line: i + 1 });
      }
    }
  }
}

// ── Match link against routes ─────────────────────────────────────────────────
function matchesRoute(url, routes) {
  // Normalize: strip trailing slashes
  const u = url.replace(/\/$/, '') || '/';
  for (const r of routes) {
    const norm = r.replace(/\/$/, '') || '/';
    // Convert dynamic segments to regex
    const re = new RegExp('^' + norm.replace(/\[\.\.\..*?\]/g, '.*').replace(/\[.*?\]/g, '[^/]+') + '$');
    if (re.test(u)) return true;
  }
  return false;
}

const broken404s = [];
for (const [url, locs] of links) {
  // Skip monitoring routes, API routes, and anchors
  if (url.startsWith('/api/') || url.startsWith('/monitoring') || url === '/') continue;
  if (!matchesRoute(url, routes)) {
    broken404s.push({ url, locs });
  }
}

// ── Hook import audit ─────────────────────────────────────────────────────────
const HOOKS = ['useState', 'useEffect', 'useCallback', 'useRef', 'useMemo', 'useReducer', 'useContext', 'useTransition', 'useLayoutEffect'];
const hookErrors = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const usedHooks = HOOKS.filter(h => new RegExp(`\\b${h}\\(`).test(content));
  const importedHooks = HOOKS.filter(h => {
    // Check both named import from 'react' or destructured
    return new RegExp(`\\b${h}\\b`).test(content.split('\n').slice(0, 30).join('\n'));
  });
  const missing = usedHooks.filter(h => !importedHooks.includes(h));
  // Double-check: is it actually imported properly?
  const realMissing = usedHooks.filter(h => {
    const importLines = content.split('\n').filter(l => l.includes('import') && l.includes(h));
    return importLines.length === 0;
  });
  if (realMissing.length > 0) {
    hookErrors.push({ file: path.relative(__dirname, file), hooks: realMissing });
  }
}

// ── Output ───────────────────────────────────────────────────────────────────
console.log('=== PLATFORM AUDIT REPORT ===\n');
console.log(`Total routes: ${routes.length}`);
console.log(`Total source files scanned: ${files.length}`);
console.log(`Total internal links found: ${links.size}`);
console.log('');

console.log('=== BROKEN ROUTES (404 candidates) ===');
if (broken404s.length === 0) {
  console.log('No broken routes found.');
} else {
  for (const { url, locs } of broken404s.sort((a,b)=>a.url.localeCompare(b.url))) {
    console.log(`\n  ❌ ${url}`);
    for (const { file, line } of locs.slice(0, 3)) {
      console.log(`     ↳ ${file}:${line}`);
    }
    if (locs.length > 3) console.log(`     ↳ ...and ${locs.length - 3} more`);
  }
}

console.log('\n=== MISSING HOOK IMPORTS (APP-RENDER-ERR candidates) ===');
if (hookErrors.length === 0) {
  console.log('No missing hook imports found.');
} else {
  for (const { file, hooks } of hookErrors) {
    console.log(`\n  ⚠️  ${file}`);
    console.log(`     Missing: ${hooks.join(', ')}`);
  }
}

console.log('\n=== VALID ROUTES ===');
for (const r of routes) console.log(' ', r);
