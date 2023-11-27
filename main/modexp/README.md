## Notes

- We work with unbounded and unsigned integers represented in (little-endian) chunks of $256$ bits.
- The maximum input array lengths for the ModExp are justified [here](https://github.com/0xPolygonHermez/zkevm-rom-internal/issues/43), in particular:
$$\text{BLen} \leq  75.894, \quad \text{MLen} \leq  75.894, \quad \text{ELen} \leq  720M + 32.$$
    - This is important because it allows us to use the `JMPZ` instruction against the registers holding these values, instead of a binary `EQ` instruction, which is more costly. Here, remember that `JMPZ` only takes into account the first $32$ bits of the registers it is used for (i.e., you can safely use it as long as the register is between $0$ and $2^{32}$).