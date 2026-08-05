# yida-app 执行编排参考

本文件只记录完整应用落地过程中的执行细节。需求分析、产品设计、数据结构、页面布局、应用主题色/风格摘要和验收标准由 `yida-design` 输出到 `prd/<项目名>/prd.md`；完整 UI 设计规范、主题 token、布局密度、组件和状态规则输出到 `prd/<项目名>/design.md`。

## PRD 输入

`yida-app` 开始创建或补齐应用资源前，必须已经拿到 `yida-design` 输出的 `prd/<项目名>/prd.md` 和 `prd/<项目名>/design.md`。已有 app/page/form/process 只作为上下文复用；缺失资源按 PRD 的资源创建顺序落地，页面视觉按 design.md 落地。

| 产物 | 用途 |
| --- | --- |
| PRD | 描述应用基本信息、应用配置、数据结构、页面与功能、业务逻辑、交互状态、资源蓝图、资源创建顺序、页面实现交付顺序、导航顺序和验收标准 |
| design.md | 描述主题 token、视觉 DNA、布局密度、场景配方、组件规则、状态规则和页面视觉验收 |

PRD 记录应用级运行上下文 `appType/corpId/baseUrl`；`formUuid`、`fieldId`、`pageId` 等细节 ID 写入 `.cache/<项目名>-schema.json`。页面实现阶段读取 PRD 的业务输入，并直接读取 design.md 的主题、布局、材质、组件和状态规则；走生成器时再派生 `page-spec.json`，手写时直接按 PRD + design.md 实现。

## 字段文件示例

字段配置文件写到 `.cache/openyida/<项目名>/xxx-fields.json`，从 workspace 根执行时传 `project/.cache/openyida/<项目名>/xxx-fields.json`。

```json
[
  { "type": "TextField", "label": "访客姓名", "required": true },
  { "type": "PhoneField", "label": "联系电话" },
  { "type": "DateField", "label": "到访时间" },
  { "type": "SelectField", "label": "访问状态", "options": ["预约中", "已到访", "已离开"] }
]
```

创建后把返回 ID 汇总到：

```json
{
  "appType": "APP_XXXXXX",
  "pages": {
    "访客登记表": {
      "formUuid": "FORM-XXXXXX",
      "fields": {
        "访客姓名": "textField_xxxxxxxx"
      }
    },
    "访客工作台": {
      "formUuid": "FORM-YYYYYY"
    }
  }
}
```

## 页面链路选择

- 默认使用 `yida-canvas-custom-page`：现代 React 交互、hooks、图表、工作台、看板、列表、详情、官网、门户壳等面向用户页面。
- 仅当强依赖原生实例数据桥时使用 `yida-custom-page`：`this.$(fieldId)`、`this.utils.yida.*`、`dataSourceMap`、提交流程或设计器数据源深度耦合。
- PRD 中的资源蓝图、页面与功能设计、交互状态、页面实现交付顺序、各页面布局和主题风格摘要，必须进入 `page-spec.json` 或页面实现备注。design.md 中的主题 token、完整 UI 设计、组件和状态规则由页面实现阶段重新读取，不复制进 `page-spec.json`。`page-spec.json` 必须标记 `sourceOfTruth`；与 PRD/design.md 冲突时重生成 spec。生成源码后发现业务事实缺失时回写 `prd.md`，发现视觉事实缺失时回写 `design.md`；只有实现偏差才小范围 patch 源码。
- 示例数据、截图验收、公开访问、数据源深接和精细导航分组只在用户明确要求或 PRD 验收标准命中时追加。

## 常用 URL

| 页面类型 | URL 格式 |
|---------|---------|
| 应用首页 | `{base_url}/{appType}/workbench` |
| 表单提交页（默认隐藏导航） | `{base_url}/{appType}/submission/{formUuid}?isRenderNav=false` |
| 自定义页面 | `{base_url}/{appType}/custom/{formUuid}` |
| 自定义页面隐藏导航 | `{base_url}/{appType}/custom/{formUuid}?isRenderNav=false` |
| 表单详情页 | `{base_url}/{appType}/formDetail/{formUuid}?formInstId={formInstId}` |

建议在链接末尾拼接 `corpid={corpId}`，便于切换到正确组织。

## 典型执行顺序

### 访客系统

1. 解析资源上下文，读取 `yida-design` 的 `prd.md` 与 `design.md`，明确访客登记表、访问记录表、访客工作台布局和页面视觉契约。
2. 创建或复用应用，拿到 `appType`。
3. 创建访客登记表、访问记录表。
4. 创建访客工作台页面。
5. 生成主页面，展示今日预约、待确认、最近访问记录、登记入口和空态。
6. 发布页面并按 PRD 导航顺序做轻量排序。
7. 输出一个主访问链接；用户要求演示时再写入少量示例访客记录。

### CRM 系统

1. 解析资源上下文，读取 `yida-design` 的 `prd.md` 与 `design.md`，明确客户信息表、跟进记录表、首页布局、详情下钻和页面视觉契约。
2. 创建或复用应用。
3. 创建客户信息表、跟进记录表。
4. 若产品设计包含审批节点，再创建流程表单。
5. 创建 CRM 首页并发布，按 PRD 导航顺序做轻量排序。
6. 用户要求报表或示例数据时，再追加对应资源。

### 数据大屏

1. 解析资源上下文，读取 `yida-design` 的 `prd.md` 与 `design.md`，明确大屏指标、数据对象、页面布局和主题强度。
2. 创建或复用应用。
3. 创建数据录入表单或报表数据源。
4. 创建 Canvas 大屏页面或 ECharts 页面。
5. 发布页面，按 PRD 导航顺序做轻量排序，并输出 URL。

## 可选示例数据规则

只有用户明确要求演示数据、可点验收或 PRD 验收标准要求示例数据时写入。

- 每个核心表单 2-3 条即可。
- `DateField` / `CascadeDateField` 使用 13 位毫秒时间戳。
- 写入后执行 query 抽查至少 1 条，确认 `formData` 非空。
- 用户说不要 mock / 不要示例数据时跳过。

## 删除应用确认

删除应用不可逆。执行前必须展示应用名称、应用 ID、影响范围，并等待用户回复“确认删除”或同等明确确认；模糊回复不能执行。

## 故障处理

| 场景 | 处理 |
|------|------|
| 发布提示登录失效 | 重新登录后再发布，不无修改重试 |
| corpId 不一致 | 询问重新登录或当前组织继续 |
| 不知道字段 ID | 使用 `yida-get-schema` 或 `.cache/<项目名>-schema.json` |
| Babel/页面校验失败 | 依据报错修 JSX，再重新校验 |
| 创建应用/表单失败 | 检查登录态、组织、参数、输入文件 |
