#!/usr/bin/env python3
"""
Chinese Idiom Social Card Generator

Usage:
    python scripts/generate-cards.py                    # Generate all cards
    python scripts/generate-cards.py --id ID001        # Generate single card
    python scripts/generate-cards.py --batch 10        # Generate first 10
    python scripts/generate-cards.py --with-images     # Combine with images from scripts/images/

Requirements:
    pip install pillow

Font Setup:
    Download Noto Sans SC from Google Fonts and place in scripts/fonts/:
    - NotoSansSC-Regular.ttf
    - NotoSansSC-Bold.ttf
"""

import json
import os
import sys
import textwrap
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Install Pillow: pip install pillow")
    sys.exit(1)

# Paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
IDIOMS_PATH = PROJECT_ROOT / "public" / "idioms.json"
OUTPUT_DIR = PROJECT_ROOT / "public" / "social-cards"
IMAGES_DIR = SCRIPT_DIR / "images"  # Where you put Gemini-generated images
FONTS_DIR = SCRIPT_DIR / "fonts"

# Card dimensions (Instagram-friendly 4:5 ratio)
CARD_WIDTH = 1080
CARD_HEIGHT = 1350

# Colors
BG_COLOR = "#FEFEFE"
TEXT_COLOR = "#1A1A1A"
SECONDARY_COLOR = "#666666"
ACCENT_COLOR = "#2563EB"
BORDER_COLOR = "#E5E5E5"


def load_fonts():
    """Load fonts with fallback to system fonts."""
    try:
        font_regular = ImageFont.truetype(str(FONTS_DIR / "NotoSansSC-Regular.ttf"), 32)
        font_bold = ImageFont.truetype(str(FONTS_DIR / "NotoSansSC-Bold.ttf"), 32)
        font_large = ImageFont.truetype(str(FONTS_DIR / "NotoSansSC-Bold.ttf"), 80)
        font_title = ImageFont.truetype(str(FONTS_DIR / "NotoSansSC-Bold.ttf"), 36)
        font_small = ImageFont.truetype(str(FONTS_DIR / "NotoSansSC-Regular.ttf"), 24)
        font_pinyin = ImageFont.truetype(str(FONTS_DIR / "NotoSansSC-Regular.ttf"), 28)
        return {
            "regular": font_regular,
            "bold": font_bold,
            "large": font_large,
            "title": font_title,
            "small": font_small,
            "pinyin": font_pinyin,
        }
    except OSError:
        print("\n⚠️  Font files not found!")
        print("Download Noto Sans SC from: https://fonts.google.com/noto/specimen/Noto+Sans+SC")
        print(f"Place files in: {FONTS_DIR}/")
        print("  - NotoSansSC-Regular.ttf")
        print("  - NotoSansSC-Bold.ttf\n")

        # Fallback to default font
        default = ImageFont.load_default()
        return {
            "regular": default,
            "bold": default,
            "large": default,
            "title": default,
            "small": default,
            "pinyin": default,
        }


