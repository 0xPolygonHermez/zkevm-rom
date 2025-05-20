// Download file from: https://github.com/ulerdogan/go-ethereum/blob/ulerdogan-secp256r1/core/vm/testdata/precompiles/p256Verify.json

const fs = require("fs").promises;
const path = require("path");

const N = 0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551n;

async function main(verbose = false, startFrom = 0) {
    try {
        const filePath = path.join(__dirname, "../tmp/p256Verify.json");

        const data = await fs.readFile(filePath, "utf8");

        const jsonData = JSON.parse(data);
        for (let i = startFrom; i < jsonData.length; i++) {
            const item = jsonData[i];
            const input = item.Input;
            const hash = BigInt("0x" + input.slice(0, 64));
            const r = BigInt("0x" + input.slice(64, 128));
            const s = BigInt("0x" + input.slice(128, 192));
            const x = BigInt("0x" + input.slice(192, 256));
            const y = BigInt("0x" + input.slice(256, 320));
            const output = BigInt(item.Expected);
            const name = item.Name;
            if (verbose) {
                console.log(`Name: ${name}`);
                console.log(
                    `Input:\n\thash = 0x${hash.toString(16)}\n\t   r = 0x${r.toString(
                        16
                    )}\n\t   s = 0x${s.toString(16)}\n\t   x = 0x${x.toString(
                        16
                    )}\n\t   y = 0x${y.toString(16)}`
                );
                console.log(`Output: ${output}\n`);
            }

            console.log(`\t; ${i+1}] ${name}`)
            console.log(`\t0x${hash.toString(16)}n => A ; hash`)
            console.log(`\t0x${r.toString(16)}n => B ; r`)
            console.log(`\t0x${s.toString(16)}n => C ; s`)
            console.log(`\t0x${x.toString(16)}n => D ; x`)
            console.log(`\t0x${y.toString(16)}n => E ; y`)
            console.log("\t:CALL(p256verify)");
            if (output == 1n) {
                console.log("\t1 :ASSERT");
                console.log("\tB => A");
                console.log("\t0 :ASSERT");
            } else {
                console.log("\t0 :ASSERT");
                console.log("\tB => A");
                if (r == 0n) {
                    console.log("\t1 :ASSERT");
                } else if (r >= N) {
                    console.log("\t2 :ASSERT");
                } else if (s == 0n) {
                    console.log("\t3 :ASSERT");
                } else if (s >= N) {
                    console.log("\t4 :ASSERT");
                }else {
                    console.log("\t0 :ASSERT");
                }
            }

            if (i < jsonData.length - 1) {
                console.log();
            }
        }
    } catch (err) {
        console.error("Error reading or parsing the file:", err);
    }
}

main(false);
