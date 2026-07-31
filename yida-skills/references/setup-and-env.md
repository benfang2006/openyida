# setup-and-env

## Run First

```bash
openyida agent-capabilities --summary-json
```

Fallback:

```bash
openyida env --json
openyida login --check-only --json
```

## Auth Mode

- Do not infer auth mode from tool name, runtime product, workspace path, or a guessed environment variable.
- First use `openyida agent-capabilities --summary-json`; fallback to `openyida login --check-only --json` only when the compact preflight result is unavailable or insufficient.
- If the preflight result reports `login.auth_source=env` or `failure_reason=env_token_missing`, treat it as external-injected token mode; the runtime environment must provide token env such as `OPENYIDA_ACCESS_TOKEN` or `OPENYIDA_REFRESH_TOKEN`.
- Otherwise, `login.auth_mode=token` uses the default OAuth token session flow.
- NEVER infer auth from `.cache/cookies*.json`.

## Decision Table

| Preflight result | Next action |
|---|---|
| command not found | install/update `openyida`; do not create resources |
| `workdir_exists=false` or `active.projectRootExists=false` | run `openyida copy`; do not create resources before workspace exists |
| `auth_mode=token`, `status=ok` or `can_auto_use=true` | continue |
| preflight result reports `auth_source=env` / `failure_reason=env_token_missing` | Treat as external-injected token mode; if token is missing, STOP and ask the runtime environment to inject `OPENYIDA_ACCESS_TOKEN` or `OPENYIDA_REFRESH_TOKEN`; do not run OAuth |
| `auth_mode=token`, not logged in, and the preflight result does not report env injection | run `openyida login`; verify with `openyida login --check-only --json` |
| `auth_mode=token`, access token expired | run `openyida auth refresh`; if still failed and the preflight result does not report env injection, run `openyida login` |

## Token Mode Commands

Use OAuth login only when the auth preflight result does not report env injection.

```bash
openyida login
openyida login --check-only --json
openyida auth status
openyida auth refresh
openyida auth logout
```

If user gives target entry URL or environment:

```bash
openyida login https://yida-group.alibaba-inc.com/
openyida login --alibaba
openyida login --intl
```

Overseas / international / global / Japan / Global YiDA => add `--intl` or equivalent.

## External-Injected Token Mode Commands

Use only after the auth preflight result reports `auth_source=env` or `failure_reason=env_token_missing`.

```bash
openyida agent-capabilities --summary-json
openyida env --json
openyida login --check-only --json
openyida auth status
openyida auth refresh
```

Allowed result:

```json
{
  "auth_mode": "token",
  "auth_source": "env",
  "status": "ok",
  "can_auto_use": true
}
```

If the runtime environment did not inject token env, the preflight result includes `failure_reason=env_token_missing`; stop the task and go back to that environment. Do not launch OAuth from this mode.

## NEVER

- Never run `openyida login` after the preflight result reports external-injected token mode.
- Never read `.cache/cookies*.json` as injected auth.
- Never ask the user to export browser Cookie.
- Never print Cookie, CSRF, `access_token`, or `refresh_token`.

## Wukong / Codex

- Same auth mode rules as above.
- Do not special-case Wukong, Codex, or any runtime identity into an auth branch; follow the OpenYida auth preflight result.
- Do not create app/page/form/publish until the auth preflight result is usable.
