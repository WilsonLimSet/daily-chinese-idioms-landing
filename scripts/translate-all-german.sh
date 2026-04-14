#!/bin/bash
# Sequential German translation orchestrator. Runs all content translation scripts.
# Idioms and phrases use OpenAI; listicles/slang/hsk/poems/blogs use Gemini.
# Sequenced to respect per-API rate limits and produce a single log.
set -e
cd "$(dirname "$0")/.."
LOG=/tmp/translate-german.log
echo "[$(date)] START German translation chain" | tee "$LOG"

echo "[$(date)] 1/7 idioms (OpenAI)" | tee -a "$LOG"
node scripts/translate-new-idioms.js --lang de 2>&1 | tee -a "$LOG"

echo "[$(date)] 2/7 listicles (Gemini)" | tee -a "$LOG"
node scripts/translate-new-listicles.js --lang de 2>&1 | tee -a "$LOG"

echo "[$(date)] 3/7 slang (Gemini)" | tee -a "$LOG"
node scripts/translate-slang-hsk.js --lang de --type slang 2>&1 | tee -a "$LOG"

echo "[$(date)] 4/7 hsk (Gemini)" | tee -a "$LOG"
node scripts/translate-slang-hsk.js --lang de --type hsk 2>&1 | tee -a "$LOG"

echo "[$(date)] 5/7 phrases (OpenAI)" | tee -a "$LOG"
node scripts/translate-openai.js --lang de --type phrases 2>&1 | tee -a "$LOG"

echo "[$(date)] 6/7 poems & poets (Gemini)" | tee -a "$LOG"
node scripts/translate-poems-poets.js --lang de 2>&1 | tee -a "$LOG"

echo "[$(date)] 7/7 blog articles (Gemini)" | tee -a "$LOG"
node scripts/translate-blog-articles.js --lang de 2>&1 | tee -a "$LOG"

echo "[$(date)] DONE German translation chain" | tee -a "$LOG"
