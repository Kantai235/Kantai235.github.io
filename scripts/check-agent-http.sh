#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${1:-https://blog.init.engineer}"

tmp_headers="$(mktemp)"
tmp_markdown_headers="$(mktemp)"
tmp_robots="$(mktemp)"

cleanup() {
  rm -f "${tmp_headers}" "${tmp_markdown_headers}" "${tmp_robots}"
}

trap cleanup EXIT

curl -sSI -D "${tmp_headers}" -o /dev/null "${BASE_URL}/"
curl -sSI -D "${tmp_markdown_headers}" -H 'Accept: text/markdown' -o /dev/null "${BASE_URL}/"
curl -sS "${BASE_URL}/robots.txt" > "${tmp_robots}"

echo "檢查首頁 Link 回應標頭..."
if ! grep -qi '^link:' "${tmp_headers}"; then
  echo "失敗：首頁沒有 Link 回應標頭。" >&2
  exit 1
fi

if ! grep -qi 'rel="api-catalog"' "${tmp_headers}"; then
  echo "失敗：首頁 Link 標頭缺少 api-catalog relation。" >&2
  exit 1
fi

if ! grep -qi 'rel="service-desc"' "${tmp_headers}"; then
  echo "失敗：首頁 Link 標頭缺少 service-desc relation。" >&2
  exit 1
fi

echo "檢查 Markdown for Agents 回應..."
if ! grep -qi '^content-type: text/markdown' "${tmp_markdown_headers}"; then
  echo "失敗：Accept: text/markdown 時未回傳 text/markdown。" >&2
  exit 1
fi

if ! grep -qi '^x-markdown-tokens:' "${tmp_markdown_headers}"; then
  echo "失敗：Accept: text/markdown 時缺少 x-markdown-tokens。" >&2
  exit 1
fi

if ! grep -qi '^vary: .*accept' "${tmp_markdown_headers}"; then
  echo "失敗：Accept: text/markdown 時缺少 Vary: Accept。" >&2
  exit 1
fi

echo "檢查 robots.txt Content-Signal..."
if ! grep -q '^Content-Signal: ai-train=no, search=yes, ai-input=no$' "${tmp_robots}"; then
  echo "失敗：robots.txt 缺少正確的 Content-Signal。" >&2
  echo "目前 robots.txt 內容：" >&2
  cat "${tmp_robots}" >&2
  exit 1
fi

echo "Agent HTTP 檢查通過：${BASE_URL}"
