const fs = require('fs');
const path = require('path');

const filesToFix = [
  'app/[lang]/city/[city]/[topic]/page.tsx',
  'app/[lang]/compare/[slug]/page.tsx',
  'app/[lang]/wiki/[slug]/page.tsx',
  'app/[lang]/about/page.tsx',
  'app/[lang]/ask/page.tsx',
  'app/[lang]/contact/page.tsx',
  'app/[lang]/journey/preferences/page.tsx',
  'app/[lang]/privacy/page.tsx',
  'app/[lang]/saved/page.tsx',
  'app/[lang]/skin-check/page.tsx',
  'app/[lang]/terms/page.tsx',
  'app/[lang]/tools/period-calculator/page.tsx',
  'app/[lang]/tools/symptom-checker/page.tsx',
  'app/[lang]/whisper/page.tsx'
];

for (const file of filesToFix) {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${file}`);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf8');

  // Remove generateStaticParams if present
  const regex = /export\s+async\s+function\s+generateStaticParams\s*\(\)\s*\{[\s\S]*?\n\}/g;
  content = content.replace(regex, '');

  // Add edge runtime if not present
  if (!content.includes("export const runtime = 'edge';") && !content.includes('export const runtime = "edge";')) {
    // Find the last import statement
    const importRegex = /import\s+.*?;?\n/g;
    let match;
    let lastImportIndex = 0;
    while ((match = importRegex.exec(content)) !== null) {
      lastImportIndex = match.index + match[0].length;
    }
    
    content = content.slice(0, lastImportIndex) + "\nexport const runtime = 'edge';\n" + content.slice(lastImportIndex);
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Fixed: ${file}`);
}
