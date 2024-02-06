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
        ctx.modExpCounters = {cntArith: ctx.cntArith, cntBinary: ctx.cntBinary, cntSteps: BigInt(ctx.step)};
    }

    /**
     * Checks whether the expected modExp counters are not undercounting the real ones.
     * @param ctx - Context.
     */
    eval_checkModExpCounters(ctx) {
        const realCounters = {
            cntArith: ctx.cntArith - ctx.modExpCounters.cntArith,
            cntBinary: ctx.cntBinary - ctx.modExpCounters.cntBinary,
            cntSteps: BigInt(ctx.step) - ctx.modExpCounters.cntSteps + 1n,
        };

        const diff = {
            cntArith: BigInt(ctx.emodExpCounters.ariths) - realCounters.cntArith,
            cntBinary: BigInt(ctx.emodExpCounters.binaries) - realCounters.cntBinary,
            cntSteps: BigInt(ctx.emodExpCounters.steps) - realCounters.cntSteps,
        };

        for (const key in diff) {
            if (diff[key] < 0n) {
                throw new Error(`Caution: Counter ${key} is undercounted ${-diff[key]}`);
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
        const NZ_Bsq = 2*lenB - computeLenThisBase(Bsq);
        const [Q_Bsq_M, R_Bsq_M] = [Bsq / M, Bsq % M];
        const BM = B * M;

        const E2 = Math.floor(lenE / 2) || 1;

        let nTimesOdd = 0;
        while (E > 0n) {
            nTimesOdd += Number(E & 1n);
            E >>= 1n;
        }
        const nTimesEven = lenE * 256 - nTimesOdd;

        let counters = {ariths: 0, binaries: 0, steps: 0};
        const a = setupAndFirstDivCounters();
        const b = halfLoopCounters();
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

        function first_diff_chunk(x, y) {
            const xLen = computeLenThisBase(x);
            const yLen = computeLenThisBase(y);

            if (xLen > yLen || xLen < yLen) {
                return xLen;
            }

            let i = xLen - 1;
            while (i >= 0 && ((x >> (256n * BigInt(i))) & 0xffffffffffffffffffffffffffffffffn) === ((y >> (256n * BigInt(i))) & 0xffffffffffffffffffffffffffffffffn)) {
                i--;
            }

            return i+1;
        }

        function setupAndFirstDivCounters() {
            return {
                steps:
                    218 +
                    39 * lenB +
                    45 * lenM +
                    computeLenThisBase(Q_B_M) * (30 + 33 * lenM) +
                    17 * computeLenThisBase(R_B_M) -
                    14 * first_diff_chunk(B, M) -
                    7 * first_diff_chunk(M, R_B_M),
                binaries:
                    12 +
                    6 * lenB +
                    3 * lenM +
                    computeLenThisBase(Q_B_M) * (1 + 4 * lenM) +
                    computeLenThisBase(R_B_M) -
                    4 * first_diff_chunk(B, M) -
                    2 * first_diff_chunk(M, R_B_M),
                ariths: 1 + computeLenThisBase(Q_B_M) * lenM,
            };
        }

        function halfLoopCounters() {
            return {
                steps:
                    399 +
                    100 * lenB +
                    61 * ((lenB * (lenB + 1)) / 2) +
                    48 * lenM +
                    19 * lenE +
                    44 * E2 +
                    computeLenThisBase(Q_Bsq_M) * (30 + 33 * lenM) +
                    14 * computeLenThisBase(R_Bsq_M) -
                    14 * first_diff_chunk(Bsq, M) -
                    7 * first_diff_chunk(M, R_Bsq_M) -
                    5 * NZ_Bsq,
                binaries:
                    23 +
                    14 * lenB +
                    9 * ((lenB * (lenB + 1)) / 2) +
                    3 * lenM +
                    2 * lenE +
                    3 * E2 +
                    computeLenThisBase(Q_Bsq_M) * (1 + 4 * lenM) +
                    computeLenThisBase(R_Bsq_M) -
                    4 * first_diff_chunk(Bsq, M) -
                    2 * first_diff_chunk(M, R_Bsq_M) -
                    NZ_Bsq,
                ariths:
                    2 +
                    lenB +
                    (lenB * (lenB + 1)) / 2 +
                    E2 +
                    computeLenThisBase(Q_Bsq_M) * lenM,
            };
        }

        function fullLoopCounters() {
            return {
                steps:
                    674 +
                    180 * lenB +
                    61 * ((lenB * (lenB + 1)) / 2) +
                    149 * lenM +
                    19 * lenE +
                    44 * E2 +
                    66 * lenB * lenM +
                    computeLenThisBase(Q_Bsq_M) * (30 + 33 * lenM) +
                    14 * computeLenThisBase(R_Bsq_M) -
                    14 * first_diff_chunk(BM, M) -
                    14 * first_diff_chunk(Bsq, M) -
                    7 * first_diff_chunk(M, [0n]) -
                    7 * first_diff_chunk(M, R_Bsq_M) -
                    5 * NZ_Bsq,
                binaries:
                    36 +
                    21 * lenB +
                    9 * ((lenB * (lenB + 1)) / 2) +
                    12 * lenM +
                    2 * lenE +
                    3 * E2 +
                    8 * lenB * lenM +
                    computeLenThisBase(Q_Bsq_M) * (1 + 4 * lenM) +
                    computeLenThisBase(R_Bsq_M) -
                    4 * first_diff_chunk(BM, M) -
                    4 * first_diff_chunk(Bsq, M) -
                    2 * first_diff_chunk(M, [0n]) -
                    2 * first_diff_chunk(M, R_Bsq_M) -
                    NZ_Bsq,
                ariths:
                    4 +
                    lenB +
                    (lenB * (lenB + 1)) / 2 +
                    E2 +
                    2 * lenB * lenM +
                    computeLenThisBase(Q_Bsq_M) * lenM,
            };
        }
    }
}