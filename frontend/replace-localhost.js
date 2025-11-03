const fs = require('fs');
const path = require('path');
const glob = require('glob');

const excludeDirs = ['node_modules', '.git', 'dist', 'build'];

function shouldExclude(filePath) {
  return excludeDirs.some(dir => filePath.includes(dir));
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix: fetch`${process.env... -> fetch(`${process.env...`
    if (content.includes('fetch`${process.env.REACT_APP_API_URL}')) {
      content = content.replace(
        /fetch`\$\{process\.env\.REACT_APP_API_URL\}([^`]*?)`/g,
        'fetch(`${process.env.REACT_APP_API_URL}$1`'
      );
      modified = true;
    }

    // Fix: new URL`${process.env... -> new URL(`${process.env...`)
    if (content.includes('new URL`${process.env.REACT_APP_API_URL}')) {
      content = content.replace(
        /new URL`\$\{process\.env\.REACT_APP_API_URL\}([^`]*?)`/g,
        'new URL(`${process.env.REACT_APP_API_URL}$1`)'
      );
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Fixed: ${filePath}`);
      return true;
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
  return false;
}

function findAndFixFiles() {
  let totalFiles = 0;
  let fixedFiles = 0;

  const pattern = path.join('./src', '**/*.{js,jsx,ts,tsx}');
  const files = glob.sync(pattern, {
    ignore: excludeDirs.map(d => `**/${d}/**`)
  });

  files.forEach(file => {
    if (!shouldExclude(file)) {
      totalFiles++;
      if (processFile(file)) {
        fixedFiles++;
      }
    }
  });

  console.log(`\n📊 Summary: ${fixedFiles}/${totalFiles} files fixed`);
}

findAndFixFiles();
