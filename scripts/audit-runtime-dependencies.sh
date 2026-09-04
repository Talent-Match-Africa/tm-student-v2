#!/usr/bin/env bash
#
# Audits production dependencies and blocks high or critical advisories.
#
# The npm advisory endpoint is an external service that occasionally returns
# 5xx or stops responding entirely. A registry outage is not a security
# finding, so it must not fail the quality gate and block a production
# migration. This script separates the two outcomes: real advisories always
# fail, transient endpoint errors are retried and then reported as a warning.
#
# npm applies no deadline of its own, so a hung endpoint would otherwise stall
# the job until the workflow timeout. Every attempt is bounded, which caps the
# whole step at roughly ATTEMPTS * TIMEOUT_SECONDS plus backoff.

set -euo pipefail

readonly ATTEMPTS=3
readonly BACKOFF_SECONDS=15
readonly TIMEOUT_SECONDS=120
# GNU coreutils `timeout` reports this when it kills the command.
readonly TIMEOUT_EXIT=124

# Declared by the workflow so the deployment CI policy can verify the audited
# command. The default keeps the script correct when run by hand.
readonly AUDIT_COMMAND="${AUDIT_COMMAND:-npm audit --omit=dev --audit-level=high}"

# Emitted by npm when the advisory endpoint, not the dependency tree, is at
# fault. Matched case-insensitively against the captured output.
readonly ENDPOINT_ERROR_PATTERN='audit endpoint returned an error|Service Unavailable|ETIMEDOUT|ECONNRESET|ENOTFOUND|EAI_AGAIN|socket hang up|502 Bad Gateway|504 Gateway'

# CI runners provide GNU coreutils. Developer machines may not, so fall back to
# an unbounded run rather than refusing to audit at all.
timeout_command=()
if command -v timeout >/dev/null 2>&1; then
  timeout_command=(timeout "${TIMEOUT_SECONDS}")
elif command -v gtimeout >/dev/null 2>&1; then
  timeout_command=(gtimeout "${TIMEOUT_SECONDS}")
else
  echo "No timeout command available; running the audit without a deadline."
fi

output=""
status=0

for attempt in $(seq 1 "${ATTEMPTS}"); do
  set +e
  # Intentionally unquoted: the command is a fixed, repository-controlled
  # string that must be split into arguments.
  # shellcheck disable=SC2086
  # The ${a[@]+"${a[@]}"} form keeps an empty array safe under `set -u`.
  output="$(${timeout_command[@]+"${timeout_command[@]}"} ${AUDIT_COMMAND} 2>&1)"
  status=$?
  set -e

  printf '%s\n' "${output}"

  if test "${status}" -eq 0; then
    exit 0
  fi

  if test "${status}" -eq "${TIMEOUT_EXIT}"; then
    echo "Advisory endpoint did not respond within ${TIMEOUT_SECONDS}s."
  elif ! printf '%s' "${output}" | grep -Eqi "${ENDPOINT_ERROR_PATTERN}"; then
    # npm reached the endpoint and reported advisories. This is a real finding.
    echo "::error::High or critical advisories found in runtime dependencies."
    exit "${status}"
  fi

  if test "${attempt}" -lt "${ATTEMPTS}"; then
    echo "Advisory endpoint unavailable. Retrying in ${BACKOFF_SECONDS}s" \
      "(attempt ${attempt} of ${ATTEMPTS})."
    sleep "${BACKOFF_SECONDS}"
  fi
done

echo "::warning::Dependency audit skipped: the npm advisory endpoint was" \
  "unavailable after ${ATTEMPTS} attempts. Runtime dependencies were not" \
  "verified for this run."
exit 0
