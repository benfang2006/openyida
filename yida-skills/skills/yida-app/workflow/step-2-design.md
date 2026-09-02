# Step 2：并行生成 PRD 与视觉设计

完整应用使用一个共享需求简报和两个独立 artifact owner。`yida-app` 是 join owner，不直接代写 PRD 或视觉设计。

## 2.1 共享输入

执行 `use_skill("yida-requirement-analysis", "生成完整应用共享需求简报")`，写入：

- `.cache/openyida/<项目名>/requirement-brief.json`

文件存在、可解析且没有会改变资源范围的未决问题后，需求简报进入 ready。

需求简报进入 ready 后即作为本轮 artifact 的冻结输入。后续资源创建产生的 `appType`、`formUuid`、`fieldId` 等真实 ID 只写入 schema 或当前任务资源上下文，不回写简报，也不因此重跑两个 artifact owner；只有用户需求或已确认资源范围发生实质变化时，才重新生成简报和 artifact。

## 2.2 并行 artifact

共享简报 ready 后，同时启动：

| artifact | owner skill | 输出 | end 条件 |
| --- | --- | --- | --- |
| Product PRD | `yida-prd` | `prd/<项目名>/prd.md` | 资源蓝图、资源创建顺序、页面实现交付顺序、导航顺序、页面 handoff 和验收标准完整 |
| Visual Design | `yida-design` | `prd/<项目名>/design.md` | 主题 token、视觉 DNA、布局、材质、圆角、密度、组件、状态、响应式和页面场景引用完整 |

两个 owner 读取同一份需求简报，互不等待、互不写对方产物。一个 artifact 失败时只重跑其 owner，不覆盖已经 ready 的另一个 artifact。

## 2.3 join

`yida-app` 必须等待两个 artifact 都结束，再执行 join 校验：

- 两个文件路径存在且非空；
- PRD 每个 display 页面的 `designFile` 指向当前 `design.md`；
- PRD 的 `designRefs` 在 `design.md` 中可定位；
- 页面场景、主题摘要和 `explicitScope` 没有冲突；
- 冲突时业务范围交给 `yida-prd` 修正，视觉规则交给 `yida-design` 修正，不由 `yida-app` 猜测覆盖。

join 未通过时 Step 2 未完成，不得进入资源创建。join 通过后，`prd.md` 和 `design.md` 是后续页面实现的两份唯一事实源；`page-spec.json` 仅为派生 handoff。

## 主题 key

只有 PRD 摘要和 `design.md` 都写明 `shouldPassCreateAppTheme=true`，且 `themePresetKey` 命中平台 key 时，才传给 `create-app/update-app --theme`。

## 下一步

→ [Step 3：创建或复用应用](step-3-create-or-reuse-app.md)
