# Step 3：创建或复用应用

按 Step 1 的资源上下文和 Step 2 的 PRD 确认目标应用。已有 app 直接复用；缺少 app 且允许创建时才创建。

## 输入

- Step 1 的 app resource context；
- `prd/<项目名>/prd.md`；
- `prd/<项目名>/design.md`。

## 操作

1. 已有 `appType`、应用 URL 或已绑定 app → 直接复用该 app。
2. 缺少 app 且 Step 1 判定 `allowCreate=true` → 执行 `use_skill("yida-create-app", "按 PRD 创建应用并获取 appType")`，再按 PRD 创建应用。
3. 创建或复用后提取真实 `appType`，写入 `.cache/<项目名>-schema.json` 或当前任务资源上下文。
   - Step 2 已 join 的 requirement brief、PRD 与 design 保持冻结；不得仅因拿到真实 `appType` 回写简报或重跑 artifact owner。
4. 若 PRD 和 `design.md` 都写明 `shouldPassCreateAppTheme=true`，且 `themePresetKey` 命中平台 key，创建应用时传主题；否则不传自定义主题色。
5. 已有 app 不自动改名。外部工具预创建 app 时，OpenYida 侧只复用 `appType`。

## 产出

- 真实目标 `appType`；
- app 来源：显式资源、绑定上下文、workspace cache、会话历史或本轮新建；
- 主题 key 是否已传入的结论。

## Checklist

- [ ] 已确认不会重复创建同类 app；
- [ ] 已拿到真实 `appType`；
- [ ] 已有 app 未被自动改名；
- [ ] 主题 key 只在 PRD 和 `design.md` 同时允许时传入。

## 下一步

→ [Step 4：创建或更新表单/流程](step-4-forms-processes.md)
