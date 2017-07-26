#!/usr/bin/env python2

import os
import progressbar

svgs = filter(lambda f: f.endswith(".svg"), os.listdir("."))

bar = progressbar.ProgressBar()

for svg in bar(svgs):
    os.system("./kanimaji/kanimaji.py %s > /dev/null" % svg)