/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { version } = require('../package.json');

// eslint-disable-next-line import/order
const { argv } = require('yargs')
    .version(version)
    .usage('node build-rom.js --output <rom.json> --steps <steps>')
    .alias('i', 'input')
    .alias('o', 'output')
    .alias('s', 'steps');

async function main() {
    // setup input file
    const defaultInputPath = 'main/main.zkasm';
    const pathInput = (typeof argv.input !== 'undefined') ? argv.input : defaultInputPath;

    // setup output file
    const defaultPath = 'build/rom.json';
    const pathBuildRom = (typeof argv.output !== 'undefined') ? argv.output : defaultPath;

    // setup Steps
    const defaultSteps = 'no-change';
    const steps = (typeof argv.steps !== 'undefined') ? Number(argv.steps) : defaultSteps;

    if (steps !== defaultSteps) {
        // replace steps in constants.zkasm
        const pathRomConstFile = path.join(__dirname, '../main/constants.zkasm');
        const oldContentConstFile = fs.readFileSync(pathRomConstFile, 'utf8');
        // line 'CONST %MAX_CNT_STEPS'
        const oldContentSteps = oldContentConstFile.split('\n').filter((elem) => elem.includes('CONST %MAX_CNT_STEPS'))[0];
        // extract steps number
        const oldSplitLines = oldContentSteps.split('**');

        console.log(`Compiling rom with N = ${steps}`);
        const newSplitLines = oldSplitLines;
        newSplitLines[1] = steps.toString();
        const newContentSteps = newSplitLines.join('**');
        const newContentConstFile = oldContentConstFile.replace(oldContentSteps, newContentSteps);

        fs.writeFileSync(pathRomConstFile, newContentConstFile, 'utf-8');

        const cmd = `mkdir -p build && npx zkasm ${pathInput} -o ${pathBuildRom}`;
        execSync(cmd);

        fs.writeFileSync(pathRomConstFile, oldContentConstFile, 'utf-8');
    } else {
        const cmd = `mkdir -p build && npx zkasm ${pathInput} -o ${pathBuildRom}`;
        console.log(cmd);
        execSync(cmd);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
