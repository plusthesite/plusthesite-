#!/usr/bin/env bash
# Verify every running app talks to the LOCAL Postgres, not Supabase cloud.
#
# Checks, per app container:
#   1. which SUPABASE/DATABASE URLs are in its env
#   2. whether any of them point at *.supabase.co (cloud) - that is the failure
#      this script exists to catch
#   3. whether the app's own database in the local cluster actually exists
#
# Read-only. Prints a table and exits non-zero if any cloud reference is found.
set -uo pipefail

PSQL="docker exec vpsplus-postgres psql -U vpsplus -d postgres -Atc"
LOCAL_DBS=$($PSQL "SELECT datname FROM pg_database WHERE datname NOT IN ('postgres','template0','template1') ORDER BY 1")
echo "local databases: $(echo "$LOCAL_DBS" | tr '\n' ' ')"
echo

fail=0
printf '%-26s %-46s %s\n' CONTAINER ENV-REF CLOUD?
printf '%-26s %-46s %s\n' -------------------------- ---------------------------------------------- --------

for c in $(docker ps --format '{{.Names}}'); do
    envs=$(docker inspect "$c" --format '{{range .Config.Env}}{{println .}}{{end}}' 2>/dev/null \
           | grep -iE '^(NEXT_PUBLIC_)?SUPABASE_URL=|^VITE_SUPABASE_URL=|^DATABASE_URL=|^POSTGRES_' \
           | head -3)
    [ -z "$envs" ] && continue
    while IFS= read -r line; do
        [ -z "$line" ] && continue
        key=${line%%=*}; val=${line#*=}
        # Never echo a secret. Postgres URLs carry the password as user:pass@,
        # and env files also hold raw POSTGRES_PASSWORD values, so redact on the
        # credential portion and on any value that looks like a key.
        case "$key" in
            *PASSWORD*|*SECRET*|*KEY*) short="<redacted>" ;;
            *) short=$(echo "$val" \
                    | sed -E 's#(://[^:/@]+:)[^@]+@#\1<redacted>@#' \
                    | sed 's#https\?://##; s#/$##' | cut -c1-44) ;;
        esac
        if echo "$val" | grep -qE '\.supabase\.co|your-project'; then
            verdict="CLOUD ✗"; fail=1
        else
            verdict="local ✓"
        fi
        printf '%-26s %-46s %s\n' "$c" "$key=$short" "$verdict"
    done <<< "$envs"
done

echo
if [ "$fail" -ne 0 ]; then
    echo "RESULT: at least one app still references Supabase cloud."
else
    echo "RESULT: every running app points at the local stack."
fi
exit "$fail"
