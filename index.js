const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
const process = require('process');

function getParentDir(dir) {
    const parentDir = path.dirname(dir);
    if (parentDir && parentDir !== dir) {
        return findDirWithNodeModules(parentDir);
    }
    return undefined;
}

function findDirWithNodeModules(dir) {
    if (fs.existsSync(path.resolve(dir, 'node_modules'))) {
        return dir;
    } else {
        const parentDir = getParentDir(dir);
        return parentDir && findDirWithNodeModules(parentDir);
    }
}

function findBinary(binName, dir) {
    const dirWithNodeModules = findDirWithNodeModules(dir);

    // searching parent folders
    if (dirWithNodeModules) {
        const binDir = child_process.execSync('npm bin', { cwd: dirWithNodeModules })
            .toString().trim();
        const binPath = path.resolve(binDir, binName);
        if (fs.existsSync(binPath)) {
            return binPath;
        } else {
            const upperDir = getParentDir(dirWithNodeModules);
            if (upperDir) {
                return findBinary(binName, upperDir);
            }
        }
    }

    // fallback to global
    const globalBinDir = child_process.execSync('npm bin -g')
        .toString().trim();
    const globalBinPath = path.resolve(globalBinDir, binName);
    if (fs.existsSync(globalBinPath)) {
        return globalBinPath;
    }
    return undefined;
}

/**
 * @param {string} bin Name of the npm package binary
 * @param {string[]} args Arguments to excute the binary
 */
module.exports = function lnpx(bin, args = []) {
    const binPath = findBinary(bin, process.cwd());
    if (binPath) {
        console.log('Execute binary: ' + binPath);
        child_process.execSync(
            [binPath].concat(args).join(' '),
            { stdio: 'inherit' }
        );
    } else {
        console.log('Cannot find binary: ' + bin);
        process.exit(1);
    }
}
