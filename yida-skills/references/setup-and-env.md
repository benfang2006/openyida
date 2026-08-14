# 环境准备与登录检测

## 先执行

```bash
openyida agent-capabilities --summary-json
```

必要时降级：

```bash
openyida env --json
openyida login --check-only --json
```

## 认证模式

- Codex、yida-agent 等宿主都使用同一套 OpenYida auth snapshot 规则。
- 不要根据 agent 名称、宿主产品、workspace 路径或猜测的环境变量推断认证模式。
- 先执行 `openyida agent-capabilities --summary-json`；只有简版快照不可用或信息不足时，才降级执行 `openyida login --check-only --json`。
- snapshot 返回 `login.auth_source=env` 或 `failure_reason=env_token_missing` 时，进入运行环境注入 token 模式。凭证只来自运行环境注入的 `OPENYIDA_ACCESS_TOKEN`、`OPENYIDA_REFRESH_TOKEN` 等环境变量。
- 其他 `login.auth_mode=token` 场景使用默认 OAuth token session。
- 不要从 `.cache/cookies*.json` 推断登录态。

## 判断表

| Snapshot | 下一步 |
|---|---|
| command not found | 安装或更新 `openyida`；不要创建资源 |
| `workdir_exists=false` 或 `active.projectRootExists=false` | 先执行 `openyida copy`；工作目录存在前不要创建资源 |
| `auth_mode=token` 且 `status=ok` 或 `can_auto_use=true` | 继续执行 |
| snapshot 返回 `auth_source=env` / `failure_reason=env_token_missing` | 进入运行环境注入 token 模式；缺 token 时停止，让 Codex、yida-agent 等宿主注入 `OPENYIDA_ACCESS_TOKEN` 或 `OPENYIDA_REFRESH_TOKEN`；不要执行 OAuth |
| `auth_mode=token`，未登录，且 snapshot 未返回 env 注入 | 执行 `openyida login`；再用 `openyida login --check-only --json` 验证 |
| `auth_mode=token`，access token 过期 | 执行 `openyida auth refresh`；仍失败且 snapshot 未返回 env 注入时，再执行 `openyida login` |

## Token 模式命令

只有 auth snapshot 未返回 env 注入模式时，才使用 OAuth 登录。

```bash
openyida login
openyida login --check-only --json
openyida auth status
openyida auth refresh
openyida auth logout
```

用户给出目标入口 URL 或环境时，原样传入：

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

如果运行环境没有注入 token，snapshot 会返回 `failure_reason=env_token_missing`；停止任务，让 Codex、yida-agent 等宿主补齐 token 注入。snapshot 已进入运行环境注入 token 模式后，不要再执行 `openyida login`。

## 禁止

- snapshot 已进入运行环境注入 token 模式后，不要执行 `openyida login`。
- 不要读取 `.cache/cookies*.json` 作为登录态。
- 不要要求用户导出浏览器 Cookie。
- 不要打印 Cookie、CSRF、`access_token` 或 `refresh_token`。
