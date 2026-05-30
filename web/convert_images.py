"""
Convert TIF images from Render folder to optimized PNG for web display.
Also copies CHIUSO_penne.png and the video file.
"""
import os
import shutil
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    import subprocess, sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

# Base paths
BASE = Path(r"c:\Users\ricca\OneDrive - unibg.it\Gruppo Studi di Fabbricazione")
RENDER = BASE / "Render"
OUTPUT = BASE / "web" / "images"

# Create output directory
OUTPUT.mkdir(parents=True, exist_ok=True)

MAX_WIDTH = 1920

def convert_tif_to_png(src: Path, dst: Path):
    """Convert a TIF to PNG, resizing if wider than MAX_WIDTH."""
    img = Image.open(src)
    
    # Convert to RGBA if it has transparency, otherwise RGB
    if img.mode in ("RGBA", "LA", "PA"):
        img = img.convert("RGBA")
    elif img.mode != "RGB":
        img = img.convert("RGB")
    
    # Resize if too wide, preserving aspect ratio
    w, h = img.size
    if w > MAX_WIDTH:
        ratio = MAX_WIDTH / w
        new_h = int(h * ratio)
        img = img.resize((MAX_WIDTH, new_h), Image.LANCZOS)
    
    # Save with optimized PNG compression
    img.save(dst, "PNG", optimize=True)
    return dst

def copy_file(src: Path, dst: Path):
    """Copy a file to the destination."""
    shutil.copy2(src, dst)
    return dst

# Define all conversions: (source_path, output_filename)
conversions = [
    # Main renders
    (RENDER / "APERTO.tif", "aperto.png"),
    (RENDER / "CHIUSO.tif", "chiuso.png"),
    (RENDER / "ESTRUSO.tif", "estruso.png"),
    
    # Acquisti
    (RENDER / "Acquisti" / "KS®231822651.18.tif", "acquisti_1.png"),
    (RENDER / "Acquisti" / "KS®2446719240.19.tif", "acquisti_2.png"),
    (RENDER / "Acquisti" / "KS®4654114213.17.tif", "acquisti_3.png"),
    (RENDER / "Acquisti" / "KS®6387530935.16.tif", "acquisti_4.png"),
    
    # Minuteria
    (RENDER / "Minuteria" / "KS®6140127399.20.tif", "minuteria_1.png"),
    
    # Semilavorati
    (RENDER / "Semilavorati" / "KS®345241688.11.tif", "semilavorati_1.png"),
    (RENDER / "Semilavorati" / "KS®3854429180.14.tif", "semilavorati_2.png"),
    (RENDER / "Semilavorati" / "KS®443022208.12.tif", "semilavorati_3.png"),
    (RENDER / "Semilavorati" / "KS®5184332178.13.tif", "semilavorati_4.png"),
    (RENDER / "Semilavorati" / "KS®54227823.9.tif", "semilavorati_5.png"),
    (RENDER / "Semilavorati" / "KS®630475512.15.tif", "semilavorati_6.png"),
    (RENDER / "Semilavorati" / "KS®97331329.10.tif", "semilavorati_7.png"),
]

# Files to copy directly
copies = [
    (RENDER / "CHIUSO_penne.png", "chiuso_penne.png"),
    (BASE / "Video" / "Fai_durare_il_video_di_più_e_l.mp4", "video_presentazione.mp4"),
]

results = []

print("=" * 70)
print("TIF -> PNG Conversion for Web")
print("=" * 70)

# Convert TIF files
for src, out_name in conversions:
    dst = OUTPUT / out_name
    if not src.exists():
        print(f"  [MISSING] {src.name}")
        results.append((out_name, "MISSING", 0, 0))
        continue
    
    src_size = src.stat().st_size
    try:
        convert_tif_to_png(src, dst)
        dst_size = dst.stat().st_size
        print(f"  [OK] {src.name} -> {out_name}  ({src_size:,} -> {dst_size:,} bytes)")
        results.append((out_name, "OK", src_size, dst_size))
    except Exception as e:
        print(f"  [ERROR] {src.name}: {e}")
        results.append((out_name, f"ERROR: {e}", src_size, 0))

# Copy files
print("\nCopying files...")
for src, out_name in copies:
    dst = OUTPUT / out_name
    if not src.exists():
        print(f"  [MISSING] {src.name}")
        results.append((out_name, "MISSING", 0, 0))
        continue
    
    src_size = src.stat().st_size
    try:
        copy_file(src, dst)
        dst_size = dst.stat().st_size
        print(f"  [OK] {src.name} -> {out_name}  ({src_size:,} -> {dst_size:,} bytes)")
        results.append((out_name, "OK", src_size, dst_size))
    except Exception as e:
        print(f"  [ERROR] {src.name}: {e}")
        results.append((out_name, f"ERROR: {e}", src_size, 0))

# Summary
print("\n" + "=" * 70)
print("SUMMARY")
print("=" * 70)
print(f"{'Output File':<30} {'Status':<10} {'Original':>12} {'Final':>12}")
print("-" * 70)
total_src = 0
total_dst = 0
ok_count = 0
for name, status, src_s, dst_s in results:
    print(f"{name:<30} {status:<10} {src_s:>10,} B {dst_s:>10,} B")
    if status == "OK":
        total_src += src_s
        total_dst += dst_s
        ok_count += 1

print("-" * 70)
print(f"{'TOTAL':<30} {ok_count} files   {total_src:>10,} B {total_dst:>10,} B")
print(f"\nAll output files in: {OUTPUT}")
print("Done!")
