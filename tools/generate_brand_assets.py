from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ASSET_DIR = Path(__file__).resolve().parents[1] / "assets"
SOURCES = {
    "backline-banner": ASSET_DIR / "backline-banner.png",
    "backline-full-logo": ASSET_DIR / "backline-full-logo.png",
    "backline-icon": ASSET_DIR / "backline-icon.png",
}

ORANGE = (249, 132, 54)
LIGHT_GREY = (207, 216, 226)


def transparent_logo(source_path):
    image = Image.open(source_path).convert("RGBA")
    pixels = image.load()
    background = [(0, 0), (image.width - 1, 0), (0, image.height - 1), (image.width - 1, image.height - 1)]
    stack = background[:]
    seen = set()

    def is_background(x, y):
        r, g, b, a = pixels[x, y]
        if a == 0:
            return True
        spread = max(r, g, b) - min(r, g, b)
        return min(r, g, b) >= 238 and spread <= 28

    while stack:
        x, y = stack.pop()
        if (x, y) in seen or x < 0 or y < 0 or x >= image.width or y >= image.height:
            continue
        seen.add((x, y))
        if not is_background(x, y):
            continue
        r, g, b, a = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)
        stack.extend(((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)))
    return image


def trim_transparent(image, padding=8):
    alpha = image.getchannel("A")
    bounds = alpha.getbbox()
    if not bounds:
        return image
    left, top, right, bottom = bounds
    left = max(left - padding, 0)
    top = max(top - padding, 0)
    right = min(right + padding, image.width)
    bottom = min(bottom + padding, image.height)
    return image.crop((left, top, right, bottom))


def is_slogan_area(name, x, y, width, height):
    if name == "backline-banner":
        return x > width * 0.42 and y > height * 0.68
    if name == "backline-full-logo":
        return y > height * 0.88
    return False


def dark_logo(name, image):
    output = Image.new("RGBA", image.size)
    src = image.load()
    dst = output.load()
    for y in range(image.height):
      for x in range(image.width):
        r, g, b, a = src[x, y]
        if a == 0:
            dst[x, y] = (0, 0, 0, 0)
            continue

        if is_slogan_area(name, x, y, image.width, image.height):
            dst[x, y] = (*ORANGE, a)
            continue

        is_dark_navy = b >= g >= r and b < 92 and g < 86 and r < 48
        is_blue = b > g + 18 and b > r + 34
        is_teal = g > r + 12 and g >= b - 28
        is_gray = max(r, g, b) - min(r, g, b) < 28
        if is_dark_navy:
            color = (255, 232, 201)
        elif is_teal:
            color = (204, 91, 119)
        elif is_blue:
            color = ORANGE
        elif is_gray:
            color = (239, 199, 185)
        else:
            color = (r, g, b)
        dst[x, y] = (*color, a)
    if name == "backline-banner":
        draw_slogan(output, x=int(output.width * 0.445), y=int(output.height * 0.695), size=max(22, int(output.height * 0.088)))
    if name == "backline-full-logo":
        draw_slogan(output, x=int(output.width * 0.22), y=int(output.height * 0.875), size=max(30, int(output.height * 0.045)))
    return output


def draw_slogan(image, x, y, size):
    clear_top = max(y - int(size * 0.22), 0)
    clear_bottom = image.height
    clear_left = max(x - int(size * 0.18), 0)
    clear_right = image.width
    ImageDraw.Draw(image).rectangle((clear_left, clear_top, clear_right, clear_bottom), fill=(0, 0, 0, 0))
    font_paths = [
        Path("C:/Windows/Fonts/arialbd.ttf"),
        Path("C:/Windows/Fonts/arial.ttf"),
    ]
    font = None
    for path in font_paths:
        if path.exists():
            font = ImageFont.truetype(str(path), size=size)
            break
    if font is None:
        font = ImageFont.load_default(size=size)
    draw = ImageDraw.Draw(image)
    draw.text((x, y), "Your office, handled", fill=(*ORANGE, 255), font=font, anchor="lt")


def grey_navy_logo(source_path):
    image = Image.open(source_path).convert("RGBA")
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            is_dark_navy = r < 82 and g < 126 and b < 190 and b > r + 24 and b > g + 16
            if not is_dark_navy:
                continue
            strength = max(0.58, min(1, (140 - max(r, g, b)) / 110))
            color = tuple(int(channel * strength + 255 * (1 - strength)) for channel in LIGHT_GREY)
            pixels[x, y] = (*color, a)
    return image


def outlined_logo(source_path, radius=1):
    image = Image.open(source_path).convert("RGBA")
    alpha = image.getchannel("A")
    expanded = alpha.filter(ImageFilter.MaxFilter(radius * 2 + 1))
    outline_alpha = Image.new("L", image.size, 0)
    outline_alpha.paste(expanded)
    outline_alpha = Image.eval(outline_alpha, lambda value: min(value, 210))
    outline = Image.new("RGBA", image.size, (255, 255, 255, 0))
    outline.putalpha(outline_alpha)
    outline.alpha_composite(image)
    return outline


def banner_wordmark(source_path):
    image = Image.open(source_path).convert("RGBA")
    left = int(image.width * 0.34)
    top = int(image.height * 0.2)
    right = image.width
    bottom = int(image.height * 0.49)
    return trim_transparent(image.crop((left, top, right, bottom)), padding=2)


def main():
    for name, source in SOURCES.items():
        transparent = trim_transparent(transparent_logo(source))
        transparent.save(ASSET_DIR / f"{name}-transparent.png")
        dark_logo(name, transparent).save(ASSET_DIR / f"{name}-dark.png")
    clean_banner = ASSET_DIR / "backline-banner-clean.png"
    if clean_banner.exists():
        grey_navy_logo(clean_banner).save(ASSET_DIR / "backline-banner-clean-grey.png")
        outlined_logo(clean_banner, radius=1).save(ASSET_DIR / "backline-banner-clean-outline.png")
        banner_wordmark(clean_banner).save(ASSET_DIR / "backline-wordmark.png")


if __name__ == "__main__":
    main()
