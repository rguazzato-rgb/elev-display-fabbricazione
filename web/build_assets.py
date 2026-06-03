"""
ELEV — Asset pipeline for the presentation site.
1. Builds aligned transparent PNG layers of each component (for the scroll-driven
   exploded view) cropped to a common frame so they stack into the assembled object.
2. Converts the new high-res renders ("Nuova cartella") into optimized, well-named
   hero / gallery JPGs.
3. Builds a full assembled composite PNG.
"""
import os
from PIL import Image

BASE = r"C:\Users\ricca\OneDrive - unibg.it\Gruppo Studi di Fabbricazione"
SEMI = os.path.join(BASE, "Render", "Semilavorati")
NUOVA = os.path.join(BASE, "Video", "Nuova cartella")
OUT = os.path.join(BASE, "web", "images")
PARTS = os.path.join(OUT, "parts")
os.makedirs(PARTS, exist_ok=True)

CANVAS = (3413, 1609)  # common world canvas (top-left anchored)
# Tight union crop of all component content (computed earlier), padded.
PAD = 60
CROP = (1937 - PAD, 386 - PAD, 2641 + PAD, 1438 + PAD)
TARGET_W = 820  # output layer width

# part file -> (slug, z-index)
PART_DEFS = [
    ("Base.tif",              "base",      1),
    ("Supporto rotante.tif",  "supporto",  2),
    ("Colonna centrale.tif",  "colonna",   3),
    ("Tirante.tif",           "tirante",   4),
    ("Piedini.tif",           "piedini",   5),
    ("Tappo.tif",             "tappo",     6),
    ("Coperchio superiore.tif","coperchio", 7),
]

def build_part(src, slug):
    im = Image.open(os.path.join(SEMI, src)).convert("RGBA")
    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    canvas.alpha_composite(im, (0, 0))
    crop = canvas.crop(CROP)
    w, h = crop.size
    nh = int(h * TARGET_W / w)
    crop = crop.resize((TARGET_W, nh), Image.LANCZOS)
    dst = os.path.join(PARTS, slug + ".png")
    crop.save(dst, "PNG", optimize=True)
    return crop, dst

print("== Component layers ==")
layers = []
for src, slug, z in PART_DEFS:
    crop, dst = build_part(src, slug)
    layers.append((crop, z))
    print(f"  {slug:10s} -> {os.path.getsize(dst):>8,} B  {crop.size}")

# Full assembled composite (parts already cropped+aligned identically)
comp = Image.new("RGBA", layers[0][0].size, (0, 0, 0, 0))
for crop, z in sorted(layers, key=lambda t: t[1]):
    comp.alpha_composite(crop, (0, 0))
comp.save(os.path.join(PARTS, "assembled.png"), "PNG", optimize=True)
print("  assembled  ->", comp.size)

# ---- Hero / gallery renders ----
def conv_jpg(src_name, out_name, max_w=1920, q=86):
    src = os.path.join(NUOVA, src_name)
    im = Image.open(src).convert("RGB")
    w, h = im.size
    if w > max_w:
        im = im.resize((max_w, int(h * max_w / w)), Image.LANCZOS)
    dst = os.path.join(OUT, out_name)
    im.save(dst, "JPEG", quality=q, optimize=True, progressive=True)
    print(f"  {out_name:22s} <- {src_name:28s} {os.path.getsize(dst):>9,} B")

RENDERS = [
    ("KS®6387519035.27.jpg", "render_open_hero.jpg"),     # clean centered, extended -> hero
    ("KS®642623937.24.jpg",  "render_open_dramatic.jpg"), # dramatic high extension
    ("KS®642623937.25.jpg",  "render_open_floating.jpg"),
    ("KS®6387519035.26.jpg", "render_open_front.jpg"),
    ("KS®3712421409.21.jpg", "render_open_angled.jpg"),
    ("KS®3712421409.22.jpg", "render_front_spring.jpg"),
    ("KS®3712421409.23.jpg", "render_lid_top.jpg"),       # zenithal sunburst
    ("KS®2582111045.28.jpg", "render_exploded_front.jpg"),
    ("KS®2582111045.29.jpg", "render_exploded_angled.jpg"),
]
print("== Renders ==")
for s, o in RENDERS:
    conv_jpg(s, o)

# clean preview/composite scratch files
for f in os.listdir(PARTS):
    if f.startswith("_"):
        os.remove(os.path.join(PARTS, f))
print("Done.")
