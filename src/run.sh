#!/bin/sh

mongod --dbpath /rem-v2/db --fork --logpath /var/log/mongodb.log
redis-server --daemonize yes

node /dummy.js &

cd /rem-v2/src
cp /rem-v2/rem_translate/en/translation.json /rem-v2/rem_translate/dev/translation.json
node index.js
