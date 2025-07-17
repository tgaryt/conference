#!/bin/sh

cd `dirname $0`
/home/heyads/node-v14/bin/node /home/heyads/node-v14/bin/npm install
/home/heyads/node-v14/bin/node /home/heyads/node-v14/bin/npm run build
/home/heyads/node-v14/bin/node /home/heyads/node-v14/bin/npm run build:server
if [ -d build ]; then
    rm -rf public-site
    cp -R build public-site
fi;
pm2 start ecosystem.config.js
