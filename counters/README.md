## Counters testing tool  

The purpose of this tool is to detect counters altertions in zkrom code.  
A unit test is created for each function and opcode of the zkEVM. The structure of the test is the following:  
`````
INCLUDE "../initIncludes.zkasm" // Include the files imported at the beginning of the test

start:
    1000000 => GAS

operation:
    2       :MSTORE(SP++)
    2       :MSTORE(SP++)
            :JMP(opADD)
// Assert counters. Check for each function, the exact number of each counter is matched
checkCounters:
%OPADD_STEP - STEP:JMPN(failedCounters)
%OPADD_CNT_BINARY - CNT_BINARY :JMPNZ(failedCounters)
%OPADD_CNT_ARITH - CNT_ARITH :JMPNZ(failedCounters)
%OPADD_CNT_KECCAK_F - CNT_KECCAK_F :JMPNZ(failedCounters)
%OPADD_CNT_MEM_ALIGN - CNT_MEM_ALIGN :JMPNZ(failedCounters)
%OPADD_CNT_PADDING_PG - CNT_PADDING_PG :JMPNZ(failedCounters)
%OPADD_CNT_POSEIDON_G - CNT_POSEIDON_G :JMPNZ(failedCounters)
// Finalize execution
0 => A,B,C,D,E,CTX, SP, PC, GAS, MAXMEM, SR, HASHPOS, RR ; Set all registers to 0
finalizeExecution:
                                                                        :JMP(finalWait)
readCode:
txType:
    :JMP(checkCounters)
failedCounters: // Force failed assert
2 => A
1       :ASSERT
INCLUDE "../endIncludes.zkasm" // Include the files imported at the end of the test
`````

Run all tests:
`````
node counters/counters-executor.js
`````  
Limitations:
- Not all the tests are implemented yet, just the most complex ones
- For some test (the simplest ones), the counters it should spend are stored in `countersConstants.zkasm` file. For tests with a lot of utils calls or a lot of complexity, the values of the counters are hardcoded in the test.
- The tests always try to cover as much coverage as posible and always with the worst case counters scenario but this approach gets a bit tricky for complex opcodes as they have different contexts and behaviours.
- The objective is to keep adding tests with already not implemented functions but also adding tests for already implemented opcodes but with different scenarios (Example: calldatacopy from a call or from a create2)