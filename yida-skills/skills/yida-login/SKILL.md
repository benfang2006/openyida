---
name: yida-login
description: 宜搭登录态管理。以 OpenYida auth snapshot 为准；默认 OAuth token，snapshot 返回 env 注入状态时使用运行环境注入 token。
---

# yida-login

## 模式

- Codex、yida-agent 等宿主都使用同一套 OpenYida auth snapshot 规则。
- 不要根据 agent 名称、宿主产品、workspace 路径或猜测的环境变量推断认证模式。
- 先读 `openyida agent-capabilities --summary-json`；只有需要更多信息时，才降级执行 `openyida login --check-only --json`。
- snapshot 返回 `login.auth_source=env` 或 `failure_reason=env_token_missing` 时，进入运行环境注入 token 模式。凭证只来自运行环境注入的 `OPENYIDA_ACCESS_TOKEN`、`OPENYIDA_REFRESH_TOKEN` 等环境变量。
- 其他 `auth_mode=token` 场景使用默认 OAuth token session。
- 不要从 `.cache/cookies*.json` 推断登录态。

## 前置检查

先执行：

```bash
openyida agent-capabilities --summary-json
```

必要时降级：

```bash
openyida env --json
openyida login --check-only --json
```

## 判断表

| 状态 | 动作 |
|---|---|
| `auth_mode=token` 且 `status=ok` 或 `can_auto_use=true` | 继续执行业务命令 |
| `auth_source=env` / `failure_reason=env_token_missing` | 进入运行环境注入 token 模式；缺 token 时停止，让 Codex、yida-agent 等宿主注入 `OPENYIDA_ACCESS_TOKEN` 或 `OPENYIDA_REFRESH_TOKEN`；不要执行 OAuth |
| `auth_mode=token`，未登录，且 snapshot 未返回 env 注入 | 执行 `openyida login`，再用 `openyida login --check-only --json` 验证 |

## Token 模式命令

只有 auth snapshot 未返回 env 注入模式时，才使用 OAuth 登录。

```bash
openyida login
openyida login --check-only --json
openyida auth status
openyida auth refresh
openyida auth logout
```

用户给出宜搭入口 URL 时，原样传入：

```bash
openyida login https://yida-group.alibaba-inc.com/
openyida login --alibaba
openyida login --intl
```

海外 / international / global / Japan / Global YiDA 使用 `--intl` 或等价入口。

## 运行环境注入 Token 模式命令

只有 auth snapshot 返回 `auth_source=env` 或 `failure_reason=env_token_missing` 后，才进入本模式。

```bash
openyida agent-capabilities --summary-json
openyida env --json
openyida login --check-only --json
openyida auth status
openyida auth refresh
```

可继续执行的结果：

```json
{
  "auth_mode": "token",
  "auth_source": "env",
  "status": "ok",
  "can_auto_use": true
}
```

如果运行环境没有注入 token，auth snapshot 会返回 `failure_reason=env_token_missing`；停止任务，让 Codex、yida-agent 等宿主补齐 token 注入，不要触发 OAuth。

## 禁止

- 不要硬编码或打印 `access_token`、`refresh_token`、Cookie 或 CSRF。
- 不要手动读写 `.env`、token 文件或 Cookie 文件。
- 运行环境注入 token 模式下，不要再执行 `openyida login` 触发 OAuth。
- 运行环境注入 token 模式下，缺 token 时让 Codex、yida-agent 等宿主修复注入，不要查找本地 `.cache/cookies*.json`。
- 不要在业务命令里手动传 Cookie、`_csrf_token` 或 Bearer token。

## 完成条件

- Login/auth snapshot 返回可用登录态；或
- 运行环境注入 token 模式返回明确停止原因，交由宿主修复。
