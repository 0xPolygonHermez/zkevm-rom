/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-syntax */
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

const { compile } = require('pilcom');
const buildPoseidon = require('@0xpolygonhermez/zkevm-commonjs').getPoseidon;

const folderPaths = [
    '../../node_modules/@0xpolygonhermez/zkevm-testvectors/inputs-executor',
    '../../node_modules/@0xpolygonhermez/zkevm-testvectors/inputs-executor/ethereum-tests/GeneralStateTests',
];

const fileCachePil = path.join(__dirname, '../../node_modules/@0xpolygonhermez/zkevm-proverjs/cache-main-pil.json');
const pathMainPil = path.join(__dirname, '../../node_modules/@0xpolygonhermez/zkevm-proverjs/pil/main.pil');
const inputs = [];
const testsFolder = path.join(__dirname, 'parallel-tests');
const sampleDir = path.join(__dirname, 'parallel-tests-sample/sample.test.js');
const { argv } = require('yargs');

async function genTestsFiles() {
    if (!fs.existsSync(testsFolder)) {
        fs.mkdirSync(testsFolder);
    }
    for (const inputPath of inputs) {
        const name = inputPath.split('/').slice(-1)[0].replace('json', 'test.js');
        const sample = fs.readFileSync(sampleDir, 'utf-8');
        let test = sample.replace('%%INPUT_PATH%%', `${inputPath}`);
        // Replace skip vcounters flag
        if (argv.skipVCounters) {
            test = test.replace('%%SKIP_VCOUNTERS%%', 'yes');
        }
        fs.writeFileSync(`${testsFolder}/${name}`, test);
    }
    expect(true).to.be.equal(true);
}

async function main() {
    const poseidon = await buildPoseidon();
    const { F } = poseidon;

    // Add all test files to `inputs` array
    for (const folder of folderPaths) {
        const inputsPath = path.join(__dirname, folder);
        fs.readdirSync(inputsPath).forEach((file) => {
            const filePath = path.join(inputsPath, file);
            // Remove json lists that are generated with gen inputs script and are not inputs
            if (file.endsWith('.json') && !file.includes('testsOOC-list.json') && !file.includes('tests30M-list.json') && !file.includes('no-exec')) {
                inputs.push(filePath);
            } else if (fs.statSync(filePath).isDirectory() && !filePath.includes('tests-OOC')) {
                fs.readdirSync(filePath).forEach((subFile) => {
                    const subFilePath = path.join(filePath, subFile);
                    if (subFile.endsWith('.json') && !subFile.includes('testsOOC-list.json') && !subFile.includes('tests30M-list.json') && !subFile.includes('no-exec')) {
                        inputs.push(subFilePath);
                    }
                });
            }
        });
    }

    console.log(`Inputs executor generated: ${inputs.length}`);

    const pilConfig = {
        defines: { N: 4096 },
        namespaces: ['Main', 'Global'],
        disableUnusedError: true,
    };

    const pil = await compile(F, pathMainPil, null, pilConfig);
    fs.writeFileSync(fileCachePil, `${JSON.stringify(pil, null, 1)}\n`, 'utf8');
    genTestsFiles();
    // Generate counters diff table csv file
    fs.writeFileSync(path.join(__dirname, 'countersDiffs.csv'), 'Test name,vSteps,rSteps,StepsDiff,vArith,rArith,ArithDiff,vBinary,rBinary,BinaryDiff,vMemAlign,rMemAlign,memAlignDiff,vKeccaks,rKeccaks,keccaksDiff,vPoseidon,rPoseidon,PoseidonDiff,vPadding,rPadding,PaddingDiff,vSHA256,rSHA256,SHA256Diff\n', 'utf8');
}

main();
