const { fea2scalar } = require("@0xpolygonhermez/zkevm-commonjs").smtUtils;

module.exports = class myHelper {
    base = 1n << 256n;

    setup(props) {
        for (const name in props) {
            this[name] = props[name];
        }
    }

    /**
     * 
     * @param a 
     * @param b 
     * @returns 1 if a > b, -1 if a < b, 0 if a == b.
     */
    compare(a, b) {
        const alen = a.length;
        const blen = b.length;
        if (alen !== blen) {
            return alen >= blen ? 1 : -1;
        }
        for (let i = alen - 1; i >= 0; i--) {
            if (a[i] !== b[i]) {
                return a[i] > b[i] ? 1 : -1;
            }
        }
        return 0;
    }

    // it sets a.length = 0 if a = [0n]
    trim(a) {
        let i = a.length;
        while (a[--i] === 0n);
        a.length = i + 1;
    }

    // Assumes a.length >= b.length
    _array_add(a, b) {
        const alen = a.length;
        const blen = b.length;
        let result = new Array(alen);
        let sum = 0n;
        let carry = 0n;
        for (let i = 0; i < blen; i++) {
            sum = a[i] + b[i] + carry;
            carry = sum >= this.base ? 1n : 0n;
            result[i] = sum - carry * this.base;
        }
        for (let i = blen; i < alen; i++) {
            sum = a[i] + carry;
            carry = sum == this.base ? 1n : 0n; // the past carry is at most 1n
            result[i] = sum - carry * this.base;
        }

        if (carry === 1n) {
            result.push(carry);
        }
        return result;
    }
    array_add(a, b) {
        if (a.length < b.length) {
            return _array_add(b, a);
        }
        return _array_add(a, b);
    }

    // Assumes a >= b
    _array_sub(a, b) {
        const alen = a.length;
        const blen = b.length;
        let result = new Array(alen);
        let diff = 0n;
        let carry = 0n;
        let i = 0;
        for (i = 0; i < blen; i++) {
            diff = a[i] - b[i] - carry;
            carry = diff < 0n ? 1n : 0n;
            result[i] = diff + carry * this.base;
        }
        for (i = blen; i < alen; i++) {
            diff = a[i] - carry;
            if (diff < 0n) {
                diff += this.base;
            } else {
                result[i++] = diff;
                break;
            }
            result[i] = diff;
        }
        for (; i < alen; i++) {
            result[i] = a[i];
        }
        this.trim(result);
        return result;
    }
    array_sub(a, b) {
        let result;
        if (this.compare(a, b) >= 0) {
            result = this._array_sub(a, b);
        } else {
            result = this._array_sub(b, a);
            result[result.length - 1] = -result[result.length - 1];
        }
        if (result.length === 0) {
            result.push(0n);
        }
        return result;
    }

    array_long_mul(a, b) {
        const alen = a.length;
        const blen = b.length;
        const len = alen + blen;
        const result = new Array(len).fill(0n);
        let product;
        let carry;
        let ai;
        let bj;
        for (let i = 0; i < alen; i++) {
            ai = a[i];
            for (let j = 0; j < blen; j++) {
                bj = b[j];
                product = ai * bj + result[i + j];
                carry = product / this.base;
                result[i + j] = product - carry * this.base;
                result[i + j + 1] += carry;
            }
        }
        this.trim(result);
        return result;
    }
    array_short_mul(a, b) {
        const alen = a.length;
        const len = alen;
        const result = new Array(len).fill(0n);
        let product;
        let carry = 0n;
        let i;
        for (i = 0; i < alen; i++) {
            product = a[i] * b + carry;
            carry = product / this.base;
            result[i] = product - carry * this.base;
        }
        while (carry > 0n) {
            result[i++] = carry % this.base;
            carry /= this.base;
        }
        this.trim(result);
        return result;
    }

    normalize(a, b) {
        let bm = b[b.length - 1];
        let shift = 1n; // shift cannot be larger than log2(base) - 1
        while (bm < this.base / 2n) {
            b = this.array_short_mul(b, 2n); // left-shift b by 2
            bm = b[b.length - 1];
            shift *= 2n;
        }

        a = this.array_short_mul(a, shift); // left-shift a by 2^shift
        return [a, b, shift];
    }

    _MPdiv(a, b) {
        let shift;
        [a, b, shift] = this.normalize(a, b);
        let a_l = a.length;
        const b_l = b.length;
        let quotient = [];
        let remainder = [];
        let an = [];
        while (this.compare(an, b) === -1) {
            an.unshift(a[--a_l]);
        }

        const bm = b[b_l - 1];
        let test;
        let aguess;
        let qn;
        let n;
        while (a_l >= 0) {
            n = an.length;
            if (an[n - 1] < bm) {
                aguess = [an[n - 2], an[n - 1]];
            } else {
                aguess = [an[n - 1]];
            }

            if (an[n - 1] < bm) {
                qn = this.array_short_div(aguess, bm)[0][0]; // this is always a single digit
            } else if (an[n - 1] === bm) {
                if (b_l < n) {
                    qn = this.base - 1n;
                } else {
                    qn = 1n;
                }
            } else {
                qn = 1n;
            }

            test = this.array_short_mul(b, qn);
            while (this.compare(test, an) === 1) {
                // maximum 2 iterations
                qn--;
                test = this.array_sub(test, b);
            }

            quotient.unshift(qn);
            remainder = this.array_sub(an, test);
            an = remainder;
            if (a_l === 0) break;
            an.unshift(a[--a_l]);
        }
        remainder = this.array_short_div(remainder, shift)[0];
        return [quotient, remainder];
    }

    array_short_div(a, b) {
        let a_l = a.length;
        let quotient = [];
        let remainder = 0n;

        let dividendi;
        let qi;
        for (let i = a_l - 1; i >= 0; i--) {
            dividendi = remainder * this.base + a[i];
            qi = dividendi / b;
            remainder = dividendi - qi * b;
            quotient[i] = qi;
        }
        return [quotient, remainder];
    }

    eval_MPdiv(ctx, tag) {
        const addr1 = Number(this.evalCommand(ctx, tag.params[0]));
        const len1 = Number(this.evalCommand(ctx, tag.params[1]));
        const addr2 = Number(this.evalCommand(ctx, tag.params[2]));
        const len2 = Number(this.evalCommand(ctx, tag.params[3]));

        let input1 = [];
        let input2 = [];
        for (let i = 0; i < len1; ++i) {
            input1.push(fea2scalar(ctx.Fr, ctx.mem[addr1 + i]));
        }
        for (let i = 0; i < len2; ++i) {
            input2.push(fea2scalar(ctx.Fr, ctx.mem[addr2 + i]));
        }

        const [quo, rem] = this._MPdiv(input1, input2);

        ctx.quotient = quo;
        ctx.remainder = rem;
        console.log("quo", quo);
        console.log("rem", rem);
    }

    eval_receiveQuotientChunk(ctx, tag) {
        const pos = Number(this.evalCommand(ctx, tag.params[0]));
        const quoi = ctx.quotient[pos];
        return quoi;
    }

    eval_receiveRemainderChunk(ctx, tag) {
        const pos = Number(this.evalCommand(ctx, tag.params[0]));
        const remi = ctx.remainder[pos];
        return remi;
    }
};
