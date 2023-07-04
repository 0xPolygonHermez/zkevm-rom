module.exports = class myHelper {
    setup(props) {
        for (const name in props) {
            this[name] = props[name];
        }
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

    eval_guessnextqi(ctx, tag) {
        const base = 1n << 256n;

        const x1 = this.evalCommand(ctx, tag.params[0]);
        const y1 = this.evalCommand(ctx, tag.params[1]);
        const x2 = this.evalCommand(ctx, tag.params[2]);
        const y2 = this.evalCommand(ctx, tag.params[3]);
        const highx = x1 * base + y1;
        const highy = x2 * base + y2;
        return highx / highy;
    }

    eval_fpBN254add(ctx, tag) {
        const ctxFullFe = { ...ctx, fullFe: true };
        const a = this.evalCommand(ctxFullFe, tag.params[0]);
        const b = this.evalCommand(ctxFullFe, tag.params[1]);

        return ctx.FpBN254.add(a, b);
    }

    eval_FpBN254eq0(ctx, tag) {
        const ctxFullFe = { ...ctx, fullFe: true };
        let a = this.evalCommand(ctxFullFe, tag.params[0]);
        a = ctx.FpBN254.normalize(a, ctx.FpBN254.p);

        return ctx.FpBN254.isZero(a);
    }

    eval_FpBN254eq1(ctx, tag) {
        const ctxFullFe = { ...ctx, fullFe: true };
        let a = this.evalCommand(ctxFullFe, tag.params[0]);
        a = ctx.FpBN254.normalize(a, ctx.FpBN254.p);

        return ctx.FpBN254.eq(a, 1n);
    }

    eval_FpBN254neq0(ctx, tag) {
        return !this.eval_FpBN254eq0(ctx, tag);
    }

    eval_FpBN254neq1(ctx, tag) {
        return !this.eval_FpBN254eq1(ctx, tag);
    }

    // eval_fp2BN254sub(ctx, tag) {
    //     const ctxFullFe = { ...ctx, fullFe: true };
    //     const a = this.evalCommand(ctxFullFe, tag.params[0]);
    //     const b = this.evalCommand(ctxFullFe, tag.params[1]);

    //     return ctx.FpBN254.sub(a, b);
    // }

    // eval_fp2SquareBN254_x(ctx, tag) {
    //     const ctxFullFe = { ...ctx, fullFe: true };
    //     const a = this.evalCommand(ctxFullFe, tag.params[0]);
    //     const b = this.evalCommand(ctxFullFe, tag.params[1]);
    //     const a1a2sub = ctx.FpBN254.sub(a, b);
    //     const a1a2sum = ctx.FpBN254.add(a, b);

    //     return ctx.FpBN254.mul(a1a2sub, a1a2sum);
    // }

    // eval_fp2SquareBN254_y(ctx, tag) {
    //     const ctxFullFe = { ...ctx, fullFe: true };
    //     const a = this.evalCommand(ctxFullFe, tag.params[0]);
    //     const b = this.evalCommand(ctxFullFe, tag.params[1]);
    //     const a1a2 = ctx.FpBN254.mul(a, b);
    //     const two = 2n;

    //     return ctx.FpBN254.mul(two, a1a2);
    // }

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

    // eval_fp6MulBN254_x(ctx, tag) {
    //     const ctxFullFe = { ...ctx, fullFe: true };
    //     const a1 = this.evalCommand(ctxFullFe, tag.params[0]);
    //     const a2 = this.evalCommand(ctxFullFe, tag.params[1]);
    //     const a3 = this.evalCommand(ctxFullFe, tag.params[2]);
    //     const a4 = this.evalCommand(ctxFullFe, tag.params[3]);
    //     const a5 = this.evalCommand(ctxFullFe, tag.params[4]);
    //     const a6 = this.evalCommand(ctxFullFe, tag.params[5]);
    //     const b1 = this.evalCommand(ctxFullFe, tag.params[6]);
    //     const b2 = this.evalCommand(ctxFullFe, tag.params[7]);
    //     const b3 = this.evalCommand(ctxFullFe, tag.params[8]);
    //     const b4 = this.evalCommand(ctxFullFe, tag.params[9]);
    //     const b5 = this.evalCommand(ctxFullFe, tag.params[10]);
    //     const b6 = this.evalCommand(ctxFullFe, tag.params[11]);

    //     const den = ctx.FpBN254.add(ctx.FpBN254.mul(a, a), ctx.FpBN254.mul(b, b));

    //     return ctx.FpBN254.div(a, den);
    // }
}
