#!/bin/bash

echo "🚀 Starting parallel translation for all 10 languages..."
echo "Each language will run in its own process."
echo ""

# Run all translation scripts in parallel
node scripts/translate-id.js > logs/translate-id.log 2>&1 &
PID_ID=$!
echo "✅ Indonesian (id) started - PID: $PID_ID"

node scripts/translate-vi.js > logs/translate-vi.log 2>&1 &
PID_VI=$!
echo "✅ Vietnamese (vi) started - PID: $PID_VI"

node scripts/translate-th.js > logs/translate-th.log 2>&1 &
PID_TH=$!
echo "✅ Thai (th) started - PID: $PID_TH"

node scripts/translate-ja.js > logs/translate-ja.log 2>&1 &
PID_JA=$!
echo "✅ Japanese (ja) started - PID: $PID_JA"

node scripts/translate-ko.js > logs/translate-ko.log 2>&1 &
PID_KO=$!
echo "✅ Korean (ko) started - PID: $PID_KO"

node scripts/translate-es.js > logs/translate-es.log 2>&1 &
PID_ES=$!
echo "✅ Spanish (es) started - PID: $PID_ES"

node scripts/translate-pt.js > logs/translate-pt.log 2>&1 &
PID_PT=$!
echo "✅ Portuguese (pt) started - PID: $PID_PT"

node scripts/translate-hi.js > logs/translate-hi.log 2>&1 &
PID_HI=$!
echo "✅ Hindi (hi) started - PID: $PID_HI"

node scripts/translate-ar.js > logs/translate-ar.log 2>&1 &
PID_AR=$!
echo "✅ Arabic (ar) started - PID: $PID_AR"

node scripts/translate-fr.js > logs/translate-fr.log 2>&1 &
PID_FR=$!
echo "✅ French (fr) started - PID: $PID_FR"

echo ""
echo "📊 All 10 translation processes running in parallel!"
echo "Logs are being written to logs/ directory"
echo ""
echo "To monitor progress, run in separate terminals:"
echo "  tail -f logs/translate-id.log"
echo "  tail -f logs/translate-vi.log"
echo "  tail -f logs/translate-th.log"
echo "  tail -f logs/translate-ja.log"
echo "  tail -f logs/translate-ko.log"
echo "  tail -f logs/translate-es.log"
echo "  tail -f logs/translate-pt.log"
echo "  tail -f logs/translate-hi.log"
echo "  tail -f logs/translate-ar.log"
echo "  tail -f logs/translate-fr.log"
echo ""
echo "⏳ Waiting for all processes to complete..."

# Wait for all background processes
wait $PID_ID
wait $PID_VI
wait $PID_TH
wait $PID_JA
wait $PID_KO
wait $PID_ES
wait $PID_PT
wait $PID_HI
wait $PID_AR
wait $PID_FR

echo ""
echo "🎉 All translations complete!"
echo ""
echo "Summary:"
grep "complete:" logs/*.log
