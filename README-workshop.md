# Workshop ethCC-24
This repository contains all the code shown at the workshop ethcc-24

## Usage
- install dependencies:
````
npm i
````

## VerifyMerkleProof
### Paths
- tests:
  - `./test/verify-merkle-proof/verify-merkle-proof-old.zkasm`
  - `./test/verify-merkle-proof/verify-merkle-proof.zkasm`
- tool to run tests: `./tools/run-tests-zkasm.js`
- function tested in the main code:
  - `verifyMerkleProof` --> file: `./main/utils.zkasm`, line 1754
  - `verifyMerkleProof_old` --> file: `./main/utils.zkasm`, line 1663

### Run tests
- From the repository root:
- old version:
```
node tools/run-tests-zkasm.js ./test/verify-merkle-proof/verify-merkle-proof-old.zkasm --verbose -i ./test/verify-merkle-proof/input.json
```
- new version:
```
node tools/run-tests-zkasm.js ./test/verify-merkle-proof/verify-merkle-proof.zkasm --verbose -i ./test/verify-merkle-proof/input.json
```

### zk-counters
- old:
```
{
  cntArith: 0,
  cntBinary: 33,
  cntKeccakF: 33,
  cntSha256F: 0,
  cntMemAlign: 0,
  cntPoseidonG: 0,
  cntPaddingPG: 0,
  cntSteps: 611
}
```
- new:
```
{
  cntArith: 0,
  cntBinary: 1,
  cntKeccakF: 33,
  cntSha256F: 0,
  cntMemAlign: 0,
  cntPoseidonG: 0,
  cntPaddingPG: 0,
  cntSteps: 233
}
```
- optimization:
```
{
  cntBinary: 96%,
  cntSteps: 61%
}
```