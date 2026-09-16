from PIL import Image, ImageDraw
import math

NAVY = (5, 10, 16, 255)
GOLD = (212, 175, 55, 255)
GREEN = (30, 78, 59, 255)
GREEN_LIGHT = (46, 125, 87, 255)
S = 1024
CX = CY = S // 2


def draw_emblem(d, scale=1.0, cx=CX, cy=CY):
    R = int(360 * scale)  # outer ring radius
    # outer gold ring
    d.ellipse([cx - R, cy - R, cx + R, cy + R], outline=GOLD, width=int(22 * scale))
    # laurel dots ring (simple gold ticks around)
    n = 40
    for i in range(n):
        ang = 2 * math.pi * i / n
        rr = R + int(30 * scale)
        x = cx + rr * math.cos(ang)
        y = cy + rr * math.sin(ang)
        r2 = int(6 * scale)
        d.ellipse([x - r2, y - r2, x + r2, y + r2], fill=GOLD)
    # inner green disc
    ri = int(270 * scale)
    d.ellipse([cx - ri, cy - ri, cx + ri, cy + ri], fill=GREEN)
    d.ellipse([cx - ri, cy - ri, cx + ri, cy + ri], outline=GREEN_LIGHT, width=int(10 * scale))
    # leaf (two arcs) in gold
    lw = int(200 * scale)
    lh = int(300 * scale)
    # leaf body via polygon approximating a leaf
    pts = []
    for tt in range(0, 101):
        t = tt / 100.0
        # left edge curve
        x = cx - lw * math.sin(math.pi * t)
        y = cy - lh / 2 + lh * t
        pts.append((x, y))
    for tt in range(100, -1, -1):
        t = tt / 100.0
        x = cx + lw * math.sin(math.pi * t)
        y = cy - lh / 2 + lh * t
        pts.append((x, y))
    d.polygon(pts, fill=GOLD)
    # central vein in green
    d.line([(cx, cy - lh / 2 + int(20 * scale)), (cx, cy + lh / 2 - int(20 * scale))],
           fill=GREEN, width=int(14 * scale))


def make_icon(path, bg):
    img = Image.new("RGBA", (S, S), bg)
    d = ImageDraw.Draw(img)
    draw_emblem(d, scale=1.0)
    img.convert("RGB").save(path) if bg[3] == 255 else img.save(path)


def make_transparent(path, scale):
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    draw_emblem(d, scale=scale)
    img.save(path)


base = "/app/frontend/assets/images/"
# App icon: full square, opaque navy background, no transparency
make_icon(base + "icon.png", NAVY)
# Splash icon: transparent background, centered emblem
make_transparent(base + "splash-image.png", 0.9)
# Adaptive icon foreground: transparent, emblem within safe zone (~0.62)
make_transparent(base + "adaptive-icon.png", 0.62)
# Favicon
fav = Image.open(base + "icon.png").resize((196, 196))
fav.save(base + "favicon.png")
print("icons generated")
