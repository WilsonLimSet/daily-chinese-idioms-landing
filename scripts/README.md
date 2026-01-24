# Chinese Idiom Social Card Generator

Mass-generate social media cards for Reddit, Instagram, TikTok, etc.

## Quick Start (Easiest Method)

### Option 1: HTML Generator (No Setup Required)

1. Start a local server from project root:
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   ```

2. Open in browser:
   ```
   http://localhost:3000/scripts/card-generator.html
   # or
   http://localhost:8000/scripts/card-generator.html
   ```

3. Use the web interface to:
   - Browse idioms with dropdown
   - Copy Gemini prompt for each idiom
   - Upload illustration image
   - Download card as PNG
   - Batch download multiple cards

---

## Full Workflow for Mass Generation

### Step 1: Generate Gemini Prompts

```bash
# Generate prompts for first 10 idioms
node scripts/generate-gemini-prompts.js --batch 10

# Generate all prompts
node scripts/generate-gemini-prompts.js

# Generate prompt for specific idiom
node scripts/generate-gemini-prompts.js --id ID001
```

This creates `scripts/gemini-prompts.txt` with all prompts.

### Step 2: Generate Images with Gemini

1. Go to [Gemini](https://gemini.google.com/) or use the API
2. Copy each prompt from `gemini-prompts.txt`
3. Save images as `ID001.png`, `ID002.png`, etc.
4. Put them in `scripts/images/`

**Pro tip**: Use Gemini's batch API or a script to automate this.

### Step 3: Generate Final Cards

#### Using HTML Generator:
1. Open `card-generator.html` in browser
2. Select idiom, upload corresponding image
3. Click "Download Card"

#### Using Python Script:
```bash
# Install dependency
pip install pillow

# Download fonts first (see below)

# Generate cards without images (placeholders)
python scripts/generate-cards.py --batch 10

# Generate cards WITH images from scripts/images/
python scripts/generate-cards.py --with-images --batch 10

# Generate single card
python scripts/generate-cards.py --id ID001 --with-images
```

Output goes to `public/social-cards/`

---

## Font Setup (For Python Script)

Download Noto Sans SC from Google Fonts:
https://fonts.google.com/noto/specimen/Noto+Sans+SC

Place in `scripts/fonts/`:
- `NotoSansSC-Regular.ttf`
- `NotoSansSC-Bold.ttf`

---

## Directory Structure

```
scripts/
├── card-generator.html      # Web-based generator (easiest)
├── generate-cards.py        # Python batch generator
├── generate-gemini-prompts.js  # Prompt generator for Gemini
├── fonts/                   # Put fonts here
│   ├── NotoSansSC-Regular.ttf
│   └── NotoSansSC-Bold.ttf
├── images/                  # Put Gemini images here
│   ├── ID001.png
│   ├── ID002.png
│   └── ...
└── gemini-prompts.txt       # Generated prompts

public/
└── social-cards/            # Output cards go here
    ├── ID001-一鸣惊人.png
    └── ...
```

---

## Card Specifications

- **Dimensions**: 1080 x 1350 px (Instagram 4:5 ratio)
- **Format**: PNG
- **Content**:
  - Header with branding
  - Illustration area (400px height)
  - Pinyin above each character
  - Large Chinese characters
  - Meaning section (metaphoric + literal)
  - Origin/Usage section
  - Footer with website

---

## Automation Tips

### Batch Gemini Image Generation

If you have Gemini API access:

```python
import google.generativeai as genai
import json

genai.configure(api_key='YOUR_API_KEY')

with open('public/idioms.json') as f:
    idioms = json.load(f)

for idiom in idioms[:10]:  # First 10
    prompt = f"Traditional Chinese ink wash painting for {idiom['characters']}..."
    # Generate and save image
    # ...
```

### Automated Posting

Consider using:
- **Reddit**: PRAW library for Python
- **Instagram**: Meta's API or tools like Later
- **TikTok**: TikTok API for business accounts

---

## Example Output

The card will look like this:

```
┌─────────────────────────────────────┐
│ ChineseIdioms.com          每日成语  │
├─────────────────────────────────────┤
│                                     │
│      [Illustration Area]            │
│                                     │
├─────────────────────────────────────┤
│     yī    míng   jīng   rén         │
│     一     鸣     惊     人          │
├─────────────────────────────────────┤
│ 含义 / Meaning                      │
│ Sudden, remarkable success          │
│ Literal: "Bird cry that startles"   │
├─────────────────────────────────────┤
│ 由来 / Origin & Usage               │
│ This idiom emerged during the Han   │
│ Dynasty in scholarly discourse...   │
├─────────────────────────────────────┤
│        © ChineseIdioms.com          │
└─────────────────────────────────────┘
```
