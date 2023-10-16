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

        const res = await smMain.execute(cmPols.Main, input, rom, config);
        compareCounters(input.virtualCounters, res.counters);
    } catch (err) {
    // If fails for ooc, retry increasing stepsN up to three times
        if (err.toString().includes('OOC') && currentTries < stepRetries) {
            currentTries += 1;
            counters = true;
            await runTest(cmPols, steps * 2);

            return;
        }
        fs.writeFileSync(checkerDir, `Failed test ${inputPath} - ${err}}`);
        console.log(err);
        throw err;
    }

    function compareCounters(virtualCounters, result) {
        const countersDiff = {
            steps: {
                virtual: virtualCounters.steps,
                real: Number(result.cntSteps),
                diff: getPercentageDiff(virtualCounters.steps, Number(result.cntSteps)),
            },
            arith: {
                virtual: virtualCounters.arith,
                real: Number(result.cntArith),
                diff: getPercentageDiff(virtualCounters.arith, Number(result.cntArith)),
            },
            binary: {
                virtual: virtualCounters.binary,
                real: Number(result.cntBinary),
                diff: getPercentageDiff(virtualCounters.binary, Number(result.cntBinary)),
            },
            memAlign: {
                virtual: virtualCounters.memAlign,
                real: Number(result.cntMemAlign),
                diff: getPercentageDiff(virtualCounters.memAlign, Number(result.cntMemAlign)),
            },
            keccaks: {
                virtual: virtualCounters.keccaks,
                real: Number(result.cntKeccakF),
                diff: getPercentageDiff(virtualCounters.keccaks, Number(result.cntKeccakF)),
            },
            poseidon: {
                virtual: virtualCounters.poseidon,
                real: Number(result.cntPoseidonG),
                diff: getPercentageDiff(virtualCounters.poseidon, Number(result.cntPoseidonG)),
            },
            padding: {
                virtual: virtualCounters.padding,
                real: Number(result.cntPaddingPG),
                diff: getPercentageDiff(virtualCounters.padding, Number(result.cntPaddingPG)),
            },
        };
        fs.appendFileSync(path.join(__dirname, 'countersDiffs.csv'), `${nameFile},${countersDiff.steps.virtual},${countersDiff.steps.real},${countersDiff.steps.diff},${countersDiff.arith.virtual},${countersDiff.arith.real},${countersDiff.arith.diff},${countersDiff.binary.virtual},${countersDiff.binary.real},${countersDiff.binary.diff},${countersDiff.memAlign.virtual},${countersDiff.memAlign.real},${countersDiff.memAlign.diff},${countersDiff.keccaks.virtual},${countersDiff.keccaks.real},${countersDiff.keccaks.diff},${countersDiff.poseidon.virtual},${countersDiff.poseidon.real},${countersDiff.poseidon.diff},${countersDiff.padding.virtual},${countersDiff.padding.real},${countersDiff.padding.diff}\n`);
        // Check percentages are greater than 0
        Object.keys(countersDiff).forEach((key) => {
            if (Number(countersDiff[key].diff) < 0) {
                throw new Error(`Negative percentage diff: ${countersDiff[key].virtual}/${countersDiff[key].real}/${countersDiff[key].diff}% at ${key}}`);
            }
        });
    }

    function getPercentageDiff(a, b) {
        if (a === 0) {
            // a and b are 0
            if (b === 0) {
                return 0;
            }
            // a is 0 but b is not -> fail test

            return -100;
        }
        // a is not 0 but b is -> passed
        if (b === 0) {
            return 0;
        }

        return (((a - b) / b) * 100).toFixed(2);
    }
}
