#!/usr/bin/env python3
"""Render Socialkaroo brand assets: logo.png + light-premium og-image.jpg."""
import math
from PIL import Image, ImageDraw, ImageFont

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

INDIGO = (79, 70, 229)
BLUE = (37, 99, 235)
CYAN = (56, 189, 248)
GOLD = (201, 162, 75)
INK = (24, 24, 31)
SLATE = (71, 85, 105)
IVORY = (250, 249, 246)

# ---------------------------------------------------------------- logo.png
def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))

def grad_color(x, y, size):
    t = (x + y) / (2.0 * size)
    if t < 0.55:
        return lerp(INDIGO, BLUE, t / 0.55)
    return lerp(BLUE, CYAN, (t - 0.55) / 0.45)

BOLT = [(39, 9), (17, 38), (29, 38), (24, 55), (51, 23), (37, 23)]

def point_in_poly(px, py, poly):
    inside = False
    j = len(poly) - 1
    for i in range(len(poly)):
        xi, yi = poly[i]
        xj, yj = poly[j]
        if ((yi > py) != (yj > py)) and (px < (xj - xi) * (py - yi) / (yj - yi) + xi):
            inside = not inside
        j = i
    return inside

def render_logo(size=512, ss=2):
    S = size * ss
    px = bytearray(S * S * 4)
    k = size / 64.0
    bolt = [(x * k * ss, y * k * ss) for (x, y) in BOLT]
    r = 16 * k * ss
    cx = cy = S / 2.0
    hw = 31 * k * ss          # half width of the rounded square (x=1..63)
    x0, x1 = cx - hw, cx + hw
    y0, y1 = cy - hw, cy + hw
    gold = (47.5 * k * ss, 13.5 * k * ss)
    gold_r = 2.8 * k * ss
    stroke_w = 1.4 * k * ss

    def sdf_roundrect(px_, py_):
        qx = abs(px_ - cx) - (hw - r)
        qy = abs(py_ - cy) - (hw - r)
        ax, ay = max(qx, 0.0), max(qy, 0.0)
        return math.hypot(ax, ay) + min(max(qx, qy), 0.0) - r

    for y in range(S):
        base = y * S * 4
        for x in range(S):
            d = sdf_roundrect(x + 0.5, y + 0.5)
            i = base + x * 4
            if d > 0.5:           # fully outside
                continue
            col = grad_color(x / ss, y / ss, size / ss)
            # sheen (top-left highlight)
            sheen = 0.30 * max(0.0, 1 - x / S) * max(0.0, 1 - y / S)
            col = tuple(min(255, round(c + (255 - c) * sheen)) for c in col)
            # rounded-rect stroke
            ad = abs(d)
            if ad < stroke_w:
                t = ad / stroke_w
                col = lerp((255, 255, 255), col, t)
            # bolt
            if point_in_poly(x + 0.5, y + 0.5, bolt):
                col = (255, 255, 255)
            # gold dot
            gd = math.hypot(x + 0.5 - gold[0], y + 0.5 - gold[1])
            if gd < gold_r:
                col = lerp(GOLD, col, min(1.0, gd / gold_r))
            # coverage AA from SDF
            cov = max(0.0, min(1.0, 0.5 - d))
            if cov < 1.0 and d < 0:
                col = lerp(col, (0, 0, 0), 1 - cov)
            px[i] = col[0]; px[i + 1] = col[1]; px[i + 2] = col[2]
            if d <= 0:
                px[i + 3] = 255
            else:
                px[i + 3] = round(255 * cov)
    img = Image.frombuffer("RGBA", (S, S), bytes(px), "raw", "RGBA", 0, 1)
    img = img.resize((size, size), Image.LANCZOS)
    img.save("logo.png")
    print("logo.png written")

# ---------------------------------------------------------------- og-image.jpg
def ring_alpha(t, alpha):
    return round(alpha * (1 - t) ** 2)

