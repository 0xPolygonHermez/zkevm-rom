#!/bin/sh
FILE=$PWD/tools/run-test/parallel-tests/checker.txt
if [ -f "$FILE" ]; then
    cat "$FILE"
    exit 1
fi
