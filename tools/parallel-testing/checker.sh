#!/bin/sh
FILE=$PWD/tools/parallel-tests/checker.txt
if [ -f "$FILE" ]; then
    cat "$FILE"
    exit 1
fi
