- [ ] Unify inverse Fp2 and Fp2 arithmetic in general
- [ ] Call in the same line after MLOAD or MSTORE

- Why is `${const.BN254_P - C} => C` correct and `%BN254_P - C => C` is not?
- $\mathbb{F}_p$ arithmetic fails if the input is a negative big integer, should we fix this? It's working properly otherwise