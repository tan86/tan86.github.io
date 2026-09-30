#!/usr/bin/env python3
"""Prepare the Quartz build in public/ for publishing as a private preview artifact.

The artifact's main page is wrapped in a document skeleton whose own body
styles override Quartz's fonts and colors, while the other HTML files are
served unwrapped. So the real home page is published as the file `home`, and
the main page is a stub (public/_preview.html, written by this script) that
sends the browser there. The stub carries a canonical link because Quartz's
SPA router follows canonical links as redirects when it fetches a page.

Quartz links pages without extensions (./86), so each page also gets an
extensionless alias served as text/html. Hashed assets from an earlier build
must be removed on republish; pass that build's map with --prev to add them
as null entries.

Prints the `files` map; publish with file_path public/_preview.html, root public.
"""
import json, os, sys

ROOT = "public"
STUB = "_preview.html"

with open(os.path.join(ROOT, STUB), "w") as f:
    f.write(
        '<!doctype html><html><head><meta charset="utf-8"><title>Jay Parmar Preview</title>'
        '<link rel="canonical" href="./home">'
        '<meta http-equiv="refresh" content="0; url=./home"></head>'
        '<body><script>location.replace("./home")</script>'
        '<p><a href="./home">Open the site preview</a></p></body></html>\n'
    )

# "home" is where the stub sends the browser; "index" is what search previews fetch.
files = {k: {"from": "index.html", "contentType": "text/html"} for k in ("home", "index")}
for d, _, names in os.walk(ROOT):
    for n in names:
        p = os.path.relpath(os.path.join(d, n), ROOT)
        if p in ("index.html", "CNAME", STUB):
            continue
        files[p] = p
        if p.endswith(".html") and not p.endswith("index.html") and p != "404.html":
            files[p[:-5]] = {"from": p, "contentType": "text/html"}

if len(sys.argv) == 3 and sys.argv[1] == "--prev":
    for old in json.load(open(sys.argv[2])):
        files.setdefault(old, None)

print(json.dumps(files))
