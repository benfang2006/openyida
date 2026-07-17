---
name: yida-create-page
description: 在宜搭应用中创建自定义展示页面（display 类型），返回 formUuid。适用于需要新建空白自定义页面，后续编写 JSX 代码并发布。
---
# 创建自定义页面

## 严格禁止 (NEVER DO)

- 不要编造 formUuid，必须从命令返回的 JSON 中提取
- 不要用此命令创建表单页面（带字段的数据收集页），应使用 `yida-create-form-page`

## 严格要求 (MUST DO)

- **创建前必须确认**：单点创建页面时，执行创建命令前必须向用户确认页面名称和目标应用。由 `yida-app fast_build` 编排且用户已说“默认方案 / 不要追问 / 直接创建”时，合理命名并直接创建，不再二次追问。
- 创建成功后，将 formUuid 记录到 `.cache/<项目名>-schema.json`
- 创建页面后，必须继续选择一个页面实现链路编写页面源码，再用 `yida-publish-page` 发布：Code Canvas 链路用 `yida-canvas-custom-page`；普通自定义页面 JSX/Jsx 组件链路用 `yida-custom-page`
- 用户明确要求 JSX / Jsx 组件 / 普通自定义页，或页面强依赖 `this.$`、`this.utils.yida.*`、`this.dataSourceMap` 时，创建后进入 `yida-custom-page`；涉及成员、部门、附件上传或图片上传时必须读取 `component-jsx-guide.md`，上传还必须读取 `attachment-upload-guide.md`
- **本技能不读写 memory**：formUuid 等信息输出到 stdout，通过 `.cache/<项目名>-schema.json` 持久化，不依赖跨会话的 memory 状态

## 适用场景

用户需要创建"自定义展示页面"、"可视化大屏"、"自定义 UI 页面"时使用。

**关键区分**：
- 自定义展示页面（无字段，纯 JSX/React 开发）→ 本技能
- 表单页面（有字段，数据收集）→ `yida-create-form-page`

## 触发条件

**正向触发**：
- "创建自定义展示页面"、"新建可视化大屏"
- "创建自定义 UI 页面"、"新建一个页面"
- 完整应用开发流程中的页面创建步骤（由 `yida-app` 编排调用）

---


## 命令

```bash
openyida create-page <appType> <pageName> [--mode dashboard]
```

| 参数 | 必填 | 说明 |
|------|------|------|
| `appType` | 是 | 应用 ID，如 `APP_XXX` |
| `pageName` | 是 | 页面名称 |
| `--mode dashboard` | 否 | 看板/驾驶舱页面推荐使用；创建后自动隐藏顶部导航，并输出无左侧工作台栏的 `custom/{formUuid}?isRenderNav=false` URL |

## 输出

```json
{"success":true,"pageId":"FORM-XXX","pageName":"驾驶舱","appType":"APP_XXX","mode":"dashboard","chromeless":true,"url":"{base_url}/APP_XXX/custom/FORM-XXX?isRenderNav=false","workbenchUrl":"{base_url}/APP_XXX/workbench/FORM-XXX"}
```

> 创建后根据用户意图选择并列链路：Code Canvas 链路编写 `.canvas.jsx` 并发布为 `YidaCodeCanvas`；普通自定义页面 JSX/Jsx 组件链路编写 `.oyd.jsx` / `.jsx`，发布为平台 `Jsx` 组件，并执行 `openyida check-page` / `openyida compile` / `openyida publish`。
> 如果用户说的是 JSX/Jsx 组件，按 `yida-custom-page` 处理：成员/部门选择器不得编造未验证平台组件；附件/图片上传必须验证 OSS 签名、权限、预览和失败提示。
> 如需创建表单页面（带字段的数据收集页），请使用 `yida-create-form-page`。

## 异常处理

| 异常场景 | 处理方式 |
|---------|----------|
| 命令返回失败 | 检查 appType 是否正确，确认登录态有效（`openyida env`） |
| 返回 JSON 中无 pageId | 不要猜测 formUuid，重新执行命令获取 |
| 页面名称重复 | 宜搭允许同名页面，但建议使用唯一名称避免混淆 |
