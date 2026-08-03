---
name: yida-form-detail
description: >
  表单页视觉引导与表单详情页 formDetail 样式优化。表单页开发默认加载本技能做视觉引导，合并 Divider 分割线语义分组；需要落地详情页样式时，通过 Schema 注入 Html 组件承载 CSS，实现卡片化布局、字段视觉美化、评论区与操作栏调整。
license: MIT
compatibility:
  - opencode
  - claude-code
  - qoder
  - wukong
metadata:
  audience: developers
  workflow: yida-development
  version: 1.4.0
  tags:
    - yida
    - low-code
    - form-detail
    - css
    - style
---

# 宜搭表单页视觉引导与详情页样式优化

## 目标

为宜搭表单页开发提供默认视觉引导，并在需要时优化 `formDetail` 的默认视觉效果。

- 表单字段结构阶段：输出表单视觉引导，要求用 `Divider` 做语义分组，字段密度、分组标题、局部多列和说明字段都服务于真实业务填写路径。
- 表单详情页样式阶段：覆盖页头、详情区域、评论区、底部操作栏和字段预览块。默认方案使用 20px 圆角卡片、12px 页面间距、1440px 最大宽度、字段值标注块和胶囊操作栏。

## 何时使用

- 表单页开发默认加载本技能作为视觉引导：创建表单、更新表单结构、设计字段分组、设计流程表单字段时都适用。
- 用户说“表单详情页美化”“详情页优化”“formDetail 样式”“字段详情页不好看”。
- 新建应用包含表单，且用户希望统一详情页风格。
- 只调整表单详情页，不改自定义展示页面、不改数据记录。

## 不要这样做

- 不要把 CSS 写到表单页面 JS 的 `didMount`，`formDetail` 不执行这类页面 JS。
- 不要用 `RichTextField` 承载样式，设计器可能提示组件未找到。
- 不要把承载 CSS 的 Html 组件设为 `hidden: true`，否则 `<style>` 不会进入 DOM。
- 不要用 `openyida publish` 发布这个样式；它不是自定义页面源码。
- 不要编造 `appType`、`formUuid` 或 `fieldId`。缺失时先从命令输出、缓存或 `openyida get-schema` 获取。
- 作为表单视觉引导加载时，不要直接注入 formDetail CSS；只有已拿到目标 `formUuid`，且当前阶段要统一详情页样式或用户明确要求详情页美化时，才执行 Schema 注入。
- 不要用 `GroupContainer` / `PageSection` 代替普通业务分组；表单页视觉引导必须合并 `Divider` 分割线规则。

## 表单视觉引导（默认）

表单页开发时，先输出一段简短决策，再交给 `yida-create-form-page` 落地字段 JSON：

```markdown
### 【表单视觉引导】
- 表单场景：<普通表单 / 流程表单 / 数据维护表 / 申请表>
- 填写路径：<用户按什么顺序完成填写>
- 分组结构：<每个分组名称；每组开头必须用 Divider，包括第一组>
- Divider 策略：<默认 bold-with-thin；同一张表单保持同一种 dividerType；标题跟随应用主题>
- 字段密度：<单列为主；短字段成对时局部 ColumnContainer>
- 详情页策略：<仅视觉引导 / 需要后续注入 formDetail CSS>
```

视觉引导阶段的 `Divider` 规则必须和 `yida-create-form-page` 合并执行：字段较多时每个语义分组开头都放 `Divider`，第一个分组也要放；`Divider` 不放在字段列表末尾；普通业务分组不使用 `GroupContainer` / `PageSection`。

## 推荐方案

### 表单结构视觉引导

由 `yida-form-detail` 决定分组、密度、Divider 策略和详情页是否需要后续统一样式；由 `yida-create-form-page` 写入结构化字段 JSON 并执行 `openyida create-form create/update/...`。

### formDetail 样式注入

通过表单 Schema 在 `FormContainer` 首位注入或更新一个宜搭原生 `Html` 组件：

- 组件 id 固定为 `yida-form-detail-css-html`，便于幂等更新。
- `props.content` 写入 `<style>...</style>`。
- `props.__style__` 使用 `height: 0px`、`overflow: hidden`，避免占用页面空间。
- `hidden` 必须为 `false`，`isLocked` 建议为 `true`。
- 同步写入 `root.css` 作为兜底，但以 Html 组件为主要持久化方式。

完整步骤见 [注入流程](references/injection-guide.md)。完整默认 CSS 见 [默认样式](references/form-detail-css.md)。

## 执行流程

1. 确认当前登录态和组织：
   ```bash
   openyida env --json
   openyida login --check-only --json
   ```
2. 确认目标 `appType` 与表单 `formUuid`。如果用户只给了表单名，先用应用表单列表或 `openyida get-schema <appType> --all` 辅助定位。
3. 读取 [注入流程](references/injection-guide.md)，按步骤获取 Schema、注入 Html 组件、保存 Schema、刷新 `MINI_RESOURCE`。
4. 需要改色、改圆角或只优化局部时，读取 [默认样式](references/form-detail-css.md)，只调整对应变量或 CSS 分区。
5. 保存后再次获取 Schema，确认 `yida-form-detail-css-html` 存在，且 `props.content` 包含 `yida-form-detail` 版本注释。

## 决策规则

- 创建或更新表单结构：默认加载本技能做视觉引导，必须合并 Divider 分割线分组；不默认注入 CSS。
- 用户要求完整美化：使用默认 CSS 全量注入。
- 用户只要求某一区域：从默认 CSS 中截取对应分区，仍用同一个 Html 组件承载。
- 用户有品牌色：优先改 CSS 顶部变量，不要大面积改选择器。
- 新建应用完成后如包含表单：表单结构阶段已默认使用视觉引导；是否额外注入表单详情页优化样式，按用户要求或交付模式决定。

## 后续可 CLI 化

如果后续要把该技能变成确定性命令，建议新增：

```bash
openyida form-detail-style apply <appType> <formUuid> [--css file] [--preset clean-card]
openyida form-detail-style remove <appType> <formUuid>
openyida form-detail-style check <appType> <formUuid>
```

命令实现应复用本技能的 Html 组件 id、CSS marker 和保存/刷新流程。
