// const { F1Field } = require("ffjavascript");

// const FpBN254 = new F1Field(21888242871839275222246405745257275088696311157297823662689037894645226208583n);
// const FrBN254 = new F1Field(21888242871839275222246405745257275088548364400416034343698204186575808495617n);

module.exports = class myHelper {
    setup(props) {
        for(const name in props) {
            this[name] = props[name];
        }
    }
    eval_hello(ctx, tag) {
        const p1 = this.evalCommand(ctx, tag.params[0]);
        const p2 = this.evalCommand(ctx, tag.params[1]);
        // return p1 + 10n * p2;
        return [p1 + 10n*p2, 2n**32n, 0n, 0n, 0n, 0n, 0n, 0n];
    }

    eval_helloFe(ctx, tag) {
        const p1 = this.evalCommand(ctx, tag.params[0]);
        const p2 = this.evalCommand(ctx, tag.params[1]);
        return [a + 10n*b, 2n**32n, 0n, 0n, 0n, 0n, 0n, 0n];
    }
    eval_dumpFe(ctx, tag) {
        for (let index = 0; index < tag.params.length; ++index) {
            const param = tag.params[index];
            if (param.op !== 'getReg') {
                console.log(`Ignore invalid operation ${param.op} on param #${index}`);
                continue;
            }
            console.log(`${param.regName}: [${ctx[param.regName].join(',')}]`);
        }
        return 0n;
    }
    eval_dumpHexFe(ctx, tag) {
        for (let index = 0; index < tag.params.length; ++index) {
            const param = tag.params[index];
            if (param.op !== 'getReg') {
                console.log(`Ignore invalid operation ${param.op} on param #${index}`);
                continue;
            }
            console.log(`${param.regName}: [${ctx[param.regName].map(x => "0x"+x.toString(16).padStart(16, '0')).join(',')}]`);
        }
        return 0n;
    }

    // export function log2(x: bigint): number {
    //     if (x == 0n) return 0;
    
    //     let r = 1;
    //     while (x > 1n) {
    //         x = x >> 1n;
    //         r += 1;
    //     }
    //     return r;
    // }

    eval_log2(ctx, tag) {
        const ctxFullFe = { ...ctx, fullFe: true };
        let a = this.evalCommand(ctxFullFe, tag.params[0]);

        if (a === 0n) return 0;

        let r = 1;
        while (a > 1n) {
            a >>= 1n;
            r += 1;
        }

        return r;
    }

    eval_Fp2BN254eq(ctx, tag) {
        const ctxFullFe = { ...ctx, fullFe: true };
        let a = this.evalCommand(ctxFullFe, tag.params[0]);
        let b = this.evalCommand(ctxFullFe, tag.params[1]);
        a = ctx.FpBN254.normalize(a, ctx.FpBN254.p);
        b = ctx.FpBN254.normalize(b, ctx.FpBN254.p);

        return ctx.FpBN254.eq(a, b);
    }

    eval_Fp2BN254eq0(ctx, tag) {
        const ctxFullFe = { ...ctx, fullFe: true };
        let a = this.evalCommand(ctxFullFe, tag.params[0]);
        a = ctx.FpBN254.normalize(a,ctx.FpBN254.p);

        return ctx.FpBN254.isZero(a);
    }

    eval_Fp2BN254neq0(ctx, tag) {
        return !this.eval_Fp2BN254eq0(ctx, tag);
    }

    eval_fp2BN254sub(ctx, tag) {
        const ctxFullFe = { ...ctx, fullFe: true };
        const a = this.evalCommand(ctxFullFe, tag.params[0]);
        const b = this.evalCommand(ctxFullFe, tag.params[1]);

        return ctx.FpBN254.sub(a, b);
    }

    eval_fp2InvBN254_x(ctx, tag) {
        const ctxFullFe = { ...ctx, fullFe: true };
        const a = this.evalCommand(ctxFullFe, tag.params[0]);
        const b = this.evalCommand(ctxFullFe, tag.params[1]);
        const den = ctx.FpBN254.add(ctx.FpBN254.mul(a, a), ctx.FpBN254.mul(b, b));

        return ctx.FpBN254.div(a, den);
    }

    eval_fp2InvBN254_y(ctx, tag) {
        const ctxFullFe = { ...ctx, fullFe: true };
        const a = this.evalCommand(ctxFullFe, tag.params[0]);
        const b = this.evalCommand(ctxFullFe, tag.params[1]);
        const den = ctx.FpBN254.add(ctx.FpBN254.mul(a, a), ctx.FpBN254.mul(b, b));

        return ctx.FpBN254.div(ctx.FpBN254.neg(b), den);
    }

    eval_fp6MulBN254_x(ctx, tag) {
        const ctxFullFe = { ...ctx, fullFe: true };
        const a1 = this.evalCommand(ctxFullFe, tag.params[0]);
        const a2 = this.evalCommand(ctxFullFe, tag.params[1]);
        const a3 = this.evalCommand(ctxFullFe, tag.params[2]);
        const a4 = this.evalCommand(ctxFullFe, tag.params[3]);
        const a5 = this.evalCommand(ctxFullFe, tag.params[4]);
        const a6 = this.evalCommand(ctxFullFe, tag.params[5]);
        const b1 = this.evalCommand(ctxFullFe, tag.params[6]);
        const b2 = this.evalCommand(ctxFullFe, tag.params[7]);
        const b3 = this.evalCommand(ctxFullFe, tag.params[8]);
        const b4 = this.evalCommand(ctxFullFe, tag.params[9]);
        const b5 = this.evalCommand(ctxFullFe, tag.params[10]);
        const b6 = this.evalCommand(ctxFullFe, tag.params[11]);

        const den = ctx.FpBN254.add(ctx.FpBN254.mul(a, a), ctx.FpBN254.mul(b, b));

        return ctx.FpBN254.div(a, den);
    }
}
