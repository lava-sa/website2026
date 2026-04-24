const fs = require('fs');
const path = require('path');

const appsDir = './app/applications';
const imagesDir = './public/images/applications';

console.log('🚀 Starting batch image update...\n');

// Get all application folders
const appFolders = fs.readdirSync(appsDir).filter(f => {
  const fullPath = path.join(appsDir, f);
  return fs.statSync(fullPath).isDirectory();
});

console.log(`Found ${appFolders.length} application folders\n`);

let totalImages = 0;
let totalPages = 0;

appFolders.forEach(folder => {
  // Check for both .tsx and .ts files
  const pageFiles = [
    path.join(appsDir, folder, 'page.tsx'),
    path.join(appsDir, folder, 'page.ts')
  ].filter(f => fs.existsSync(f));

  if (pageFiles.length === 0) {
    console.log(`⚠️  Skipping ${folder} - no page file found`);
    return;
  }

  // If both exist, only process .tsx (Next.js prefers .tsx)
  const pageFile = pageFiles.find(f => f.endsWith('.tsx')) || pageFiles[0];
  
  console.log(`\n📁 Processing: ${folder}`);
  console.log(`   File: ${path.basename(pageFile)}`);

  let code = fs.readFileSync(pageFile, 'utf8');
  let changed = false;

  // 1. Add Image import if missing
  if (!code.includes('import Image from \'next/image\'')) {
    code = code.replace(
      'import type { Metadata } from "next";\nimport Link from "next/link";',
      'import type { Metadata } from "next";\nimport Link from "next/link";\nimport Image from \'next/image\';'
    );
    changed = true;
    console.log(`   ✅ Added Image import`);
  }

  // 2. Remove Placeholder function
  const placeholderFuncRegex = /function Placeholder\{[\s\S]*?^  \};/m;
  if (placeholderFuncRegex.test(code)) {
    code = code.replace(placeholderFuncRegex, '');
    changed = true;
    console.log(`   ✅ Removed Placeholder function`);
  }

  // 3. Replace all Placeholder tags with Image tags
  const placeholderTagRegex = /<Placeholder\s+label="([^"]+)"(\s+aspect="([^"]+)")?\s*\/>/g;
  let match;
  let imageCount = 0;

  while ((match = placeholderTagRegex.exec(code)) !== null) {
    const label = match[1];
    const aspect = match[3] || 'aspect-[16/7]';
    
    // Calculate dimensions based on aspect ratio
    let width = 1200, height = 525;
    if (aspect === 'aspect-[16/6]') {
      height = 450;
    } else if (aspect === 'aspect-[16/9]') {
      height = 675;
    } else if (aspect === 'aspect-[4/3]') {
      height = 900;
    }

    // Build alt text from label
    const altText = label
      .replace('app-', '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    const imageTag = `<Image \n            src="/images/applications/${label}.webp" \n            alt="${altText}" \n            width={${width}} \n            height={${height}}\n            className="w-full h-auto rounded-lg mb-8"\n          />`;

    code = code.replace(match[0], imageTag);
    imageCount++;
    changed = true;
  }

  if (imageCount > 0) {
    totalImages += imageCount;
    console.log(`   ✅ Replaced ${imageCount} placeholder(s) with images`);
  }

  // Save if changed
  if (changed) {
    fs.writeFileSync(pageFile, code);
    totalPages++;
    console.log(`   💾 Saved ${path.basename(pageFile)}`);
  } else {
    console.log(`   #  No changes needed`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`✨ COMPLETE! Updated ${totalImages} images across ${totalPages} pages`);
console.log('='.repeat(60));
console.log('\nNext: Run your site to see the images!');
console.log('cd C:\\Users\\ignat\\Local Sites\\lava-sa\\nextjs');
console.log('npm run dev');
console.log('\nThen visit: http://localhost:3000/applications/kitchen');