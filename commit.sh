#!/bin/bash
cd "$(dirname "$0")"
git add -A
msg="${1:-update}"
if git commit -m "$msg" >/dev/null 2>&1; then echo "committed: $msg"; else echo "nothing to commit"; fi
if git push -q origin HEAD 2>/dev/null; then echo "pushed to origin"; else echo "push skipped/failed"; fi
