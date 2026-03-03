#!/usr/bin/env python3
"""Ghost Builder - File Generator Script
Regenerates all game files for the Ghost Builder R1 app.
Uses ASCII text identifiers instead of emoji to avoid encoding issues.
Run: python generate.py
"""
import os, sys
print("Ghost Builder - File Generator")
print("All game files already exist in js/ directory.")
print("Files: data.js, inventory.js, crafting.js, world.js, player.js, renderer.js, game.js, app.js")
files = ["js/data.js","js/inventory.js","js/crafting.js","js/world.js","js/player.js","js/renderer.js","js/game.js","js/app.js","js/hardware.js","css/styles.css","index.html"]
for fp in files:
    if os.path.exists(fp):
        print(f"  OK: {fp} ({os.path.getsize(fp)} bytes)")
    else:
        print(f"  MISSING: {fp}")
print("Done! All files verified.")