def create_card(idiom: dict, fonts: dict, illustration_path: str = None) -> Image.Image:
    """Create a social media card for an idiom."""

    # Create base image
    img = Image.new("RGB", (CARD_WIDTH, CARD_HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)

    y_offset = 50
    padding = 60
    content_width = CARD_WIDTH - (padding * 2)

    # === HEADER ===
    draw.text((padding, y_offset), "ChineseIdioms.com", font=fonts["title"], fill=TEXT_COLOR)
    draw.text((CARD_WIDTH - padding - 150, y_offset), "每日成语", font=fonts["title"], fill=SECONDARY_COLOR)

    y_offset += 60
    draw.line([(padding, y_offset), (CARD_WIDTH - padding, y_offset)], fill=BORDER_COLOR, width=2)
    y_offset += 30

    # === ILLUSTRATION ===
    illustration_height = 400
    illustration_box = (padding, y_offset, CARD_WIDTH - padding, y_offset + illustration_height)

    if illustration_path and os.path.exists(illustration_path):
        # Load and resize illustration
        illust = Image.open(illustration_path)
        illust.thumbnail((content_width, illustration_height), Image.Resampling.LANCZOS)

        # Center the illustration
        illust_x = padding + (content_width - illust.width) // 2
        illust_y = y_offset + (illustration_height - illust.height) // 2
        img.paste(illust, (illust_x, illust_y))
    else:
        # Draw placeholder
        draw.rectangle(illustration_box, fill="#F5F5F0", outline=BORDER_COLOR)
        placeholder_text = f"[Add illustration for: {idiom['meaning']}]"
        draw.text(
            (CARD_WIDTH // 2, y_offset + illustration_height // 2),
            placeholder_text,
            font=fonts["small"],
            fill="#999999",
            anchor="mm"
        )

    y_offset += illustration_height + 30

    # === PINYIN + CHARACTERS ===
    characters = list(idiom["characters"])
    pinyin_parts = idiom["pinyin"].split(" ")

    # Calculate spacing
    char_spacing = 120
    total_width = len(characters) * char_spacing
    start_x = (CARD_WIDTH - total_width) // 2 + char_spacing // 2

    for i, char in enumerate(characters):
        x = start_x + (i * char_spacing)

        # Pinyin above
        if i < len(pinyin_parts):
            draw.text((x, y_offset), pinyin_parts[i], font=fonts["pinyin"], fill=SECONDARY_COLOR, anchor="mm")

        # Character below
        draw.text((x, y_offset + 50), char, font=fonts["large"], fill=TEXT_COLOR, anchor="mm")

    y_offset += 140

    # === MEANING SECTION ===
    draw.text((padding, y_offset), "含义 / Meaning", font=fonts["bold"], fill=ACCENT_COLOR)
    y_offset += 45

    # Metaphoric meaning
    draw.text((padding, y_offset), idiom["metaphoric_meaning"], font=fonts["bold"], fill=TEXT_COLOR)
    y_offset += 45

    # Literal meaning
    literal_text = f'Literal: "{idiom["meaning"]}"'
    draw.text((padding, y_offset), literal_text, font=fonts["small"], fill=SECONDARY_COLOR)
    y_offset += 50

    # === ORIGIN SECTION ===
    draw.text((padding, y_offset), "由来 / Origin & Usage", font=fonts["bold"], fill=ACCENT_COLOR)
    y_offset += 45

    # Wrap description text
    description = idiom.get("description", "")
    # Truncate if too long
    max_chars = 350
    if len(description) > max_chars:
        description = description[:max_chars] + "..."

    # Word wrap
    wrapped = textwrap.wrap(description, width=45)
    for line in wrapped[:8]:  # Max 8 lines
        draw.text((padding, y_offset), line, font=fonts["small"], fill=TEXT_COLOR)
        y_offset += 35

    # === FOOTER ===
    footer_y = CARD_HEIGHT - 60
    draw.line([(padding, footer_y - 20), (CARD_WIDTH - padding, footer_y - 20)], fill=BORDER_COLOR, width=1)
    draw.text((CARD_WIDTH // 2, footer_y), "© ChineseIdioms.com", font=fonts["small"], fill="#999999", anchor="mm")

    return img


def generate_gemini_prompt(idiom: dict) -> str:
    """Generate a prompt for Gemini to create the illustration."""
    return f"""Create a traditional Chinese ink wash painting (水墨画) style illustration for the idiom "{idiom['characters']}" ({idiom['pinyin']}).

The idiom means: "{idiom['meaning']}" (literally) and "{idiom['metaphoric_meaning']}" (figuratively).

Style requirements:
- Traditional Chinese ink wash painting aesthetic
- Soft, muted earth tones with subtle color accents
- Include relevant imagery that represents the literal meaning
- Aged paper/scroll texture background
- Mountains or nature elements in the background
- No text or characters in the image
- Square format, suitable for social media
- Peaceful, contemplative mood

The scene should visually represent: {idiom['meaning']}"""


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Generate Chinese Idiom Social Cards")
    parser.add_argument("--id", help="Generate card for specific idiom ID (e.g., ID001)")
    parser.add_argument("--batch", type=int, help="Generate first N cards")
    parser.add_argument("--with-images", action="store_true", help="Include images from scripts/images/")
    parser.add_argument("--prompts-only", action="store_true", help="Only output Gemini prompts")
    args = parser.parse_args()

    # Load idioms
    with open(IDIOMS_PATH, "r", encoding="utf-8") as f:
        idioms = json.load(f)

    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    # Filter idioms based on arguments
    if args.id:
        idioms = [i for i in idioms if i["id"] == args.id]
        if not idioms:
            print(f"Idiom {args.id} not found")
            return
    elif args.batch:
        idioms = idioms[:args.batch]

    if args.prompts_only:
        # Just output prompts for Gemini
        prompts_file = SCRIPT_DIR / "gemini-prompts.txt"
        with open(prompts_file, "w", encoding="utf-8") as f:
            for idiom in idioms:
                f.write(f"=== {idiom['id']}: {idiom['characters']} ===\n")
                f.write(generate_gemini_prompt(idiom))
                f.write("\n\n" + "="*50 + "\n\n")
        print(f"Prompts saved to: {prompts_file}")
        return

    # Load fonts
    fonts = load_fonts()

    print(f"Generating {len(idioms)} cards...")

    for idiom in idioms:
        # Check for existing illustration
        illustration_path = None
        if args.with_images:
            for ext in [".png", ".jpg", ".jpeg", ".webp"]:
                potential_path = IMAGES_DIR / f"{idiom['id']}{ext}"
                if potential_path.exists():
                    illustration_path = str(potential_path)
                    break

        # Generate card
        card = create_card(idiom, fonts, illustration_path)

        # Save
        output_path = OUTPUT_DIR / f"{idiom['id']}-{idiom['characters']}.png"
        card.save(output_path, "PNG", quality=95)
        print(f"✓ {idiom['id']}: {idiom['characters']} -> {output_path.name}")

    print(f"\nDone! Cards saved to: {OUTPUT_DIR}")
    print(f"\nNext steps:")
    print(f"1. Generate images with Gemini using: python {__file__} --prompts-only")
    print(f"2. Save images to: {IMAGES_DIR}/ as ID001.png, ID002.png, etc.")
    print(f"3. Re-run with: python {__file__} --with-images")


if __name__ == "__main__":
    main()
