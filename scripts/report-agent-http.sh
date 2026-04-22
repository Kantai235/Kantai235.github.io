#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${1:-https://blog.init.engineer}"
OUTPUT_FILE="${2:-}"
REPORT_INCLUDE_LOCAL="${REPORT_INCLUDE_LOCAL:-0}"

tmp_headers="$(mktemp)"
tmp_markdown_headers="$(mktemp)"
tmp_robots="$(mktemp)"
tmp_local_output="$(mktemp)"
tmp_report="$(mktemp)"

cleanup() {
  rm -f "${tmp_headers}" "${tmp_markdown_headers}" "${tmp_robots}" "${tmp_local_output}" "${tmp_report}"
}

trap cleanup EXIT

host="${BASE_URL#*://}"
host="${host%%/*}"
root_domain="$(printf '%s\n' "${host}" | awk -F. '{ if (NF >= 2) print $(NF-1) "." $NF; else print $0 }')"
timestamp_utc="$(date -u '+%Y-%m-%d %H:%M:%S UTC')"
timestamp_taipei="$(TZ=Asia/Taipei date '+%Y-%m-%d %H:%M:%S %Z')"

curl -sSI -D "${tmp_headers}" -o /dev/null "${BASE_URL}/" || true
curl -sSI -D "${tmp_markdown_headers}" -H 'Accept: text/markdown' -o /dev/null "${BASE_URL}/" || true
curl -sS "${BASE_URL}/robots.txt" > "${tmp_robots}" || true

pass_fail() {
  if [[ "${1}" == "1" ]]; then
    printf 'PASS'
  else
    printf 'FAIL'
  fi
}

contains_pattern() {
  local file_path="${1}"
  local pattern="${2}"

  if grep -Eqi "${pattern}" "${file_path}"; then
    printf '1'
  else
    printf '0'
  fi
}

trim_header_value() {
  local file_path="${1}"
  local header_name="${2}"

  awk -v key="${header_name}" '
    BEGIN {
      IGNORECASE = 1
    }
    $0 ~ ("^" key ":") {
      sub(/^[^:]+:[[:space:]]*/, "", $0)
      value = $0
    }
    END {
      print value
    }
  ' "${file_path}" | tr -d '\r'
}

link_header_present="$(contains_pattern "${tmp_headers}" '^link:')"
api_catalog_present="$(contains_pattern "${tmp_headers}" 'rel="api-catalog"')"
service_desc_present="$(contains_pattern "${tmp_headers}" 'rel="service-desc"')"
markdown_content_type_present="$(contains_pattern "${tmp_markdown_headers}" '^content-type: text/markdown')"
x_markdown_tokens_present="$(contains_pattern "${tmp_markdown_headers}" '^x-markdown-tokens:')"
vary_accept_present="$(contains_pattern "${tmp_markdown_headers}" '^vary: .*accept')"
content_signal_present="$(grep -q '^Content-Signal: ai-train=no, search=yes, ai-input=no$' "${tmp_robots}" && printf '1' || printf '0')"

server_header="$(trim_header_value "${tmp_headers}" 'server')"
content_type_header="$(trim_header_value "${tmp_headers}" 'content-type')"
markdown_content_type_header="$(trim_header_value "${tmp_markdown_headers}" 'content-type')"
markdown_tokens_header="$(trim_header_value "${tmp_markdown_headers}" 'x-markdown-tokens')"
vary_header="$(trim_header_value "${tmp_markdown_headers}" 'vary')"

local_status='未執行'
if [[ "${REPORT_INCLUDE_LOCAL}" == "1" ]]; then
  if bash scripts/check-agent-http-local.sh > "${tmp_local_output}" 2>&1; then
    local_status='PASS'
  else
    local_status='FAIL'
  fi
fi

cname_records=''
ns_records=''

if command -v dig >/dev/null 2>&1; then
  cname_records="$(dig +short "${host}" CNAME | paste -sd ', ' -)"
  ns_records="$(dig +short NS "${root_domain}" | paste -sd ', ' -)"
