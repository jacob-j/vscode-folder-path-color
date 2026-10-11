const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const TOTAL_SLOTS = 256; 

const dynamicColors = [];
for (let i = 0; i < TOTAL_SLOTS; i++) {
  dynamicColors.push({
    id: `folderPathColor.dynamicSlot${i}`,
    description: `Dynamic color slot ${i}`,
    defaults: {
      dark: "#FFFFFF",
      light: "#000000"
    }
  });
}

packageJson.contributes = packageJson.contributes || {};
packageJson.contributes.colors = dynamicColors;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));