import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener rutas de módulo para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el package.json raíz de forma síncrona
const rootPackagePath = path.join(__dirname, 'package.json');
const rootPackageJson = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
const rootDeps = {
    devDependencies: rootPackageJson.devDependencies || {},
    peerDependencies: rootPackageJson.peerDependencies || {}
};

const commonBackDir = path.join(__dirname, 'common', 'back');
const packagesDir = [commonBackDir];

packagesDir.forEach(pkgPath => {
    const packageJsonPath = path.join(pkgPath, 'package.json');
    const pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    pkgJson.devDependencies = {
        ...pkgJson.devDependencies,
        ...rootDeps.devDependencies,
    };

    pkgJson.peerDependencies = {
        ...pkgJson.peerDependencies,
        ...rootDeps.peerDependencies,
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(pkgJson, null, 2));
});