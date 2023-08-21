/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

const { newCommitPolsArray } = require('pilcom');
const smMain = require('@0xpolygonhermez/zkevm-proverjs/src/sm/sm_main/sm_main');

let rom = require('../../build/rom.json');

let stepsN = 2 ** 23;
let counters = false;

const fileCachePil = path.join(__dirname, '../../node_modules/@0xpolygonhermez/zkevm-proverjs/cache-main-pil.json');

const checkerDir = path.join(__dirname, 'checker.txt');

const inputPath = '%%INPUT_PATH%%';
const nameFile = path.basename(inputPath);
const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const stepRetries = 3;
let currentTries = 0;

it(`${nameFile}`, async () => {
    if (fs.existsSync(checkerDir)) {
        process.exit(1);
    }
    const pil = JSON.parse(fs.readFileSync(fileCachePil));
    const cmPols = newCommitPolsArray(pil);
    if (input.gasLimit) {
        rom = require(`../../build/rom-${input.gasLimit}.test.json`);
    }
    if (input.stepsN) {
        stepsN = input.stepsN;
        counters = true;
    }
    await runTest(cmPols, stepsN);

    expect(true).to.be.equal(true);
});

async function runTest(cmPols, steps) {
    try {
        const config = {
            debug: true,
            debugInfo: {
                inputName: path.basename(inputPath),
            },
            stepsN: steps,
            counters,
            assertOutputs: true,
        };

        await smMain.execute(cmPols.Main, input, rom, config);
    } catch (err) {
    // If fails for ooc, retry increasing stepsN up to three times
        if (err.toString().includes('OOC') && currentTries < stepRetries) {
            currentTries += 1;
            counters = true;
            await runTest(cmPols, steps * 2);

            return;
        }
        fs.writeFileSync(checkerDir, `Failed test ${inputPath} - ${err}}`);
        throw err;
    }
}
