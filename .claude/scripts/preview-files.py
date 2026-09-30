#!/usr/bin/env python3
"""Print the Artifact `files` map for publishing the Quartz build in public/ as a private preview.

Quartz links pages without extensions (./86), so each page also gets an
extensionless alias served as text/html. Removed hashed assets from older
builds must be passed as null on republish; pass the previous map with
--prev to include those removals.
"""
import json, os, sys

ROOT = "public"
files = {}
for d, _, names in os.walk(ROOT):
    for n in names:
        p = os.path.relpath(os.path.join(d, n), ROOT)
        if p in ("index.html", "CNAME"):
            continue
        files[p] = p
        if p.endswith(".html") and not p.endswith("index.html") and p != "404.html":
            files[p[:-5]] = {"from": p, "contentType": "text/html"}

if len(sys.argv) == 3 and sys.argv[1] == "--prev":
    for old in json.load(open(sys.argv[2])):
        files.setdefault(old, None)

print(json.dumps(files))
