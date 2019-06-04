#!/bin/bash

npm run build

rm -f ../all-time-high.tar

tar \
  --exclude='.data' \
  --exclude='.vscode' \
  --exclude='node_modules' \
  --exclude='scripts' \
  --exclude='src' \
  --exclude='.babelrc' \
  --exclude='.browserslistrc' \
  --exclude='.dockerignore' \
  --exclude='.eslintignore' \
  --exclude='.eslintrc.yml' \
  --exclude='.git' \
  --exclude='.gitignore' \
  --exclude='.prettierrc.yaml' \
  --exclude='Dockerfile.arm32v6' \
  --exclude='all-time-high.tar' \
  --exclude='package-lock.json' \
  -zcvf ../all-time-high.tar \
  ../all-time-high/

scp ../all-time-high.tar theia:/media/sdt1/home/jtnet/node/apps

ssh theia 'cd ~/node/apps && tar -xvf all-time-high.tar'