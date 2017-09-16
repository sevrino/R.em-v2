#!/bin/sh

mongod --dbpath /rem-v2/db --fork --logpath /var/log/mongodb.log
redis-server --daemonize yes

node /dummy.js &

if [ -e "/rem-v2/kanji/kanji.tar.gz" ]; then
    echo "Unpacking kanji animations..."
    tar xzf "/rem-v2/kanji/kanji.tar.gz" -C /rem-v2/kanji
    echo "Done."
    rm "/rem-v2/kanji/kanji.tar.gz"
fi

cd /rem-v2/src
cp /rem-v2/rem_translate/en/translation.json /rem-v2/rem_translate/dev/translation.json
node index.js
