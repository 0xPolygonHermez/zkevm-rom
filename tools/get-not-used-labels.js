const fs = require('fs');
const rom = require('../build/rom.json');

async function main() {
    const labelsAddr = Object.values(rom.labels);
    const { program } = rom;
    for (let i = 0; i < program.length; i++) {
        const { jmpAddr, elseAddr } = program[i];
        if (jmpAddr) {
            const indexJmp = labelsAddr.indexOf(jmpAddr);
            if (indexJmp !== -1) {
                labelsAddr.splice(indexJmp, 1);
            }
        }
        if (elseAddr) {
            const indexElse = labelsAddr.indexOf(elseAddr);
            if (indexElse !== -1) {
                labelsAddr.splice(indexElse, 1);
            }
        }
    }
    const filteredLabels = [];
    for (let j = 0; j < labelsAddr.length; j++) {
        filteredLabels.push(Object.keys(rom.labels).find((key) => rom.labels[key] === labelsAddr[j]));
    }
    console.log(filteredLabels);
    await fs.writeFileSync('no-used-labels.json', JSON.stringify(filteredLabels, null, 2));
    // await fs.writeFileSync('no-used-labelsAddr-Addr.json', JSON.stringify(labelsAddr, null, 2));
}

main();
