const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
    }
  });
  return arrayOfFiles;
}

const allFiles = getAllFiles('src');
const tsxFiles = allFiles.filter(f => f.endsWith('.tsx'));
const cssFiles = allFiles.filter(f => f.endsWith('.module.css'));

let globalCss = '';

cssFiles.forEach(file => {
  globalCss += fs.readFileSync(file, 'utf8') + '\n';
  fs.unlinkSync(file); // remove module css
});

fs.writeFileSync(path.join(srcDir, 'app', 'landing.css'), globalCss);

tsxFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import styles from '\.\/.*\.module\.css';/g, '');
  
  // Replace {styles.className} with "className"
  content = content.replace(/\{styles\.([a-zA-Z0-9_]+)\}/g, '"$1"');
  
  // Replace `${styles.button} ${styles[variant]} ${className || ''}` with `"button " + variant + " " + (className || '')`
  // A generic way to fix template literals with styles:
  // First, replace styles.foo with "foo"
  content = content.replace(/\$\{styles\.([a-zA-Z0-9_]+)\}/g, '$1');
  // Then replace styles[variant] with ${variant}
  content = content.replace(/\$\{styles\[([a-zA-Z0-9_]+)\]\}/g, '${$1}');

  fs.writeFileSync(file, content);
});

console.log('Refactored to global CSS');
