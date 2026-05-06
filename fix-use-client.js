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
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');

  // If the file contains 'use client', make sure it's at the very top.
  const useClientRegex = /^\s*['"]use client['"];?\s*/m;
  const match = content.match(useClientRegex);
  
  if (match) {
    // Remove the existing 'use client'
    content = content.replace(useClientRegex, '\n');
    
    // Add it to the very beginning
    content = "'use client';\n" + content.trimStart();
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Fixed use client in: ${file}`);
  }
}