fi

if [[ -z "${cname_records}" ]]; then
  cname_records="$(
    curl -fsS "https://dns.google/resolve?name=${host}&type=CNAME" 2>/dev/null \
      | jq -r '.Answer // [] | map(.data | sub("\\.$"; "")) | join(", ")' 2>/dev/null || true
  )"
fi

if [[ -z "${ns_records}" ]]; then
  ns_records="$(
    curl -fsS "https://dns.google/resolve?name=${root_domain}&type=NS" 2>/dev/null \
      | jq -r '.Answer // [] | map(.data | sub("\\.$"; "")) | join(", ")' 2>/dev/null || true
  )"
fi

if [[ -z "${cname_records}" ]]; then
  cname_records='查無資料'
fi

if [[ -z "${ns_records}" ]]; then
  ns_records='查無資料'
fi

origin_url="$(git config --get remote.origin.url || true)"
repo_slug=''
latest_run_url='查無資料'
latest_run_conclusion='查無資料'
cloudflare_step='查無資料'
verify_step='查無資料'

if [[ "${origin_url}" =~ github\.com[:/]([^/]+/[^/]+)(\.git)?$ ]]; then
  repo_slug="${BASH_REMATCH[1]}"
  repo_slug="${repo_slug%.git}"
fi

if [[ -n "${repo_slug}" ]]; then
  latest_run_json="$(curl -fsS "https://api.github.com/repos/${repo_slug}/actions/workflows/deploy.yml/runs?per_page=1" 2>/dev/null || true)"
  latest_run_id="$(printf '%s' "${latest_run_json}" | jq -r '.workflow_runs[0].id // empty' 2>/dev/null || true)"
  latest_run_url="$(printf '%s' "${latest_run_json}" | jq -r '.workflow_runs[0].html_url // "查無資料"' 2>/dev/null || true)"
  latest_run_conclusion="$(printf '%s' "${latest_run_json}" | jq -r '.workflow_runs[0].conclusion // .workflow_runs[0].status // "查無資料"' 2>/dev/null || true)"

  if [[ -n "${latest_run_id}" ]]; then
    latest_jobs_json="$(curl -fsS "https://api.github.com/repos/${repo_slug}/actions/runs/${latest_run_id}/jobs" 2>/dev/null || true)"
    cloudflare_step="$(
      printf '%s' "${latest_jobs_json}" \
        | jq -r '[.jobs[].steps[] | select(.name == "Deploy to Cloudflare Workers") | .conclusion][0] // "查無資料"' 2>/dev/null || true
    )"
    verify_step="$(
      printf '%s' "${latest_jobs_json}" \
        | jq -r '[.jobs[].steps[] | select(.name == "Verify agent HTTP responses") | .conclusion][0] // "查無資料"' 2>/dev/null || true
    )"
  fi
fi

if [[ -z "${latest_run_url}" ]]; then
  latest_run_url='查無資料'
fi

if [[ -z "${latest_run_conclusion}" ]]; then
  latest_run_conclusion='查無資料'
fi

root_causes=()

if [[ "${link_header_present}" == "0" || "${markdown_content_type_present}" == "0" ]]; then
  if [[ "${server_header}" == 'GitHub.com' ]]; then
    root_causes+=('正式站首頁仍直接由 GitHub Pages 回應，尚未由 Worker 接手 HTTP 回應層。')
  fi

  if [[ "${cname_records}" == *'github.io'* ]]; then
    root_causes+=("DNS 目前仍指向 GitHub Pages 目標（${cname_records}）。")
  fi

  if [[ "${cloudflare_step}" == 'skipped' ]]; then
    root_causes+=('最新 GitHub Actions 已略過 Cloudflare Worker 部署步驟。')
  fi
fi

if [[ "${#root_causes[@]}" -eq 0 ]]; then
  root_causes+=('目前未偵測到明顯的額外阻塞。若正式站仍失敗，請優先檢查 Cloudflare custom domain 與 Proxy 狀態。')
fi

