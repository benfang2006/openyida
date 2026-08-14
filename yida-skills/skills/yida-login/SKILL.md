---
name: yida-login
description: 宜搭登录态管理。以 OpenYida auth snapshot 为准；默认 OAuth token，snapshot 返回 env 注入状态时使用运行环境注入 token。
---

# yida-login

## Mode

- Do not infer auth mode from agent name, runtime product, workspace path, or a guessed environment variable.
- First read `openyida agent-capabilities --summary-json`; fallback to `openyida login --check-only --json` only when needed.
- If the snapshot reports `login.auth_source=env` or `failure_reason=env_token_missing`, treat it as runtime-environment injected token mode. The only credential sources are runtime-environment injected token env such as `OPENYIDA_ACCESS_TOKEN` and `OPENYIDA_REFRESH_TOKEN`.
- Otherwise, `auth_mode=token` uses the default OAuth token session flow.
- NEVER infer auth from `.cache/cookies*.json`.

## Preflight

Run first:

```bash
openyida agent-capabilities --summary-json
```

Fallback only when needed:

```bash
openyida env --json
openyida login --check-only --json
```

## Decision Table

| Observed status | Action |
|---|---|
| `auth_mode=token`, `status=ok` or `can_auto_use=true` | Continue business command |
| `auth_source=env` / `failure_reason=env_token_missing` | Treat as runtime-environment injected token mode; if token is missing, STOP and ask the runtime environment to inject `OPENYIDA_ACCESS_TOKEN` or `OPENYIDA_REFRESH_TOKEN`; do not OAuth |
| `auth_mode=token`, not logged in, and snapshot does not report env injection | Run `openyida login`, wait for that command to finish, and use its final JSON result |

## Token Mode Commands

Use OAuth login only when the auth snapshot does not report env injection.

```bash
openyida login
openyida login --check-only --json
openyida auth status
openyida auth refresh
openyida auth logout
```

## Agent OAuth Login Orchestration

Default flow:

1. Run `openyida login` once and keep waiting for that same command.
2. The CLI opens the system browser by default. The agent MUST NOT extract the authorization URL and open it again.
3. User authorization may take time. A quiet login process is expected to wait for up to about 5 minutes.
4. Treat login as successful only after the original command exits successfully and its final JSON reports `ok=true` and `can_auto_use=true`.
5. If the user closes the browser without authorizing, the CLI cannot reliably detect that window close. Keep waiting for the original command until the user stops it or it times out; do not start another login automatically.

If the caller must control the browser, explicitly disable CLI auto-open:

```bash
openyida login --no-browser
# Compatibility form:
OPENYIDA_NO_BROWSER=1 openyida login
```

Only in this mode may the agent open the emitted authorization URL, and it must open it once. `--quiet` controls text output only; it does not control browser ownership.

`openyida login --check-only --json` is for recovery or defensive verification. Do not use fixed sleeps or repeated `check-only` commands as the default completion mechanism.

If user gives a Yida entry URL, pass it through:

```bash
openyida login https://yida-group.alibaba-inc.com/
openyida login --alibaba
openyida login --intl
```

Overseas / international / global / Japan / Global YiDA => add `--intl` or equivalent.

## Runtime-Environment Injected Token Mode Commands

Use only after the auth snapshot reports `auth_source=env` or `failure_reason=env_token_missing`.

```bash
openyida agent-capabilities --summary-json
openyida env --json
openyida login --check-only --json
openyida auth status
openyida auth refresh
```

Expected usable compact shape:

```json
{
  "auth_mode": "token",
  "auth_source": "env",
  "status": "ok",
  "can_auto_use": true
}
```

If the runtime environment did not inject token env, the auth snapshot reports `failure_reason=env_token_missing`; stop and go back to that runtime environment instead of launching OAuth.

## NEVER

- Never hardcode or print `access_token`, `refresh_token`, Cookie, or CSRF.
- Never read/write `.env`, token files, or Cookie files manually.
- In runtime-environment injected token mode: 不要再执行 `openyida login` 触发 OAuth.
- In runtime-environment injected token mode: 缺 token 时回到运行环境修复注入，不要查找本地 `.cache/cookies*.json`.
- Do not pass Cookie, `_csrf_token`, or Bearer token manually in business commands.
- Do not background `openyida login`, extract its URL, and run `open` again in the default mode.
- Do not use a fixed `sleep` before checking login status.
- Do not treat browser close or OAuth callback receipt alone as final login success.

## Done

- Login/auth snapshot reports usable auth, or
- Runtime-environment injected token mode reports a clear stop reason for the runtime environment to fix.
