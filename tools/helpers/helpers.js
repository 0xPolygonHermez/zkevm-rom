/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const fs = require('fs');
const { compile, newCommitPolsArray } = require('pilcom');

const buildPoseidon = require('@0xpolygonhermez/zkevm-commonjs').getPoseidon;

// Global paths to build Main PIL to fill polynomials in tests
const pathMainPil = path.join(__dirname, '../../node_modules/@0xpolygonhermez/zkevm-proverjs/pil/main.pil');
const fileCachePil = path.join(__dirname, '../../node_modules/@0xpolygonhermez/zkevm-proverjs/cache-main-pil.json');

async function compilePil() {
    if (!fs.existsSync(fileCachePil)) {
        const poseidon = await buildPoseidon();
        const { F } = poseidon;
        const pilConfig = {
            defines: { N: 4096 },
            namespaces: ['Main', 'Global'],
            disableUnusedError: true,
        };
        const p = await compile(F, pathMainPil, null, pilConfig);
        fs.writeFileSync(fileCachePil, `${JSON.stringify(p, null, 1)}\n`, 'utf8');
    }

    const pil = JSON.parse(fs.readFileSync(fileCachePil));

    return newCommitPolsArray(pil);
}

// Get all zkasm test files
function getTestFiles(pathZkasm) {
    // check if path provided is a file or a directory
    const stats = fs.statSync(pathZkasm);

    if (!stats.isDirectory()) {
        return [pathZkasm];
    }

    const filesNames = fs.readdirSync(pathZkasm).filter((name) => name.endsWith('.zkasm'));

    return filesNames.map((fileName) => path.join(pathZkasm, fileName));
}

module.exports = {
    compilePil,
    getTestFiles,
};
