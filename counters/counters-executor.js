/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-use-before-define */
/* eslint-disable no-restricted-syntax */
const path = require('path');
const fs = require('fs');
const smMain = require('@0xpolygonhermez/zkevm-proverjs/src/sm/sm_main/sm_main');

const fileCachePil = path.join(__dirname, '../node_modules/@0xpolygonhermez/zkevm-proverjs/cache-main-pil.json');
const emptyInput = require('@0xpolygonhermez/zkevm-proverjs/test/inputs/empty_input.json');
const buildPoseidon = require('@0xpolygonhermez/zkevm-commonjs').getPoseidon;

const pathMainPil = path.join(__dirname, '../node_modules/@0xpolygonhermez/zkevm-proverjs/pil/main.pil');
const { newCommitPolsArray } = require('pilcom');
const { compile } = require('pilcom');
const zkasm = require('@0xpolygonhermez/zkasmcom');

const testFilesDir = path.join(__dirname, './tests');
const { argv } = require('yargs');

async function main() {
    // Compile pil
    const cmPols = await compilePil();

    // Get all zkasm files
    const files = getTestFiles();

    // Run all zkasm files
    for (const file of files) {
        await runTest(file, cmPols);
    }
}

async function runTest(testName, cmPols) {
    const zkasmFile = `${testFilesDir}/${testName}`;
    // Compile rom
    const configZkasm = {
        defines: [],
        allowUndefinedLabels: true,
    };

    const rom = await zkasm.compile(zkasmFile, null, configZkasm);
    const config = {
        debug: true,
        stepsN: 8388608,
    };
    console.log(`Running ${testName}`);
    // Execute test
    const res = await smMain.execute(cmPols.Main, emptyInput, rom, config);
    console.log(res.counters);
}

// Get all zkasm counter test files
function getTestFiles() {
    if (argv.test) {
        return [`${argv.test}.zkasm`];
    }
    const files = fs.readdirSync(testFilesDir).filter((name) => name.endsWith('.zkasm'));

    return files;
}

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

main();
