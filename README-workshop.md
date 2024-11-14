# Workshop devcon-24
This repository contains all the code shown at the workshop devcon-24

## Usage
- install dependencies:
````
npm i
````

## opPUSH
### Paths
- tests:
  - `./test/read-push.zkasm`
  - `./test/read-push-OLD.zkasm`
- tool to run tests: `./tools/run-tests-zkasm.js`
- function tested in the main code:
  - `readPush` --> file: `./main/utils.zkasm`, line 1004
  - `readPushOLD` --> file: `./main/utils.zkasm`, line 2389

### Run tests
- From the repository root:
- old version:
```
node tools/run-tests-zkasm.js ./test/read-push.zkasm --verbose
```
- new version:
```
node tools/run-tests-zkasm.js ./test/read-push-OLD.zkasm --verbose
```

### zk-counters
- old:
```
{
  cntArith: 0n,
  cntBinary: 278n,
  cntKeccakF: 0n,
  cntSha256F: 0n,
  cntMemAlign: 0n,
  cntPoseidonG: 2n,
  cntPaddingPG: 2n,
  cntSteps: 6417
}
```
- new:
```
{
  cntArith: 0n,
  cntBinary: 1n,
  cntKeccakF: 0n,
  cntSha256F: 0n,
  cntMemAlign: 0n,
  cntPoseidonG: 2n,
  cntPaddingPG: 2n,
  cntSteps: 1068
}
```

### MSTOREX comparison tests
````
node counters/counters-executor.js --test MSTOREX
node counters/counters-executor.js --test MSTOREX_NEW
````
