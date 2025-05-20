const { fea2scalar } = require("@0xpolygonhermez/zkevm-commonjs").smtUtils;

module.exports = class myHelper {
    setup(props) {
        for (const name in props) {
            this[name] = props[name];
        }
    }
    ///////////// MODEXP

    /**
     * Saves the initial counters for the modexp instance.
     * @param ctx - Context.
     * @sets ctx.currentCounters.
     */
    eval_recordInitialCounters(ctx) {
        ctx.initialCounters = {
            cntArith: ctx.cntArith,
            cntBinary: ctx.cntBinary,
            cntStep: BigInt(ctx.step),
        };
    }

    /**
     * Checks whether the expected modExp counters are not undercounting the real ones.
     * @param ctx - Context.
     */
    eval_checkCounters(ctx) {
        const realCounters = {
            cntStep: BigInt(ctx.step) - ctx.initialCounters.cntStep + 1n,
            cntBinary: ctx.cntBinary - ctx.initialCounters.cntBinary,
            cntArith: ctx.cntArith - ctx.initialCounters.cntArith,
        };

        for (const key in realCounters) {
            const expected = ctx.expectedCounters[key];
            const real = realCounters[key];
            if (expected < real) {
                throw new Error(
                    `Caution: Counter ${key} is undercounted. Expected ${expected}, got ${real}.`
                );
            }
        }
    }

    eval_expectedAddAGTBCounters(ctx, tag) {
        const addrA = Number(this.evalCommand(ctx, tag.params[0]));
        const lenA = Number(this.evalCommand(ctx, tag.params[1]));
        const addrB = Number(this.evalCommand(ctx, tag.params[2]));
        const lenB = Number(this.evalCommand(ctx, tag.params[3]));

        let A = 0n;
        let B = 0n;
        for (let i = 0; i < lenA; ++i) {
            A +=
                fea2scalar(ctx.Fr, ctx.mem[addrA + i]) *
                (1n << (256n * BigInt(i)));
        }
        for (let i = 0; i < lenB; ++i) {
            B +=
                fea2scalar(ctx.Fr, ctx.mem[addrB + i]) *
                (1n << (256n * BigInt(i)));
        }

        let cntStep = 10 + 6 * lenA + 4 * lenB;
        let cntBinary = -1 + lenA + lenB;
        let cntArith = 0;
        let counters = { cntStep, cntBinary, cntArith };

        // console.log(`Expected AddAGTB Counters:\n${JSON.stringify(counters, null, 2)}`);

        ctx.expectedCounters = counters;
    }

    eval_expectedAddShortCounters(ctx, tag) {
        const addrA = Number(this.evalCommand(ctx, tag.params[0]));
        const lenA = Number(this.evalCommand(ctx, tag.params[1]));
        const addrB = Number(this.evalCommand(ctx, tag.params[2]));

        let A = 0n;
        let B = 0n;
        for (let i = 0; i < lenA; ++i) {
            A +=
                fea2scalar(ctx.Fr, ctx.mem[addrA + i]) *
                (1n << (256n * BigInt(i)));
        }
        for (let i = 0; i < 1; ++i) {
            B +=
                fea2scalar(ctx.Fr, ctx.mem[addrB + i]) *
                (1n << (256n * BigInt(i)));
        }

        let cntStep = 10 + 6 * lenA;
        let cntBinary = lenA;
        let cntArith = 0;
        let counters = { cntStep, cntBinary, cntArith };

        // console.log(`Expected AddShort Counters:\n${JSON.stringify(counters, null, 2)}`);

        ctx.expectedCounters = counters;
    }

    eval_expectedDivLongCounters(ctx, tag) {
        const addrA = Number(this.evalCommand(ctx, tag.params[0]));
        const lenA = Number(this.evalCommand(ctx, tag.params[1]));
        const addrB = Number(this.evalCommand(ctx, tag.params[2]));
        const lenB = Number(this.evalCommand(ctx, tag.params[3]));

        let A = 0n;
        let B = 0n;
        for (let i = 0; i < lenA; ++i) {
            A +=
                fea2scalar(ctx.Fr, ctx.mem[addrA + i]) *
                (1n << (256n * BigInt(i)));
        }
        for (let i = 0; i < lenB; ++i) {
            B +=
                fea2scalar(ctx.Fr, ctx.mem[addrB + i]) *
                (1n << (256n * BigInt(i)));
        }

        const [Q, R] = [A / B, A % B];
        const lenQ = this.computeLen(Q);
        const lenR = this.computeLen(R);

        let cntStep = 74 + 7 * lenA + 8 * lenQ + 9 * lenR + 19 * lenQ * lenB;
        let cntBinary = 6 - lenB + lenR + 2 * lenQ * lenB;
        let cntArith = lenQ * lenB;
        let counters = { cntStep, cntBinary, cntArith };

        // console.log(
        //     `Expected DivLong Counters:\n${JSON.stringify(counters, null, 2)}`
        // );

        ctx.expectedCounters = counters;
    }

    eval_expectedDivShortCounters(ctx, tag) {
        const addrA = Number(this.evalCommand(ctx, tag.params[0]));
        const lenA = Number(this.evalCommand(ctx, tag.params[1]));
        const addrB = Number(this.evalCommand(ctx, tag.params[2]));

        let A = 0n;
        let B = 0n;
        for (let i = 0; i < lenA; ++i) {
            A +=
                fea2scalar(ctx.Fr, ctx.mem[addrA + i]) *
                (1n << (256n * BigInt(i)));
        }
        for (let i = 0; i < 1; ++i) {
            B +=
                fea2scalar(ctx.Fr, ctx.mem[addrB + i]) *
                (1n << (256n * BigInt(i)));
        }

        const Q = A / B;
        const lenQ = this.computeLen(Q);

        let cntStep = 75 + 3 * lenA + 20 * lenQ;
        let cntBinary = 7 + lenQ;
        let cntArith = lenQ;
        let counters = { cntStep, cntBinary, cntArith };

        // console.log(
        //     `Expected DivShort Counters:\n${JSON.stringify(counters, null, 2)}`
        // );

        ctx.expectedCounters = counters;
    }

    eval_expectedDivTwoCounters(ctx, tag) {
        const addrA = Number(this.evalCommand(ctx, tag.params[0]));
        const lenA = Number(this.evalCommand(ctx, tag.params[1]));

        let A = 0n;
        for (let i = 0; i < lenA; ++i) {
            A +=
                fea2scalar(ctx.Fr, ctx.mem[addrA + i]) *
                (1n << (256n * BigInt(i)));
        }

        const Q = A / 2n;
        const lenQ = this.computeLen(Q);

        let cntStep = 65 + 3 * lenA + 22 * lenQ;
        let cntBinary = 5 + 3 * lenQ;
        let cntArith = 0;
        let counters = { cntStep, cntBinary, cntArith };

        // console.log(
        //     `Expected DivTwo Counters:\n${JSON.stringify(counters, null, 2)}`
        // );

        ctx.expectedCounters = counters;
    }

    eval_expectedMulLongCounters(ctx, tag) {
        const addrA = Number(this.evalCommand(ctx, tag.params[0]));
        const lenA = Number(this.evalCommand(ctx, tag.params[1]));
        const addrB = Number(this.evalCommand(ctx, tag.params[2]));
        const lenB = Number(this.evalCommand(ctx, tag.params[3]));

        let A = 0n;
        let B = 0n;
        for (let i = 0; i < lenA; ++i) {
            A +=
                fea2scalar(ctx.Fr, ctx.mem[addrA + i]) *
                (1n << (256n * BigInt(i)));
        }
        for (let i = 0; i < lenB; ++i) {
            B +=
                fea2scalar(ctx.Fr, ctx.mem[addrB + i]) *
                (1n << (256n * BigInt(i)));
        }

        let cntStep = 23 - 5 * lenA - 12 * lenB + 19 * lenA * lenB;
        let cntBinary = 2 - lenA - 2 * lenB + 2 * lenA * lenB;
        let cntArith = lenA * lenB;
        let counters = { cntStep, cntBinary, cntArith };

        // console.log(`Expected MulLong Counters:\n${JSON.stringify(counters, null, 2)}`);

        ctx.expectedCounters = counters;
    }

    eval_expectedMulShortCounters(ctx, tag) {
        const addrA = Number(this.evalCommand(ctx, tag.params[0]));
        const lenA = Number(this.evalCommand(ctx, tag.params[1]));
        const addrB = Number(this.evalCommand(ctx, tag.params[2]));

        let A = 0n;
        let B = 0n;
        for (let i = 0; i < lenA; ++i) {
            A +=
                fea2scalar(ctx.Fr, ctx.mem[addrA + i]) *
                (1n << (256n * BigInt(i)));
        }
        for (let i = 0; i < 1; ++i) {
            B +=
                fea2scalar(ctx.Fr, ctx.mem[addrB + i]) *
                (1n << (256n * BigInt(i)));
        }

        let cntStep = 13 + 7 * lenA;
        let cntBinary = 1;
        let cntArith = lenA;
        let counters = { cntStep, cntBinary, cntArith };

        // console.log(`Expected MulShort Counters:\n${JSON.stringify(counters, null, 2)}`);

        ctx.expectedCounters = counters;
    }

    eval_expectedMulTwoCounters(ctx, tag) {
        const addrA = Number(this.evalCommand(ctx, tag.params[0]));
        const lenA = Number(this.evalCommand(ctx, tag.params[1]));

        let A = 0n;
        for (let i = 0; i < lenA; ++i) {
            A +=
                fea2scalar(ctx.Fr, ctx.mem[addrA + i]) *
                (1n << (256n * BigInt(i)));
        }

        let cntStep = 6 + 9 * lenA;
        let cntBinary = -1 + 2 * lenA;
        let cntArith = 0;
        let counters = { cntStep, cntBinary, cntArith };

        // console.log(`Expected MulTwo Counters:\n${JSON.stringify(counters, null, 2)}`);

        ctx.expectedCounters = counters;
    }

    eval_expectedSquareCounters(ctx, tag) {
        const addrB = Number(this.evalCommand(ctx, tag.params[0]));
        const lenB = Number(this.evalCommand(ctx, tag.params[1]));

        let B = 0n;
        for (let i = 0; i < lenB; ++i) {
            B +=
                fea2scalar(ctx.Fr, ctx.mem[addrB + i]) *
                (1n << (256n * BigInt(i)));
        }

        let cntStep = -15 + 48 * lenB + (80 * lenB * (lenB - 1)) / 2;
        let cntBinary = -5 + 6 * lenB + (23 * lenB * (lenB - 1)) / 2;
        let cntArith = -1 + 2 * lenB + (2 * lenB * (lenB - 1)) / 2;
        let counters = { cntStep, cntBinary, cntArith };

        // console.log(`Expected Square Counters:\n${JSON.stringify(counters, null, 2)}`);

        ctx.expectedCounters = counters;
    }

    /**
     * Computes the expected modExp counters for the given inputs.
     * @param ctx - Context.
     * @param tag - Tag.
     * @sets ctx.ctx.expectedCounters.
     */
    eval_expectedModExpCounters(ctx, tag) {
        const addrB = Number(this.evalCommand(ctx, tag.params[0]));
        const lenB = Number(this.evalCommand(ctx, tag.params[1]));
        const addrE = Number(this.evalCommand(ctx, tag.params[2]));
        const lenE = Number(this.evalCommand(ctx, tag.params[3]));
        const addrM = Number(this.evalCommand(ctx, tag.params[4]));
        const lenM = Number(this.evalCommand(ctx, tag.params[5]));

        let B = 0n;
        let E = 0n;
        let M = 0n;
        for (let i = 0; i < lenB; ++i) {
            B +=
                fea2scalar(ctx.Fr, ctx.mem[addrB + i]) *
                (1n << (256n * BigInt(i)));
        }
        for (let i = 0; i < lenE; ++i) {
            E +=
                fea2scalar(ctx.Fr, ctx.mem[addrE + i]) *
                (1n << (256n * BigInt(i)));
        }
        for (let i = 0; i < lenM; ++i) {
            M +=
                fea2scalar(ctx.Fr, ctx.mem[addrM + i]) *
                (1n << (256n * BigInt(i)));
        }

        const [Q_B_M, R_B_M] = [B / M, B % M];
        const Bsq = B ** 2n;
        const [Q_Bsq_M, R_Bsq_M] = [Bsq / M, Bsq % M];

        const lenQE2 = Math.floor(lenE / 2) || 1;

        let nTimesOdd = 0;
        while (E > 0n) {
            nTimesOdd += Number(E & 1n);
            E >>= 1n;
        }
        const nTimesEven = lenE * 256 - nTimesOdd;
        // console.log(`nTimesEven: ${nTimesEven}, nTimesOdd: ${nTimesOdd}`);

        let counters = { cntStep: 0, cntBinary: 0, cntArith: 0 };
        const setupAndFirstDivCounters = () => {
            // [steps: 84 + 10*len(B) + 3*len(M) + 8*len(Q(B,M)) + 12*len(R(B,M)) + 19*len(Q(B,M))*len(M),
            //    bin: 4 - len(M) + len(R(B,M)) + 2*len(Q(B,M))*len(M),
            //  arith: len(Q(B,M))*len(M)]
            return {
                cntStep:
                    84 +
                    10 * lenB +
                    3 * lenM +
                    8 * this.computeLen(Q_B_M) +
                    12 * this.computeLen(R_B_M) +
                    19 * this.computeLen(Q_B_M) * lenM,
                cntBinary:
                    4 -
                    lenM +
                    this.computeLen(R_B_M) +
                    2 * this.computeLen(Q_B_M) * lenM,
                cntArith: this.computeLen(Q_B_M) * lenM,
            };
        };

        const halfLoopCounters = () => {
            // [steps: 153 +  82*len(M) + 6*len(E) + 80*len(M)*(len(M)-1)/2 + 19*len(M)² + 25*len(Q(E,2)),
            //    bin: 9   +   6*len(M)            + 23*len(M)*(len(M)-1)/2 +  2*len(M)² +  3*len(Q(E,2)),
            //  arith: -1  +   2*len(M)            +  2*len(M)*(len(M)-1)/2 +    len(M)²]
            return {
                cntStep:
                    153 +
                    82 * lenM +
                    6 * lenE +
                    (80 * lenM * (lenM - 1)) / 2 +
                    19 * lenM ** 2 +
                    25 * lenQE2,
                cntBinary:
                    9 +
                    6 * lenM +
                    (23 * lenM * (lenM - 1)) / 2 +
                    2 * lenM ** 2 +
                    3 * lenQE2,
                cntArith:
                    -1 + 2 * lenM + (2 * lenM * (lenM - 1)) / 2 + lenM ** 2,
            };
        };

        const fullLoopCounters = () => {
            // [steps: 263 + 114*len(M) + 6*len(E) + 80*len(M)*(len(M)-1)/2 + 57*len(M)² + 25*len(Q(E,2)),
            //    bin: 17  +   3*len(M)            + 23*len(M)*(len(M)-1)/2 +  6*len(M)² +  3*len(Q(E,2)),
            //  arith: -1  +   2*len(M)            +  2*len(M)*(len(M)-1)/2 +  3*len(M)²]
            return {
                cntStep:
                    263 +
                    114 * lenM +
                    6 * lenE +
                    (80 * lenM * (lenM - 1)) / 2 +
                    57 * lenM ** 2 +
                    25 * lenQE2,
                cntBinary:
                    17 +
                    3 * lenM +
                    (23 * lenM * (lenM - 1)) / 2 +
                    6 * lenM ** 2 +
                    3 * lenQE2,
                cntArith:
                    -1 + 2 * lenM + (2 * lenM * (lenM - 1)) / 2 + 3 * lenM ** 2,
            };
        };

        const a = setupAndFirstDivCounters();
        const b = halfLoopCounters();
        const c = fullLoopCounters();

        for (const key in counters) {
            counters[key] = a[key] + nTimesEven * b[key] + nTimesOdd * c[key];
        }

        // console.log(
        //     `Expected ModExp Counters:\n${JSON.stringify(counters, null, 2)}`
        // );

        ctx.expectedCounters = counters;
    }

    computeLen(x) {
        if (x === 0n) return 1;

        let len = 0;
        while (x > 0n) {
            x >>= 256n;
            len++;
        }
        return len;
    }
};
