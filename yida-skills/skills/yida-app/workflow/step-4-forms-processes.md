# Step 4：创建或更新表单/流程

按 PRD 的资源创建顺序创建或复用表单和流程。表单、流程先于自定义页面。

## 输入

- 真实 `appType`；
- `prd/<项目名>/prd.md`；
- `prd/<项目名>/design.md`；
- Step 1 解析出的 form/process context。

## 操作

1. 表单开发先执行 `use_skill("yida-form-detail", "表单视觉引导与详情页样式默认注入")`，明确填写路径、字段密度和 Divider 分组。
2. 执行 `use_skill("yida-create-form-page", "创建或更新核心表单字段结构")`，创建或更新普通表单字段结构。
3. 已有目标表单时，使用 update/patch/rule/bind-datasource。
4. 缺少支撑 MVP 的核心普通表单且允许创建时，创建普通表单。
5. 字段配置文件写入 `.cache/openyida/<项目名>/`。
6. 拿到或确认真实 `formUuid` 后，默认执行或补齐 formDetail CSS 注入；重复执行保持幂等。
7. 页面、数据、流程或公式确需多字段映射时，对每个目标表单最多一次性执行 `openyida get-schema <appType> <formUuid> --field-map-json`，合并写回 `.cache/<项目名>-schema.json`。
8. PRD 包含审批、流程、申请、审核、工单等流程对象时，执行 `use_skill("yida-create-process", "创建带审批流程表单")`。
9. 已有流程表单或 `processCode` 时，执行 `use_skill("yida-process-rule", "更新已有流程规则")`。

## 产出

- 普通表单真实 `formUuid`；
- 流程表单真实 `formUuid` / `processCode`；
- 必要 `fieldId`；
- 表单详情页 CSS 注入结果或阻塞原因。

## Checklist

- [ ] 字段结构有 Divider 分组；
- [ ] 表单/流程资源在自定义页面之前创建或确认；
- [ ] 必要 `fieldId` 已写入 `.cache/<项目名>-schema.json`；
- [ ] formDetail CSS 已注入，或已有明确阻塞原因。

## 下一步

→ [Step 5：写入初始表单数据](step-5-seed-records.md)
