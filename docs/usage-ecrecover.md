# ecrecover zkasm

This repo contains the zkasm subroutine to calculate ecrecover

## Usage

1) Add the npm dependecy, to do it, add following line in dependecies of package.json, after that execute npm update
````
"zk_ecrecover": "https://github.com/hermeznetwork/zk_ecrecover.git"
````

2) Add this line to include ecrecover in your source.
````
INCLUDE "../node_modules/zk_ecrecover/src/ecrecover.zkasm"
````

3) To use ecrecover subroutine passing arguments in registers:
````
A  hash
B  r
C  s
D  v
````
After setting parameters, call ecrecover:
````
:CALL(ecrecover)
````

4) To use ecrecover subroutine passing arguments in global variables:
````
ecrecover_hash  hash
ecrecover_r     r
ecrecover_s     s
ecrecover_v     v
````
After setting parameters, call ecrecover_pbv (params by vars)
````
:CALL(ecrecover_pbv)
````

## Return Codes

Subroutine ecrecover returns in A register the address; if an error happens return 0 in A register, and return error reason in B register.
````
1 - r is zero (0)
2 - r is too big
3 - s is zero (0)
4 - s is too big
5 - v not valid value (1b, 1c)
6 - not exists sqrt of y
````
