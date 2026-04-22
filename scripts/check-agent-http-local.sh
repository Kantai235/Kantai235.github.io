#!/usr/bin/env bash

set -euo pipefail

PORT="${1:-8788}"
BASE_URL="http://127.0.0.1:${PORT}"
LOG_FILE="$(mktemp)"

cleanup() {
  if [[ -n "${WRANGLER_PID:-}" ]] && kill -0 "${WRANGLER_PID}" 2>/dev/null; then
    kill "${WRANGLER_PID}" 2>/dev/null || true
    wait "${WRANGLER_PID}" 2>/dev/null || true
  fi
  rm -f "${LOG_FILE}"
}

trap cleanup EXIT

npx wrangler dev \
  --local \
  --ip 127.0.0.1 \
  --port "${PORT}" \
  --show-interactive-dev-session=false \
  > "${LOG_FILE}" 2>&1 &
WRANGLER_PID=$!

for _ in $(seq 1 30); do
  if curl -sS -o /dev/null "${BASE_URL}/"; then
    bash scripts/check-agent-http.sh "${BASE_URL}"
    exit 0
  fi
  sleep 1
done

echo "失敗：本地 Wrangler Worker 未能在預期時間內啟動。" >&2
echo "Wrangler 輸出：" >&2
cat "${LOG_FILE}" >&2
exit 1