overall_ok='1'
for status_value in \
  "${link_header_present}" \
  "${api_catalog_present}" \
  "${service_desc_present}" \
  "${markdown_content_type_present}" \
  "${x_markdown_tokens_present}" \
  "${vary_accept_present}" \
  "${content_signal_present}"
do
  if [[ "${status_value}" != '1' ]]; then
    overall_ok='0'
    break
  fi
done

{
  printf '# Agent HTTP 驗證報告\n\n'
  printf -- '- 目標網址：`%s`\n' "${BASE_URL}"
  printf -- '- 產生時間（台北）：`%s`\n' "${timestamp_taipei}"
  printf -- '- 產生時間（UTC）：`%s`\n' "${timestamp_utc}"
  printf -- '- 整體結果：`%s`\n' "$(pass_fail "${overall_ok}")"
  printf -- '- 本地 Worker 驗證：`%s`\n\n' "${local_status}"

  printf '## 檢查摘要\n\n'
  printf -- '- 首頁 `Link` 回應標頭：`%s`\n' "$(pass_fail "${link_header_present}")"
  printf -- '- `rel=\"api-catalog\"`：`%s`\n' "$(pass_fail "${api_catalog_present}")"
  printf -- '- `rel=\"service-desc\"`：`%s`\n' "$(pass_fail "${service_desc_present}")"
  printf -- '- `Accept: text/markdown` → `Content-Type: text/markdown`：`%s`\n' "$(pass_fail "${markdown_content_type_present}")"
  printf -- '- `x-markdown-tokens`：`%s`\n' "$(pass_fail "${x_markdown_tokens_present}")"
  printf -- '- `Vary: Accept`：`%s`\n' "$(pass_fail "${vary_accept_present}")"
  printf -- '- `robots.txt` 的 `Content-Signal`：`%s`\n\n' "$(pass_fail "${content_signal_present}")"

  printf '## 觀察值\n\n'
  printf -- '- `server`：`%s`\n' "${server_header:-查無資料}"
  printf -- '- 首頁 `content-type`：`%s`\n' "${content_type_header:-查無資料}"
  printf -- '- Markdown `content-type`：`%s`\n' "${markdown_content_type_header:-查無資料}"
  printf -- '- `x-markdown-tokens`：`%s`\n' "${markdown_tokens_header:-查無資料}"
  printf -- '- `vary`：`%s`\n' "${vary_header:-查無資料}"
  printf -- '- DNS CNAME：`%s`\n' "${cname_records}"
  printf -- '- 網域 NS：`%s`\n\n' "${ns_records}"

  printf '## GitHub Actions\n\n'
  printf -- '- 最新 workflow：`%s`\n' "${latest_run_conclusion}"
  printf -- '- 最新 workflow URL：%s\n' "${latest_run_url}"
  printf -- '- `Deploy to Cloudflare Workers`：`%s`\n' "${cloudflare_step}"
  printf -- '- `Verify agent HTTP responses`：`%s`\n\n' "${verify_step}"

  printf '## 根因判讀\n\n'
  for root_cause in "${root_causes[@]}"; do
    printf -- '- %s\n' "${root_cause}"
  done
  printf '\n'

  printf '## 首頁 HEAD 回應\n\n```http\n'
  cat "${tmp_headers}"
  printf '```\n\n'

  printf '## Markdown HEAD 回應\n\n```http\n'
  cat "${tmp_markdown_headers}"
  printf '```\n\n'

  printf '## robots.txt\n\n```txt\n'
  cat "${tmp_robots}"
  printf '\n```\n'

  if [[ "${REPORT_INCLUDE_LOCAL}" == "1" ]]; then
    printf '\n## 本地 Worker 驗證輸出\n\n```txt\n'
    cat "${tmp_local_output}"
    printf '\n```\n'
  fi
} > "${tmp_report}"

if [[ -n "${OUTPUT_FILE}" ]]; then
  cp "${tmp_report}" "${OUTPUT_FILE}"
fi

cat "${tmp_report}"
