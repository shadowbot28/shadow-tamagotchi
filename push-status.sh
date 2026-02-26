#!/bin/bash
# Push Shadow's current status to the Tamagotchi dashboard
# Usage: ./push-status.sh <json-payload>
# Example: ./push-status.sh '{"status":"working","currentTask":"Building feature X"}'

API_URL="${SHADOW_TAMAGOTCHI_URL:-https://shadow-tamagotchi.vercel.app}/api/status"
TOKEN="${SHADOW_API_TOKEN}"

if [ -z "$TOKEN" ]; then
  echo "Error: SHADOW_API_TOKEN not set"
  exit 1
fi

curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "${1:-{}}"
