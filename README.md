# zkevm-rom
This repository contains the zkasm source code of the polygon-hermez zkevm

> **WARNING**: All code here is in WIP

## Usage
````
npm i
npm run build
````
The resulting `json` file will be created in the `./build` directory

### Advanced options
- `-i ${input zkasm file}`: specify input source `zkasm` path
  - default value: `main/main.zkasm`
- `-o ${destination rom file}`: specify output path for the resulting `json`
  - default value: `build/rom.json`
- `-s ${steps}`: specify steps as $2^{steps}$
  - default value: current steps in `constants.zkasm`

Example:
```
npm run build -- -i ${path} -o ${path} -s ${steps}
```

## License
Copyright
Polygon `zkevm-rom` was developed by Polygon. While we plan to adopt an open source license, we haven’t selected one yet, so all rights are reserved for the time being. Please reach out to us if you have thoughts on licensing.

## Disclaimer
This code has not yet been audited, and should not be used in any production systems.
