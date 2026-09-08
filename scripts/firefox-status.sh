#!/bin/bash
# Ground truth for the Firefox WebExtension Types work. Reports what is ON DISK.

PROJ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [ -n "$1" ]; then
  MOZ="$1"
elif [ -n "$TOPSRCDIR" ]; then
  MOZ="$TOPSRCDIR"
elif [ -n "$MOZ_TOPSRCDIR" ]; then
  MOZ="$MOZ_TOPSRCDIR"
elif [ -n "$MOZILLA_CENTRAL" ]; then
  MOZ="$MOZILLA_CENTRAL"
else
  MOZ=""
fi

echo "=== FIREFOX STATUS  $(date -u '+%Y-%m-%dT%H:%M:%SZ') ==="
echo

echo "--- 1. Firefox source tree: which schema files actually differ from HEAD ---"
if [ -d "$MOZ/.git" ]; then
  cd "$MOZ" || exit 1
  n=$(git diff --name-only HEAD -- "toolkit/components/extensions/schemas/" "browser/components/extensions/schemas/" "mobile/shared/components/extensions/schemas/" 2>/dev/null | wc -l)
  echo "modified schema files: $n"
  [ "$n" -eq 0 ] && echo "  (none — the tree is unmodified)"
else
  echo "NO FIREFOX CHECKOUT at $MOZ"
fi
echo

echo "--- 2. The actual deliverable: generator and emitted types ---"
gen=$(find "$PROJ/src" -name '*.js' 2>/dev/null | sort)
if [ -n "$gen" ]; then
  echo "  generator:"
  echo "$gen" | while read -r g; do
    printf "    %-72s %4s lines  %s\n" "${g#$PROJ/}" "$(wc -l < "$g")" "$(md5sum "$g" | cut -c1-12)"
  done
else
  echo "  GENERATOR: none found"
fi

dts=$(find "$PROJ/dist" -name '*.d.ts' 2>/dev/null | sort)
DTSHASH="none"
if [ -n "$dts" ]; then
  echo "  emitted .d.ts:"
  echo "$dts" | while read -r d; do
    printf "    %-72s %4s lines  %s\n" "${d#$PROJ/}" "$(wc -l < "$d")" "$(md5sum "$d" | cut -c1-12)"
  done
  DTSHASH=$(echo "$dts" | xargs md5sum 2>/dev/null | md5sum | cut -c1-12)
else
  echo "  EMITTED .d.ts: none found"
fi
echo

echo "--- 3. Verifications ---"
cd "$PROJ" || exit 1
if [ -f "scripts/verify-parity.js" ]; then
  if [ -n "$MOZ" ]; then
    node scripts/verify-parity.js --firefox-source "$MOZ" || echo "  (differ exited non-zero)"
  else
    node scripts/verify-parity.js || echo "  (differ exited non-zero)"
  fi
else
  echo "  cannot run: differ script absent"
fi

echo
STAMP=$( { echo "$DTSHASH"; cat "$PROJ/dist"/*.d.ts 2>/dev/null; } | md5sum | cut -c1-12)
echo "=== STAMP $(date -u '+%Y-%m-%dT%H:%M:%SZ') $STAMP ==="
