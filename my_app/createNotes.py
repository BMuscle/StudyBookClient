import os
import shutil
import codecs
from time import sleep

if os.path.exists("notes"):
    shutil.rmtree("notes")

os.makedirs(R"notes\1\2")
os.mkdir(R"notes\3")
sleep(2)

files = []

files.append((
R"notes\aaa.md",
"""\
title: TitleAAA
category: 未分類
tags: Tag1, Tag2 ,Tag1

# It's aaa.md
"""
))

files.append((
R"notes\1\bbb.md",
"""\
title: TitleBBB
tags: Tag1

# It's bbb.md
"""
))

files.append((
R"notes\1\2\ccc.md",
"""\
# It's ccc.md
"""
))

for path, data in files:
    with codecs.open(path, "w", "utf-8") as text:
        text.write(data)
