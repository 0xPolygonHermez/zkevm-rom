const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const filePath = path.join(__dirname, 'tmpTest.zkasm');

const fileBefore =
`; constants needed by executor C++
CONST %N = 2**19
CONST %MAX_CNT_STEPS_LIMIT = %N
CONST %MAX_CNT_ARITH_LIMIT = %N
CONST %MAX_CNT_BINARY_LIMIT = %N
CONST %MAX_CNT_MEM_ALIGN_LIMIT = %N
CONST %MAX_CNT_KECCAK_F_LIMIT = %N
CONST %MAX_CNT_PADDING_PG_LIMIT = %N
CONST %MAX_CNT_POSEIDON_G_LIMIT = %N

VAR GLOBAL lastHashKId
VAR GLOBAL lastHashPId

VAR GLOBAL initial_A
VAR GLOBAL initial_B
VAR GLOBAL initial_C
VAR GLOBAL initial_D
VAR GLOBAL initial_E
VAR GLOBAL initial_CTX
VAR GLOBAL initial_SP
VAR GLOBAL initial_PC
VAR GLOBAL initial_GAS
VAR GLOBAL initial_SR
VAR GLOBAL initial_RR
VAR GLOBAL initial_HASHPOS
VAR GLOBAL initial_RCX

start:

        STEP => A
        0 :ASSERT

        A           :MSTORE(initial_A)
        B           :MSTORE(initial_B)
        C           :MSTORE(initial_C)
        D           :MSTORE(initial_D)
        E           :MSTORE(initial_E)
        CTX         :MSTORE(initial_CTX)
        SP          :MSTORE(initial_SP)
        PC          :MSTORE(initial_PC)
        GAS         :MSTORE(initial_GAS)
        SR          :MSTORE(initial_SR)
        RR          :MSTORE(initial_RR)
        HASHPOS     :MSTORE(initial_HASHPOS)
        RCX         :MSTORE(initial_RCX)
        0 => A,B,C,D,E,CTX, SP, PC, GAS, SR, RR, HASHPOS, RCX

        -1          :MSTORE(lastHashKId)
        -1          :MSTORE(lastHashPId)
`;
const fileAfter = 
`
end:

        $ => A           :MLOAD(initial_A)
        $ => B           :MLOAD(initial_B)
        $ => C           :MLOAD(initial_C)
        $ => D           :MLOAD(initial_D)
        $ => E           :MLOAD(initial_E)
        $ => CTX         :MLOAD(initial_CTX)
        $ => SP          :MLOAD(initial_SP)
        $ => PC          :MLOAD(initial_PC)
        $ => GAS         :MLOAD(initial_GAS)
        $ => SR          :MLOAD(initial_SR)
        $ => RR          :MLOAD(initial_RR)
        $ => HASHPOS     :MLOAD(initial_HASHPOS)
        $ => RCX         :MLOAD(initial_RCX)

; label finalizeExecution needed by executor C++
finalizeExecution:
        \${beforeLast()}  : JMPN(finalizeExecution)

                         : JMP(start)
opINVALID:
; label checkAndSaveFrom needed by executor C++
checkAndSaveFrom:
                         :JMP(opINVALID)

INCLUDE "../main/modexp/array_lib/utils/array_trim.zkasm"
INCLUDE "../main/modexp/array_lib/utils/array_compare.zkasm"

INCLUDE "../main/modexp/array_lib/array_add_AGTB.zkasm"
INCLUDE "../main/modexp/array_lib/array_add_short.zkasm"
INCLUDE "../main/modexp/array_lib/array_mul.zkasm"
INCLUDE "../main/modexp/array_lib/array_mul_long.zkasm"
INCLUDE "../main/modexp/array_lib/array_mul_short.zkasm"
INCLUDE "../main/modexp/array_lib/array_div_mod.zkasm"
INCLUDE "../main/modexp/array_lib/array_div_mod_long.zkasm"
INCLUDE "../main/modexp/array_lib/array_div_mod_short.zkasm"
`;

const counters = [];

for (let i = 1; i <= 5; i++) {
    for (let j = 1; j <= i; j++) {
        for (let k = 1; k <= j; k++) {
            console.log(`Test (${i},${j},${k}):`);

            // Define the test
            let fileTest1 = `\t${i} => C\n\t${j} => D\n\t115792089237316195423570985008687907853269984665640564039457584007913129639933n              :MSTORE(array_mul_inA)\n\t115792089237316195423570985008687907853269984665640564039457584007913129639933n              :MSTORE(array_mul_inB)\n`

            for (let l = 1; l < j; l++) {
                fileTest1 += `\t${l} => E\n\t115792089237316195423570985008687907853269984665640564039457584007913129639933n              :MSTORE(array_mul_inA + E)\n`
                fileTest1 += `\t115792089237316195423570985008687907853269984665640564039457584007913129639933n              :MSTORE(array_mul_inB + E)\n`
            }

            for (let l = j; l < i; l++) {
                fileTest1 += `\t${l} => E\n\t115792089237316195423570985008687907853269984665640564039457584007913129639933n              :MSTORE(array_mul_inA + E)\n`
            }

            const fileTest2 = `\t\t:CALL(array_mul)\n\t${i+j} => C\n\t${k} => D\n\t`

            let fileTest3 =`$ => A          :MLOAD(array_mul_out)\n\tA               :MSTORE(array_div_mod_inA)\n\t115792089237316195423570985008687907853269984665640564039457584007913129639935n                 :MSTORE(array_div_mod_inB)\n\t`

            for (let l = 1; l < k; l++) {
                fileTest3 += `${l} => E\n\t$ => A          :MLOAD(array_mul_out + E)\n\tA               :MSTORE(array_div_mod_inA + E)\n\t115792089237316195423570985008687907853269984665640564039457584007913129639935n                 :MSTORE(array_div_mod_inB + E)\n\t`
            }

            for (let l = k; l < i + j; l++) {
                fileTest3 += `${l} => E\n\t$ => A          :MLOAD(array_mul_out + E)\n\tA               :MSTORE(array_div_mod_inA + E)\n\t`
            }

            fileTest3 += `:CALL(array_div_mod)\n`;

            const fileTest = fileTest1 + fileTest2 + fileTest3;

            // Create the file
            fs.writeFileSync(filePath, fileBefore + fileTest + fileAfter);

            const output = execSync(
                `node node_modules/@0xpolygonhermez/zkevm-proverjs/test/zkasmtest.js ${filePath} -H ./main/modexp/helper.js -N "2**24" -d`
            ).toString();

            // Capture the counters
            const pattern = /cntArith: (\d+)n,\n  cntBinary: (\d+)n,\n  cntKeccakF: (\d+)n,\n  cntMemAlign: (\d+)n,\n  cntPoseidonG: (\d+)n,\n  cntPaddingPG: (\d+)n,\n  cntSteps: (\d+)/;
            const matches = output.match(pattern);

            if (matches) {
                const [,cntArith, cntBinary, , , , , cntSteps] = matches.map(Number);
                const testCounters = {
                    lenR: i,
                    lenB: j,
                    lenM: k,
                    cntArith,
                    cntBinary,
                    cntSteps,
                };
                console.log(testCounters);
                counters.push(testCounters);
            } else {
                console.log('Something wrong happened with the output');
            }

            // Delete the file
            fs.unlinkSync(filePath);
        }
    }
}

// Write the counters to a JSON file
fs.writeFileSync(path.join(__dirname, 'modexp-counters.json'), JSON.stringify(counters));
