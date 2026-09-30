#!/usr/bin/env python3
"""Serve the Quartz build in public/ the way a real host would, for local testing.

  python3 .claude/scripts/serve-preview.py [--mode pages|artifact] [--port 8091]

--mode pages     (default) like GitHub Pages: /86 -> 86.html, /tags/ -> tags/index.html,
                 missing paths -> 404.html.
--mode artifact  like the private claude.ai preview artifact: "/" serves the stub page
                 wrapped in the artifact host's document skeleton, every other path
                 serves the entries of the map from preview-files.py, unwrapped. Runs
                 preview-files.py itself, so the map always matches the current build.

Run `npm run build` first. Stop it with Ctrl-C, or `pkill -f "serve-previe[w]"`.
"""
import argparse, json, mimetypes, os, subprocess, sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ROOT = "public"
HERE = os.path.dirname(os.path.abspath(__file__))

# The skeleton the artifact host wraps around an artifact's main page (as of 2026-09).
ARTIFACT_WRAPPER = (
    '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1">'
    "<style>:root{color-scheme:light}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;"
    "background:#faf9f5;color:#141413}img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}"
    "</style></head><body>\n"
)


def resolve_pages(path):
    """Map a URL path to a file in public/ the way GitHub Pages does."""
    p = path.strip("/")
    for candidate in ([p, p + ".html", os.path.join(p, "index.html")] if p else ["index.html"]):
        full = os.path.join(ROOT, candidate)
        if os.path.isfile(full):
            return full, 200
    return os.path.join(ROOT, "404.html"), 404


def make_handler(mode, files):
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            path = self.path.split("?")[0].split("#")[0]
            status, ctype = 200, None
            if mode == "artifact":
                key = path.lstrip("/")
                if key in ("", "index.html"):
                    stub = open(os.path.join(ROOT, "_preview.html")).read()
                    return self.send(200, "text/html", (ARTIFACT_WRAPPER + stub + "</body></html>").encode())
                entry = files.get(key)
                if entry is None:
                    return self.send(404, "text/plain", b"not found")
                src = entry["from"] if isinstance(entry, dict) else entry
                ctype = entry.get("contentType") if isinstance(entry, dict) else None
                full = os.path.join(ROOT, src)
            else:
                full, status = resolve_pages(path)
            ctype = ctype or mimetypes.guess_type(full)[0] or "application/octet-stream"
            self.send(status, ctype, open(full, "rb").read())

        def send(self, status, ctype, body):
            self.send_response(status)
            self.send_header("content-type", ctype)
            self.send_header("cache-control", "no-store")
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, *args):
            pass

    return Handler


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--mode", choices=["pages", "artifact"], default="pages")
    ap.add_argument("--port", type=int, default=8091)
    a = ap.parse_args()
    if not os.path.isfile(os.path.join(ROOT, "index.html")):
        sys.exit("public/index.html missing: run `npm run build` first (from the repo root)")
    files = {}
    if a.mode == "artifact":
        out = subprocess.run([sys.executable, os.path.join(HERE, "preview-files.py")], check=True, capture_output=True, text=True)
        files = json.loads(out.stdout)
    print(f"serving public/ in {a.mode} mode on http://localhost:{a.port}/", flush=True)
    ThreadingHTTPServer(("127.0.0.1", a.port), make_handler(a.mode, files)).serve_forever()


if __name__ == "__main__":
    main()
