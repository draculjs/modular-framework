const fs = require('fs');
const path = require('path');

const rootDeps = require('./back-dependencies.json');
const commonBackDir = path.join(__dirname, 'packages','common','common-backend','package.json');

const packagesDir = [commonBackDir];
packagesDir.forEach(pkgPath => {
    const pkgJson = require(pkgPath);

    pkgJson.devDependencies = {
        ...pkgJson.devDependencies,
        ...rootDeps.devDependencies,
    };

    pkgJson.peerDependencies = {
        ...pkgJson.peerDependencies,
        ...rootDeps.peerDependencies,
    };

    fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2));
});
