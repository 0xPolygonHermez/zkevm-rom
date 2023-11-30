## Notes

The file `modexp-test-gen.js` automatically geneates a zkasm file, executes it some specified number of times and outputs a json file containing the record of the counters. At this moment, it is hardcoded to work for the operation `array_div_mod(array_mul(a, b),c)`, where `a` and `b` was chosen to be $2^{256} - 3$, while `c` was chosen to be $2^{256} - 1$ to achieve the maximum complexity in the operation.

The `modexp-test-init.sage` takes the counters in the json file and, for each different counter, interpolates the multivariate polynomial (having as evaluation points the lenght of the inputs in the previous file) that evaluates to the counters.