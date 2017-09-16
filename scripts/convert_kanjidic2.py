#!/usr/bin/env python2

import json

with open("kanjidic2.json", "rb") as f:
    raw = f.read()
    kanjidic2 = json.loads(raw)

# Makes a dictionary where each key is a kanji, instead of a big list of objects
transformed = {kanjidic2[i]["literal"]: kanjidic2[i]
               for i in xrange(len(kanjidic2))}

with open("kanji.json", "wb") as f:
    f.write(json.dumps(transformed))