def render_og(scale=2):
    W, H = 1200, 630
    S = scale
    img = Image.new("RGB", (W * S, H * S), IVORY)
    d = ImageDraw.Draw(img)

    # premium top accent bar (indigo -> cyan -> gold)
    bar_h = 8 * S
    for i in range(bar_h):
        t = i / bar_h
        d.rectangle([0, i, W * S, i], fill=lerp(INDIGO, CYAN, t))
    for i in range(bar_h):
        t = i / bar_h
        d.rectangle([0, i + bar_h - 1, W * S, i + bar_h - 1], fill=lerp(CYAN, GOLD, t))

    # soft gradient blobs (concentric rings)
    def blob(cx, cy, rad, col, alpha):
        rings = 70
        for i in range(rings):
            t0 = rad * (i / rings)
            t1 = rad * ((i + 1) / rings)
            a = ring_alpha((i + 0.5) / rings, alpha)
            d.ellipse([cx - t1, cy - t1, cx + t1, cy + t1],
                      fill=(col[0], col[1], col[2], a))

    blob(1000 * S, 60 * S, 430 * S, INDIGO, 26)
    blob(140 * S, 600 * S, 400 * S, CYAN, 22)
    blob(60 * S, 70 * S, 240 * S, GOLD, 30)
    blob(1120 * S, 470 * S, 300 * S, INDIGO, 18)

    # logo mark
    mark = Image.open("logo.png").convert("RGBA").resize((118 * S, 118 * S), Image.LANCZOS)
    img.paste(mark, (92 * S, 96 * S), mark)

    f_word = ImageFont.truetype(FONT_B, 64 * S)
    f_tag = ImageFont.truetype(FONT_B, 21 * S)
    f_h1 = ImageFont.truetype(FONT_B, 44 * S)
    f_h2 = ImageFont.truetype(FONT_B, 60 * S)
    f_sub = ImageFont.truetype(FONT, 23 * S)
    f_chip = ImageFont.truetype(FONT_B, 22 * S)
    f_contact = ImageFont.truetype(FONT, 21 * S)

    d.text((92 * S, 250 * S), "Socialkaroo", font=f_word, fill=INK)
    d.text((92 * S + 340 * S, 268 * S), "\u26a1", font=f_word, fill=GOLD)

    d.text((94 * S, 335 * S), "INBOUND LEAD GENERATION  \u2022  SOCIAL MEDIA GROWTH  \u2022  INDORE",
           font=f_tag, fill=SLATE)

    d.text((92 * S, 420 * S), "We fill your business with", font=f_h1, fill=INK)
    d.text((92 * S, 478 * S), "Paying Customers.", font=f_h2, fill=INDIGO)

    # gold divider
    d.rectangle([92 * S, 566 * S, 260 * S, 566 * S + 5 * S], fill=GOLD)

    # right chips
    chips = ["450+ Leads / mo", "4.9\u2605 Avg Client Rating", "Google Maps Top-3",
             "5-Min WhatsApp Funnels"]
    cy_chip = 150 * S
    for label in chips:
        w = d.textlength(label, font=f_chip)
        x0c, x1c, y0c, y1c = 780 * S, 1100 * S, cy_chip, cy_chip + 52 * S
        d.rounded_rectangle([x0c, y0c, x1c, y1c], radius=14 * S, fill=(255, 255, 255),
                            outline=(233, 230, 223), width=2)
        d.text((x0c + 20 * S, y0c + 10 * S), label, font=f_chip, fill=INDIGO)
        cy_chip += 66 * S

    # contact strip
    d.rectangle([0, H * S - 74 * S, W * S, H * S], fill=(255, 255, 255))
    d.rectangle([0, H * S - 74 * S, W * S, H * S - 74 * S + 2 * S], fill=(233, 230, 223))
    d.text((92 * S, H * S - 50 * S), "wa.me/916267556790   \u2022   @social_karooo   \u2022   Vijay Nagar, Indore",
           font=f_contact, fill=SLATE)
    d.text((W * S - 560 * S, H * S - 50 * S), "socialkaroo.com", font=f_contact, fill=SLATE)

    img = img.resize((W, H), Image.LANCZOS)
    img.save("og-image.jpg", quality=92)
    print("og-image.jpg written")

if __name__ == "__main__":
    render_logo(size=512, ss=2)
    render_og(scale=2)
