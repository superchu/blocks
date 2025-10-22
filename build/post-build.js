const fs = require('fs');
const path = require('path');


const doIt = async () => {
  const licenseHeader = await fs.readFileSync(path.join(__dirname, 'LICENSE-HEADER'), { encoding: 'utf-8' });
  const file = await fs.readFileSync(path.join(__dirname, '../dist', 'blocks.js'), { encoding: 'utf-8' });

  fs.writeFileSync(path.join(__dirname, '../dist', 'blocks.js'), licenseHeader + '\n' + file, { encoding: 'utf-8' });
};

doIt();
