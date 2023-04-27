// const { F1Field } = require("ffjavascript");

// const FpBN254 = new F1Field(21888242871839275222246405745257275088696311157297823662689037894645226208583n);
// const FrBN254 = new F1Field(21888242871839275222246405745257275088548364400416034343698204186575808495617n);

module.exports = class myHelper {
    setup (props) {
        for(const name in props) {
            this[name] = props[name];
        }
    }
    eval_helloHector(ctx, tag) {
        console.log('hello, Hector !!');
        return 0n;
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

    // eval_xAddPointTwistBN254(ctx, tag) {
    //     return eval_AddPointTwistBN254(ctx, tag, false)[0];
    // }
    
    // eval_yAddPointTwistBN254(ctx, tag) {
    //     return eval_AddPointTwistBN254(ctx, tag, false)[1];
    // }
    
    // eval_xDblPointTwistBN254(ctx, tag) {
    //     return eval_AddPointTwistBN254(ctx, tag, true)[0];
    // }
    
    // eval_yDblPointTwistBN254(ctx, tag) {
    //     return eval_AddPointTwistBN254(ctx, tag, true)[1];
    // }
    
    // eval_AddPointTwistBN254(ctx, tag, dbl)
    // {
    //     const x11 = evalCommand(ctx, tag.params[0]);
    //     const x12 = evalCommand(ctx, tag.params[1]);
    //     const y11 = evalCommand(ctx, tag.params[2]);
    //     const y12 = evalCommand(ctx, tag.params[3]);
    //     const x21 = evalCommand(ctx, tag.params[dbl ? 0 : 4]);
    //     const x22 = evalCommand(ctx, tag.params[dbl ? 1 : 5]);
    //     const y21 = evalCommand(ctx, tag.params[dbl ? 2 : 6]);
    //     const y22 = evalCommand(ctx, tag.params[dbl ? 3 : 7]);
    
    //     let s;
    //     if (dbl) {
    //         // Division by zero must be managed by ROM before call ARITH
    //         const divisor = ctx.Fec.add(y1, y1)
    //         if (ctx.Fec.isZero(divisor)) {
    //             throw new Error(`Invalid AddPointTwistBN254 (divisionByZero) ${ctx.sourceRef}`);
    //         }
    //         s = ctx.Fec.div(ctx.Fec.mul(3n, ctx.Fec.mul(x1, x1)), divisor);
    //     }
    //     else {
    //         const deltaX = ctx.Fec.sub(x2, x1)
    //         if (ctx.Fec.isZero(deltaX)) {
    //             throw new Error(`Invalid AddPointTwistBN254 (divisionByZero) ${ctx.sourceRef}`);
    //         }
    //         s = ctx.Fec.div(ctx.Fec.sub(y2, y1), deltaX );
    //     }
    
    //     const x3 = ctx.Fec.sub(ctx.Fec.mul(s, s), ctx.Fec.add(x1, x2));
    //     const y3 = ctx.Fec.sub(ctx.Fec.mul(s, ctx.Fec.sub(x1,x3)), y1);
    
    //     return [x3, y3];
    // }
}