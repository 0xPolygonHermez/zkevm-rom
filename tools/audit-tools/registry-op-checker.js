/* eslint-disable no-use-before-define */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
const rom = require('../../build/rom.json');
const prevRom = require('./rom.json');

/**
 * This script checks if there are new registry operations in the rom build. It compares it with the build stored at ./rom.json
 * The result is logged in the console.
 */
function main() {
    // Find free inputs at rom's build
    const regOpFound = getRegOpFromBuild(rom.program);
    const prevRegOpFound = getRegOpFromBuild(prevRom.program);
    const diffFound = [];
    // Compare found registers with previous rom
    for (const op of regOpFound) {
        const found = prevRegOpFound.find((item) => item.key === op.key);
        if (!found) {
            diffFound.push(op);
        }
    }
    // Log warnings, f.e. a free input with more than one occurrence
    for (const op of diffFound) {
        console.log(`WARNING: Found new registry operation at ${op.fileName}:${op.line}->${op.lineStr}`);
    }
    console.log('FINISHED');
}

function getRegOpFromBuild(build) {
    const regOpFound = [];
    // Check all steps
    for (const step of build) {
        let count = 0;
        // Get steps where we operate with registers
        for (const key of Object.keys(step)) {
            if (key === 'inA' || key === 'inB' || key === 'inC' || key === 'inD' || key === 'inE' || key === 'inF') {
                if (step.lineStr.includes('*')) {
                    count += 1;
                }
                if (Object.keys(step).includes('CONST')) {
                    count += 1;
                }
                count += 1;
            }
        }
        // Save steps with more than one register operation
        if (count > 1) {
            // Remove spaces from string
            step.key = `${step.lineStr.replace(/\s/g, '')}-${step.fileName}`;
            regOpFound.push(step);
        }
    }

    return regOpFound;
}
main();
