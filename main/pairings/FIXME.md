- [ ] Unify inverse Fp2 and Fp2 arithmetic in general
- [ ] Implement fast square and fast exponentiation in the 12-th cyclotomic subgroup as per https://eprint.iacr.org/2010/542.pdf
- [ ] Implement multiplication by line more efficiently.
- [ ] Sums are for free, I do not need to normalize.

- Why is `${const.BN254_P - C} => C` correct and `%BN254_P - C => C` is not?
- $\mathbb{F}_p$ arithmetic fails if the input is a negative big integer, should we fix this? It's working properly otherwise