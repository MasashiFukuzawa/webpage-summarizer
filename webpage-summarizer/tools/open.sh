#!/bin/bash

set -e

if [ ! -e .clasp.json.$1 ]; then
  deploy
  exit 0
fi

filename=".clasp.json.$1"
echo $filename

echo "Rename $filename to .clasp.json"
mv $filename .clasp.json

set +e
clasp open

echo "Revert filename from .clasp.json to $filename"
mv .clasp.json $filename
