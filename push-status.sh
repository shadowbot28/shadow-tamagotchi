#!/bin/bash
# Push Shadow's current status to the Tamagotchi dashboard via PartyKit
# Usage: ./push-status.sh '<json>'
# Example: ./push-status.sh '{"status":"working","currentTask":"Building feature X"}'

PARTY_HOST="${PARTY_HOST:-shadow-tamagotchi.shadowbot28.partykit.dev}"
ROOM="main"
TOKEN="${SHADOW_API_TOKEN}"

if [ -z "$TOKEN" ]; then
  echo "Error: SHADOW_API_TOKEN not set"
  exit 1
fi

curl -s -X POST "https://${PARTY_HOST}/party/${ROOM}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "${1:-{}}"
