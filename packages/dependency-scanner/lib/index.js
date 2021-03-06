#!/usr/bin/env node

const fs = require('fs');
const glob = require('glob');
const path = require('path');

const { config: lernaConfig, directory: packageRoot } = findLernaConfig();
const packagePaths = lernaConfig.packages.reduce((list, packagePath) => {
  return list.concat(glob.sync(packagePath, { cwd: packageRoot }));
}, []).filter(x => {
  return lernaConfig.ignore.indexOf(path.basename(x)) === -1;
});

const manifests = packagePaths.map(packagePath => {
  return require(path.resolve(packageRoot, packagePath, 'package.json'));
});

// console.log(`Scanning ${manifests.length} packages...`);

const depVersions = manifests.reduce((map, manifest) => {
  Object.keys(manifest.dependencies || {}).forEach(depName => {
    const depVersion = manifest.dependencies[depName];

    if (!map[depName]) {
      map[depName] = [];
    }

    map[depName].push({ version: depVersion, package: manifest.name });
  })

  return map;
}, {})

const faultyDeps = Object.keys(depVersions).filter(depName => {
  const versions = depVersions[depName];

  return Object.keys(versions.reduce((map, x) => {
    map[x.version] = true;
    return map;
  }, {})).length > 1;
});

if (faultyDeps.length) {
  console.warn('The following packages have different versions of the same dependency specified:')

  faultyDeps.forEach(depName => {
    console.log(`* ${depName}:`);

    depVersions[depName].forEach(entry => {
      console.log(`\t${entry.version} by ${entry.package}`)
    });
  });

  process.exit(1);
}
else if (process.argv[2] === '--verbose') {
  require('./reportDependencies')(depVersions)
}

function findLernaConfig(root = process.cwd()) {
  if (fs.existsSync(path.resolve(root, 'lerna.json'))) {
    return {
      directory: root,
      config: require(path.resolve(root, 'lerna.json')),
    };
  }
  else if (path.dirname(root) !== root) {
    return findLernaConfig(path.dirname(root));
  }
  else {
    return null;
  }
}