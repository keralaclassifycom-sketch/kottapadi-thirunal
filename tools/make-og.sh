#!/usr/bin/env bash
# Regenerates images/og-kottapadi-thirunal-v4.jpg from tools/og-card.html (needs Chrome + Python Pillow)
set -e
cd "$(dirname "$0")/.."
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
OUT="$(pwd -W 2>/dev/null || pwd)/tools/og-card.png"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 \
  --virtual-time-budget=8000 --screenshot="$OUT" "file:///$(pwd -W 2>/dev/null || pwd)/tools/og-card.html"
python -c "from PIL import Image; im=Image.open('tools/og-card.png').convert('RGB').crop((0,0,1200,630)); im.save('images/og-kottapadi-thirunal-v4.jpg',quality=86,optimize=True,progressive=True); print(im.size)"
rm -f tools/og-card.png
ls -la images/og-kottapadi-thirunal-v4.jpg
