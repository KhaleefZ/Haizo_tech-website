#!/usr/bin/env bash
set -euo pipefail

BASE=/srv/haizotech
NEW="$BASE/releases/$REL"

ln -sfn "$BASE/shared/backend.env"  "$NEW/backend/.env"
ln -sfn "$BASE/shared/frontend.env" "$NEW/frontend/.env"

cd "$NEW/backend"
npx prisma migrate deploy

ln -sfn "$NEW" "$BASE/current"

sudo systemctl restart haizo-api
sudo systemctl restart haizo-web
sudo systemctl restart haizo-admin

cd "$BASE/releases" && ls -1t | tail -n +6 | xargs -r rm -rf
echo "deployed $REL"
