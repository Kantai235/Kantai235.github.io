#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${1:-https://blog.init.engineer}"
ATTEMPTS="${CHECK_ATTEMPTS:-12}"
DELAY_SECONDS="${CHECK_DELAY_SECONDS:-10}"
REPORT_FILE="${CHECK_REPORT_FILE:-agent-http-report.md}"

for attempt in $(seq 1 "${ATTEMPTS}"); do
  echo "第 ${attempt}/${ATTEMPTS} 次檢查：${BASE_URL}"

  if bash scripts/check-agent-http.sh "${BASE_URL}"; then
    bash scripts/report-agent-http.sh "${BASE_URL}" "${REPORT_FILE}" >/dev/null
    echo "驗證通過，報告已寫入 ${REPORT_FILE}"
    exit 0
  fi

  if [[ "${attempt}" -lt "${ATTEMPTS}" ]]; then
    echo "等待 ${DELAY_SECONDS} 秒後重試..."
    sleep "${DELAY_SECONDS}"
  fi
done

echo "正式站驗證仍未通過，開始產生報告..."
bash scripts/report-agent-http.sh "${BASE_URL}" "${REPORT_FILE}"
exit 1
