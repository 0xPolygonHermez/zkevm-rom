const path = require('path');
const fs = require('fs');
const smMain = require('@0xpolygonhermez/zkevm-proverjs/src/sm/sm_main/sm_main');
const fileCachePil = path.join(__dirname, '../node_modules/@0xpolygonhermez/zkevm-proverjs/cache-main-pil.json');
const no_empty_input = require('@0xpolygonhermez/zkevm-testvectors/inputs-executor/calldata/op-arith-final_0.json')
const empty_input = require('@0xpolygonhermez/zkevm-proverjs/test/inputs/empty_input.json')
const buildPoseidon = require('@0xpolygonhermez/zkevm-commonjs').getPoseidon;
const pathMainPil = path.join(__dirname, '../node_modules/@0xpolygonhermez/zkevm-proverjs/pil/main.pil');
const { newCommitPolsArray } = require('pilcom');
const { compile } = require('pilcom');
const zkasm = require("@0xpolygonhermez/zkasmcom");
const testFilesDir = __dirname;
const { argv } = require('yargs');

async function main() {

    // Compile pil
    const cmPols = await compilePil();

    // Get all zkasm files
    const files = getTestFiles();

    // Run all zkasm files
    for (let file of files) {
        await runTest(file, cmPols)
    }
}

async function runTest(testName, cmPols) {
    const zkasmFile = `${testFilesDir}/${testName}`;
    // Compile rom
    const configZkasm = {
        defines: [],
        allowUndefinedLabels: true,
        allowOverwriteLabels: true,
    };

    const rom = await zkasm.compile(zkasmFile, null, configZkasm);
    const config = {
        debug: true,
        stepsN: 8388608,
    }
    const input = zkasmFile.includes("rotate.zkasm") ? no_empty_input : empty_input;
    console.log(`Running ${testName}`)
    // Execute test
    try {
        await smMain.execute(cmPols.Main, input, rom, config);
    } catch(e) {
        if(zkasmFile.includes("rotate.zkasm") && e.toString().includes("Assert Error: newStateRoot does not match")) {
            console.log("Assert outputs run succesfully")
        } else {
            throw new Error(e);
        }
    }
}

// Get all zkasm counter test files
function getTestFiles() {
    if(argv.test){
        return [`${argv.test}.zkasm`];
    }
    const files = fs.readdirSync(testFilesDir).filter(name => name.endsWith('.zkasm'))
    return files;
}

async function compilePil() {
    if (!fs.existsSync(fileCachePil)) {
        const poseidon = await buildPoseidon();
        const { F } = poseidon;
        const pilConfig = {
            defines: { N: 4096 },
            namespaces: ['Main', 'Global'],
            disableUnusedError: true
        };
        const p = await compile(F, pathMainPil, null, pilConfig);
        fs.writeFileSync(fileCachePil, `${JSON.stringify(p, null, 1)}\n`, 'utf8');
    }

    const pil = JSON.parse(fs.readFileSync(fileCachePil));
    return newCommitPolsArray(pil);
}

main()