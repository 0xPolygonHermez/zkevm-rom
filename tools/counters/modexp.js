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
     * @sets ctx.modExpCounters.
     */
    eval_recordModExpCounters(ctx) {
        ctx.modExpCounters = {cntArith: ctx.cntArith, cntBinary: ctx.cntBinary, cntStep: BigInt(ctx.step)};
    }

    /**
     * Checks whether the expected modExp counters are not undercounting the real ones.
     * @param ctx - Context.
     */
    eval_checkModExpCounters(ctx) {
        const realCounters = {
            cntStep: BigInt(ctx.step) - ctx.modExpCounters.cntStep + 1n,
            cntBinary: ctx.cntBinary - ctx.modExpCounters.cntBinary,
            cntArith: ctx.cntArith - ctx.modExpCounters.cntArith,
        };

        for (const key in realCounters) {
            const expected = ctx.emodExpCounters[key];
            const real = realCounters[key];
            if (expected < real) {
                throw new Error(`Caution: Counter ${key} is undercounted. Expected ${expected}, got ${real}.`);
            }
        }
    }

    /**
     * Computes the expected modExp counters for the given inputs.
     * @param ctx - Context.
     * @param tag - Tag.
     * @sets ctx.ctx.emodExpCounters.
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
            B += fea2scalar(ctx.Fr, ctx.mem[addrB + i]) * (1n << (256n * BigInt(i)));
        }
        for (let i = 0; i < lenE; ++i) {
            E += fea2scalar(ctx.Fr, ctx.mem[addrE + i]) * (1n << (256n * BigInt(i)));
        }
        for (let i = 0; i < lenM; ++i) {
            M += fea2scalar(ctx.Fr, ctx.mem[addrM + i]) * (1n << (256n * BigInt(i)));
        }

        const [Q_B_M, R_B_M] = [B / M, B % M];
        const Bsq = B * B;
        const [Q_Bsq_M, R_Bsq_M] = [Bsq / M, Bsq % M];

        const lenQE2 = Math.floor(lenE / 2) || 1;

        let nTimesOdd = 0;
        while (E > 0n) {
            nTimesOdd += Number(E & 1n);
            E >>= 1n;
        }
        const nTimesEven = lenE * 256 - nTimesOdd;

        let counters = {cntStep: 0, cntBinary: 0, cntArith: 0};
        // I do an overstimation that the number is always odd!
        const a = setupAndFirstDivCounters();
        const b = fullLoopCounters(); // halfLoopCounters();
        const c = fullLoopCounters();

        for (const key in counters) {
            counters[key] = a[key] + nTimesEven * b[key] + nTimesOdd * c[key];
        }

        // console.log(JSON.stringify(counters, null, 2));

        ctx.emodExpCounters = counters;

        function computeLenThisBase(x) {
            if (x === 0n) return 1;

            let len = 0;
            while (x > 0n) {
                x >>= 256n;
                len++;
            }
            return len;
        }

        function setupAndFirstDivCounters() {
            // [steps: 76 + 10*len(B) + 3*len(M) + 8*len(Q(B,M)) + 12*len(R(B,M)) + 19*len(Q(B,M))*len(M),
            //    bin: 4 - len(M) + len(R(B,M)) + 2*len(Q(B,M))*len(M),
            //  arith: len(Q(B,M))*len(M)]
            return {
                cntStep:
                    76 +
                    10 * lenB +
                    3 * lenM +
                    8 * computeLenThisBase(Q_B_M) +
                    12 * computeLenThisBase(R_B_M) +
                    19 * computeLenThisBase(Q_B_M) * lenM,
                cntBinary:
                    4 -
                    lenM +
                    computeLenThisBase(R_B_M) +
                    2 * computeLenThisBase(Q_B_M) * lenM,
                cntArith:
                    computeLenThisBase(Q_B_M) * lenM,
            };
        }

        function fullLoopCounters() {
            // [steps: 273 +    len(B) + 6*len(E) + 26*len(M) + 54*len(B)² + 38*len(B)*len(M) + 22*len(Q(E,2)) + 19*len(Q(B²,M))*len(M) + 8*len(Q(B²,M)) + 12*len(R(B²,M)),
            //    bin: 17  - 11*len(B)            -  2*len(M) +  9*len(B)² +  4*len(B)*len(M) +  2*len(Q(E,2)) +  2*len(Q(B²,M))*len(M)                  +    len(R(B²,M)) ,
            //  arith: -1  +    len(B)                        +    len(B)² +  2*len(B)*len(M)                  +    len(Q(B²,M))*len(M)]
            return {
                cntStep:
                    273 +
                    lenB +
                    6 * lenE +
                    26 * lenM +
                    54 * lenB**2 +
                    38 * lenB * lenM +
                    22 * lenQE2 +
                    19 * computeLenThisBase(Q_Bsq_M) * lenM +
                    8 * computeLenThisBase(Q_Bsq_M) +
                    12 * computeLenThisBase(R_Bsq_M),
                cntBinary:
                    17 -
                    11 * lenB -
                    2 * lenM +
                    9 * lenB**2 +
                    4 * lenB * lenM +
                    2 * lenQE2 +
                    2 * computeLenThisBase(Q_Bsq_M) * lenM,
                cntArith:
                    -1 +
                    lenB +
                    lenB**2 +
                    2 * lenB * lenM +
                    computeLenThisBase(Q_Bsq_M) * lenM,
            };
        }
    }
}