# ZK-COUNTERS TABLE

| opcode | name           | cnt_arith | cnt_binary | cnt_mem_align | cnt_keccak_f | cnt_padding_pg | cnt_poseidon_g | is_dynamic |
|--------|----------------|-----------|------------|---------------|--------------|----------------|----------------|------------|
| 0x00   | STOP           | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0x01   | ADD            | 0         | 1          | 0             | 0            | 0              | 0              | false       |
| 0x02   | MUL            | 1         | 0          | 0             | 0            | 0              | 0              | false      |
| 0x03   | SUB            | 0         | 1          | 0             | 0            | 0              | 0              | false       |
| 0x04   | DIV            | 1         | 2          | 0             | 0            | 0              | 0              | false      |
| 0x05   | SDIV           | 1         | 8          | 0             | 0            | 0              | 0              | false       |
| 0x06   | MOD            | 1         | 2          | 0             | 0            | 0              | 0              | false       |
| 0x07   | SMOD           | 1         | 8          | 0             | 0            | 0              | 0              | false       |
| 0x08   | ADDMOD         | 1         | 3          | 0             | 0            | 0              | 0              | false       |
| 0x09   | MULMOD         | 2         | 2          | 0             | 0            | 0              | 0              | false       |
| 0x0a   | EXP            | 512       | 1025       | 0             | 0            | 0              | 0              | [true](#EXP)       |
| 0x0b   | SIGNEXTEND     | 0         | 6          | 0             | 0            | 0              | 0              | false       |
| 0x10   | LT             | 0         | 1          | 0             | 0            | 0              | 0              | false      |
| 0x11   | GT             | 0         | 1          | 0             | 0            | 0              | 0              | false      |
| 0x12   | SLT            | 0         | 1          | 0             | 0            | 0              | 0              | false       |
| 0x13   | SGT            | 0         | 1          | 0             | 0            | 0              | 0              | false      |
| 0x14   | EQ             | 0         | 1          | 0             | 0            | 0              | 0              | false       |
| 0x15   | ISZERO         | 0         | 1          | 0             | 0            | 0              | 0              | false       |
| 0x16   | AND            | 0         | 1          | 0             | 0            | 0              | 0              | false      |
| 0x17   | OR             | 0         | 1          | 0             | 0            | 0              | 0              | false      |
| 0x18   | XOR            | 0         | 1          | 0             | 0            | 0              | 0              | false      |
| 0x19   | NOT            | 0         | 1          | 0             | 0            | 0              | 0              | false      |
| 0x1a   | BYTE           | 2         | 4          | 0             | 0            | 0              | 0              | false      |
| 0x1b   | SHL            | 1         | 2          | 0             | 0            | 0              | 0              | false       |
| 0x1c   | SHR            | 1         | 3          | 0             | 0            | 0              | 0              | false      |
| 0x1d   | SAR            | 2         | 10         | 0             | 0            | 0              | 0              | false       |
| 0x20   | SHA3           | 192       | 193        | 2             | 2            | 0              | 10             | [true](#SHA3)       |
| 0x30   | ADDRESS        | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0x31   | BALANCE        | 0         | 0          | 0             | 0            | 0              | 9              | false      |
| 0x32   | ORIGIN         | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0x33   | CALLER         | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0x34   | CALLVALUE      | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0x35   | CALLDATALOAD   | 64        | 66         | 0             | 0            | 0              | 0              | [true](#CALLDATALOAD)        |
| 0x36   | CALLDATASIZE   | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0x37   | CALLDATACOPY   | -         | -          | -             | 0            | 0              | 0              | [true](#CALLDATACOPY)        |
| 0x38   | CODESIZE       | 0         | 0          | 0             | 0            | 0              | 252            | [true](#CODESIZE)       |
| 0x39   | CODECOPY       | 0         | -          | -             | 0            | 0              | 255            | [true](#CODECOPY)        |
| 0x3a   | GASPRICE       | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0x3b   | EXTCODESIZE    | 0         | 0          | 0             | 0            | 0              | 255            | [true](#EXTCODESIZE)       |
| 0x3c   | EXTCODECOPY    | 0         | -          | -             | 0            | 11             | 510            | [true](#EXTCODECOPY)       |
| 0x3d   | RETURNDATASIZE | 0         | 1          | 0             | 0            | 0              | 0              | false      |
| 0x3e   | RETURNDATACOPY | -         | -          | 2             | 0            | 0              | 0              | [true](#RETURNDATACOPY)       |
| 0x3f   | EXTCODEHASH    | 0         | 0          | 0             | 0            | 0              | 255            | [true](#EXTCODEHASH)       |
| 0x40   | BLOCKHASH      | 0         | 0          | 0             | 1            | 0              | 9              | false       |
| 0x41   | COINBASE       | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0x42   | TIMESTAMP      | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0x43   | NUMBER         | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0x44   | DIFFICULTY     | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0x45   | GASLIMIT       | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0x46   | CHAINID        | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0x47   | SELFBALANCE    | 0         | 0          | 0             | 0            | 0              | 255            | [true](#SELFBALANCE)       |
| 0x50   | POP            | 0         | 0          | 0             | 0            | 0              | 0              | false       |
| 0x51   | MLOAD          | 32        | 32         | 1             | 0            | 0              | 255            | [true](#MLOAD)       |
| 0x52   | MSTORE         | 32        | 32         | 1             | 0            | 0              | 255            | [true](#MSTORE)       |
| 0x53   | MSTORE8        | 32        | 1          | 1             | 0            | 0              | 255            | false      |
| 0x54   | SLOAD          | 0         | 0          | 0             | 0            | 0              | 255            | [true](#SLOAD)       |
| 0x55   | SSTORE         | 0         | -          | 0             | 0            | 0              | 255            | [true](#SSTORE)       |
| 0x56   | JUMP           | 0         | -          | 0             | 0            | 0              | 0              | [true](#JUMP)       |
| 0x57   | JUMPI          | 0         | -          | 0             | 0            | 0              | 0              | [true](#JUMPI)       |
| 0x59   | MSIZE          | 1         | 3          | 0             | 0            | 0              | 0              | false      |
| 0x5a   | GAS            | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0x5b   | JUMPDEST       | 0         | 0          | 0             | 0            | 0              | 0              | false       |
| 0x60   | PUSH1          | 0         | 3          | 0             | 0            | 0              | 0              | true       |
| 0x61   | PUSH2          | 0         | 4          | 0             | 0            | 0              | 0              | true       |
| 0x62   | PUSH3          | 0         | 5          | 0             | 0            | 0              | 0              | false      |
| 0x63   | PUSH4          | 0         | 2          | 0             | 0            | 0              | 0              | false      |
| 0x64   | PUSH5          | 0         | 4          | 0             | 0            | 0              | 0              | false      |
| 0x65   | PUSH6          | 0         | 5          | 0             | 0            | 0              | 0              | false      |
| 0x66   | PUSH7          | 0         | 6          | 0             | 0            | 0              | 0              | false      |
| 0x67   | PUSH8          | 0         | 3          | 0             | 0            | 0              | 0              | false      |
| 0x68   | PUSH9          | 0         | 5          | 0             | 0            | 0              | 0              | false      |
| 0x69   | PUSH10         | 0         | 6          | 0             | 0            | 0              | 0              | false      |
| 0x6a   | PUSH11         | 0         | 7          | 0             | 0            | 0              | 0              | false      |
| 0x6b   | PUSH12         | 0         | 4          | 0             | 0            | 0              | 0              | false      |
| 0x6c   | PUSH13         | 0         | 6          | 0             | 0            | 0              | 0              | false      |
| 0x6d   | PUSH14         | 0         | 7          | 0             | 0            | 0              | 0              | false      |
| 0x6e   | PUSH15         | 0         | 8          | 0             | 0            | 0              | 0              | false      |
| 0x6f   | PUSH16         | 0         | 5          | 0             | 0            | 0              | 0              | false      |
| 0x70   | PUSH17         | 0         | 7          | 0             | 0            | 0              | 0              | false      |
| 0x71   | PUSH18         | 0         | 8          | 0             | 0            | 0              | 0              | false      |
| 0x72   | PUSH19         | 0         | 9          | 0             | 0            | 0              | 0              | false      |
| 0x73   | PUSH20         | 0         | 6          | 0             | 0            | 0              | 0              | false      |
| 0x74   | PUSH21         | 0         | 8          | 0             | 0            | 0              | 0              | false      |
| 0x75   | PUSH22         | 0         | 9          | 0             | 0            | 0              | 0              | false      |
| 0x76   | PUSH23         | 0         | 10         | 0             | 0            | 0              | 0              | false      |
| 0x77   | PUSH24         | 0         | 7          | 0             | 0            | 0              | 0              | false      |
| 0x78   | PUSH25         | 0         | 9          | 0             | 0            | 0              | 0              | false      |
| 0x79   | PUSH26         | 0         | 10         | 0             | 0            | 0              | 0              | false      |
| 0x7a   | PUSH27         | 0         | 11         | 0             | 0            | 0              | 0              | false      |
| 0x7b   | PUSH28         | 0         | 8          | 0             | 0            | 0              | 0              | false      |
| 0x7c   | PUSH29         | 0         | 10         | 0             | 0            | 0              | 0              | false      |
| 0x7d   | PUSH30         | 0         | 11         | 0             | 0            | 0              | 0              | false      |
| 0x7e   | PUSH31         | 0         | 12         | 0             | 0            | 0              | 0              | false      |
| 0x7f   | PUSH32         | 0         | 9          | 0             | 0            | 0              | 0              | false      |
| 0x80   | DUP1           | 0         | 0          | 0             | 0            | 0              | 0              | false       |
| 0x81   | DUP2           | 0         | 0          | 0             | 0            | 0              | 0              | false       |
| 0x82   | DUP3           | 0         | 0          | 0             | 0            | 0              | 0              | false       |
| 0x83   | DUP4           | 0         | 0          | 0             | 0            | 0              | 0              | false       |
| 0x84   | DUP5           | 0         | 0          | 0             | 0            | 0              | 0              | false       |
| 0x85   | DUP6           | 0         | 0          | 0             | 0            | 0              | 0              | false       |
| 0x86   | DUP7           | 0         | 0          | 0             | 0            | 0              | 0              | false       |
| 0x87   | DUP8           | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0x88   | DUP9           | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0x90   | SWAP1          | 0         | 0          | 0             | 0            | 0              | 0              | false       |
| 0x91   | SWAP2          | 0         | 0          | 0             | 0            | 0              | 0              | false       |
| 0x92   | SWAP3          | 0         | 0          | 0             | 0            | 0              | 0              | false       |
| 0x93   | SWAP4          | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0x94   | SWAP5          | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0x95   | SWAP6          | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0x96   | SWAP7          | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0xa0   | LOG0           | 0         | -          | 0             | 0            | 0              | 0              | [true](#LOG)       |
| 0xa1   | LOG1           | 0         | -          | 0             | 0            | 0              | 0              | [true](#LOG)       |
| 0xa2   | LOG2           | 0         | -          | 0             | 0            | 0              | 0              | [true](#LOG)       |
| 0xa3   | LOG3           | 0         | -          | 0             | 0            | 0              | 0              | [true](#LOG)       |
| 0xa4   | LOG4           | 0         | -          | 0             | 0            | 0              | 0              | [true](#LOG)       |
| 0xf0   | CREATE         | -         | -          | 0             | -            | 0              | -              | [true](#CREATE)       |
| 0xf1   | CALL           | -         | -          | 0             | 0            | -              | -              | [true](#CALL)       |
| 0xf2   | CALLCODE       | -         | -          | 0             | 0            | -              | -              | [true](#CALLCODE)       |
| 0xf3   | RETURN         | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| 0xf4   | DELEGATECALL   | -         | -          | 0             | 0            | -              | -              | [true](#DELEGATECALL)       |
| 0xf5   | CREATE2        | -         | -          | 0             | -            | 0              | -              | [true](#CREATE2)       |
| 0xfa   | STATICCALL     | -         | -          | 0             | 0            | -              | -              | [true](#STATICCALL)       |
| 0xfd   | REVERT         | 0         | 0          | 0             | 0            | 0              | 0              | false       |
| 0xfe   | INVALID        | 0         | 1          | 0             | 0            | 0              | 0              | false      |



## Dynamic zk-counters
In the following doc, we calculate the cost of processing the opcode. It's important to also add the cost of calculating the cost

### EXP
Inputs:
1- a: integer base.
2- exponent: integer exponent.
`dynamic_gas = 50 * exponent_byte_size`
We need to calculate the exponent byte size to get the gas cost. The counters cost is dynamic but we can't calculate the cost without consuming counters in a dynamic way. We need to find a way to get the size of the exponent in a constant manner or handle the counters limitations from the zkasm.
Maximum setted: Maxmimun byte syze = 256 bytes. Max counters = 256 * (2A + 4B) + 1B = 512A + 1025B

### SHA3
L = input length
L/32 = A
L % 32 > 0 ? true -> B = 1, false -> B = 0

cnt_arith = 2 + B*6
cnt_binary = 2 + A + B*9
cnt_keccak = 1

### CALLDATALOAD
L = byte offset in the calldata.
L/32 = A
L % 32 > 0 ? true -> B = 1, false -> B = 0

counters = divARITH + B*(SHLarith + SHRarith)

### CALLDATACOPY
L = Length to copy.
L/32 = A
L % 32 > 0 ? true -> B = 1, false -> B = 0

counters = A*(divARITH + SHLarith + SHRarith + MSTORE32) + SHLarith*2 + SHRarith + MSTOREX

### CODESIZE
counters = SLOAD

### CODECOPY
L = bytes to copy.
if is createContract -> counters = CALLDATACOPY
else -> counters = LT + L*(LT + MEM_ALIGN_WR8)

### EXTCODESIZE
counters = SLOAD

### EXTCODECOPY
L = bytes to copy.
if is createContract -> counters = CALLDATACOPY
else -> counters = LT + L*(LT + MEM_ALIGN_WR8)

### RETURNDATACOPY
L = Length to copy.
L/32 = A
L % 32 > 0 ? true -> B = 1, false -> B = 0
counters = 2*EQ + LT + divARITH + mulARITH + A*(MLOAD32 + MSTORE32) + B*(MLOADX + MSTOREX)

### EXTCODEHASH
counters = SLOAD

### SELFBALANCE
counters = SLOAD

### MLOAD
counters = MLOAD32

### MSTORE
counters = MSTORE32

### SLOAD
counters = SLOAD

### SSTORE
Cant calculate

### JUMPI
isCreateContract ? true -> A = 1, false -> A = 0
isCreate ? true -> B = 1, false -> B = 0

counters = EQ + A*(B*(MLOADX + SHRarith) + (1-B)*(EQ)) + (1-A)*(EQ)

### JUMP
isCreateContract ? true -> A = 1, false -> A = 0
isCreate ? true -> B = 1, false -> B = 0

counters = EQ + A*(B*(MLOADX + SHRarith) + (1-B)*(EQ)) + (1-A)*(EQ)

### LOG
L = byte size to copy.
L/32 = A
L % 32 > 0 ? true -> B = 1, false -> B = 0
counters = A*MLOAD32 + B*MLOADX

### CREATE
counters = computeGasSendCall + copySP + SLOAD + SSTORE + getLenBytes

### CALL
argsLengthCall + retLength == 0 ? true -> A = 1, false -> A = 0
argsOffsetCall > memLength ? true -> B = 1, false -> B = 0
counters = addARITH + EQ + (1-A)*(LT +B*saveMem ) + LT + isEmptyAccount + computeGasSendCall + copySP

### CALLCODE
counters = 2*EQ + LT*2 + computeGasSendCall + copySP

### DELEGATECALL
counters = 2*EQ + LT*2 + computeGasSendCall + copySP

### CREATE2
counters = computeGasSendCall + copySP + SLOAD + SSTORE + getLenBytes

### STATICCALL
counters = 2*EQ + LT*2 + computeGasSendCall + copySP

# REGS TABLE
| REG Name       | cnt_arith | cnt_binary | cnt_mem_align | cnt_keccak_f | cnt_padding_pg | cnt_poseidon_g | is_dynamic |
|----------------|-----------|------------|---------------|--------------|----------------|----------------|------------|
| LT             | 0         | 1          | 0             | 0            | 0              | 0              | false      |
| EQ             | 0         | 1          | 0             | 0            | 0              | 0              | false      |
| ARITH          | 1         | 0          | 0             | 0            | 0              | 0              | false      |
| SLOAD          | 0         | 0          | 0             | 0            | 0              | 11              | [true](#SLOAD)      |
| SSTORE         | 0         | 0          | 0             | 0            | 0              | 11              | [true](#SSTORE)      |
| MEM_ALIGN_WR8  | 0         | 0          | 1             | 0            | 0              | 0              | false      |


## Dynamic regs
### SSTORE
### SLOAD
Should check how SLOAD is implemented

# Functions TABLE
| FUNC Name      | cnt_arith | cnt_binary | cnt_mem_align | cnt_keccak_f | cnt_padding_pg | cnt_poseidon_g | is_dynamic |
|----------------|-----------|------------|---------------|--------------|----------------|----------------|------------|
| addARITH       | 0         | 1          | 0             | 0            | 0              | 0              | false      |
| divARITH       | 1         | 2          | 0             | 0            | 0              | 0              | false      |
| subARITH       | 0         | 1          | 0             | 0            | 0              | 0              | false      |
| mulARITH       | 1         | 0          | 0             | 0            | 0              | 0              | false      |
| saveMem        | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| computeGasSendCall| 0         | 1          | 0             | 0            | 0              | 0              | false      |
| copySP         | -         | -          | 0             | 0            | 0              | 0              | [true](#copySP)      |
| MLOAD32        | 0         | 0          | 0             | 0            | 0              | 0              | [true](#MLOAD32)      |
| MLOADX         | 0         | 0          | 0             | 0            | 0              | 0              | [true](#MLOADX)      |
| MSTORE32       | 0         | 0          | 0             | 0            | 0              | 0              | [true](#MSTORE32)      |
| MSTOREX        | 0         | 0          | 0             | 0            | 0              | 0              | [true](#MSTOREX)      |
| sliceA         | 0         | 0          | 0             | 0            | 0              | 0              | false      |
| SHRarith       | -         | -          | 0             | 0            | 0              | 0              | [true](#SHRarith)      |
| SHLarith       | -         | -          | 0             | 0            | 0              | 0              | [true](#SHLarith)      |
| opCODECOPYLoadBytes       | 0         | 1          | 0             | 0            | 0              | 0              | false     |
| isEmptyAccount | -         | -          | 0             | 0            | 0              | 0              | [true](#isEmptyAccount)      |


## Dynamic functions

### copySP
It depends on the stack size. 
L = stack length
L/32 = A
L % 32 > 0 ? true -> B = 1, false -> B = 0
counters = MLOAD32 * (A + B)


### MLOAD32
### MSTORE32
### MSTOREX
### MLOADX
L = bytes length
L > 0 ? true -> A = 1, false -> A = 0
isMSTOREX ? true -> B = 1, false -> B = 0
counters = LT + B*(2*SHRarith + 2*SHLarith) + (1-B)*(C*(2*SHLarith + 4*SHRarith) + (1-C)*(2*SHRarith + 2*SHLarith) + MEM_ALIGN_WR)
MAX:
counters = 192A + 193B + 2MA
### SHRarith
### SHLarith
A -> bytes to shift
D -> times to shift (A << D)
E -> D > 256? true = 1, false = 0
counters= ARITH + EQ + (1-E) * (D*(LT + ARITH)) = 1A + 1B + (1-E)*(D*(1A + 1B)
MAX:
counters = 32A + 32B 
### isEmptyAccount
isNotPrecompiled ? true -> A = 1, false -> A = 0
zeroBalance ? true -> B = 1, false -> B = 0
zeroNonce ? true -> C = 1, false -> C = 0

counters = LT + A*(SLOAD + LT + B*(SLOAD + LT + C*(SLOAD + LT)))