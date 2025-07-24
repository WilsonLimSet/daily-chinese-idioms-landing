const fs = require('fs').promises;
const path = require('path');

async function updateAppLinks() {
  const oldId = 'id6740611324';
  const newId = 'id6740611324';
  const oldAppName = 'daily-chinese-idioms';
  const newAppName = 'chengyu-daily-chinese-idioms';
  
  // Directories to search
  const dirs = [
    path.join(__dirname, '../content/blog'),
    path.join(__dirname, '../scripts'),
    path.join(__dirname, '../src'),
    path.join(__dirname, '../app')
  ];
  
  let updatedCount = 0;
  
  for (const dir of dirs) {
    const files = await fs.readdir(dir, { withFileTypes: true });
    
    for (const file of files) {
      if (file.isDirectory()) {
        // Recursively search subdirectories
        const subDir = path.join(dir, file.name);
        const subFiles = await fs.readdir(subDir, { withFileTypes: true });
        
        for (const subFile of subFiles) {
          if (!subFile.isDirectory() && (subFile.name.endsWith('.md') || subFile.name.endsWith('.js') || subFile.name.endsWith('.ts') || subFile.name.endsWith('.tsx'))) {
            const filePath = path.join(subDir, subFile.name);
            await updateFile(filePath, oldId, newId, oldAppName, newAppName);
          }
        }
      } else if (file.name.endsWith('.md') || file.name.endsWith('.js') || file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
        const filePath = path.join(dir, file.name);
        await updateFile(filePath, oldId, newId, oldAppName, newAppName);
      }
    }
  }
  
  async function updateFile(filePath, oldId, newId, oldAppName, newAppName) {
    const content = await fs.readFile(filePath, 'utf-8');
    let updated = content.replace(new RegExp(oldId, 'g'), newId);
    updated = updated.replace(new RegExp(oldAppName + '/' + oldId, 'g'), newAppName + '/' + newId);
    
    if (content !== updated) {
      await fs.writeFile(filePath, updated);
      console.log(`Updated: ${filePath}`);
      updatedCount++;
    }
  }
  
  console.log(`\n✅ Update complete! Total files updated: ${updatedCount}`);
}

updateAppLinks().catch(console.error);