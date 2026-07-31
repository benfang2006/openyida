# Code Canvas 组件库选型

Code Canvas 页面从 [dependencies-and-cdn.md](dependencies-and-cdn.md) 的可用前端资源中选择组件库。资源版本、import 写法和运行时加载方式以资源清单为准；页面选型按下列组合落地。

## 推荐组合

| 场景 | 推荐库 | 何时使用 | 使用要点 |
| --- | --- | --- | --- |
| B 端业务界面 | `antd` | 表格、表单控件、按钮、弹窗、Tabs、Tag、Dropdown、分页 | 最外层包 `ConfigProvider`，主色用 `readBrandColor` 注入；资源加载交给 Code Canvas runtime |
| 图表看板 | `recharts` | 折线、柱状、面积、饼图、简单仪表盘 | 容器必须有稳定高度；颜色用品牌色和语义色，不硬编码默认蓝 |
| 复杂可视化 | `d3` | 自定义关系图、力导向、桑基、特殊坐标系 | 只在 Recharts 覆盖不了时使用；自己管理 DOM/cleanup |
| 图标 | 内联 SVG 语义集 | 按钮、操作、状态、导航等功能性图标 | 默认选择，零依赖、运行稳定 |
| 交互动效 | `framer-motion` | 抽屉、轻量过渡、局部状态切换 | B 端页面使用克制、局部、服务状态理解的动效 |
| Hooks 工具 | `ahooks` | 防抖、请求状态、定时器、列表状态等 | 用来简化状态逻辑；数据读写仍走明确数据桥 |
| 轻量主题组件 | `@radix-ui/themes` | 需要更原子化、更少 antd 味的按钮、卡片、布局控件 | 与 antd 混用时要统一圆角、字体、色彩和弹层层级 |
| Markdown 展示 | `yida-plugin-markdown` | PRD、公告、帮助文档、AI 输出内容展示 | 用于展示可信 Markdown 内容；用户输入内容先清洗再展示 |

## 默认选型规则

1. **普通业务页默认 `antd + ahooks + 内联 SVG 图标`**：这是最稳的 B 端组合，适合列表、工作台、详情、审批辅助页。
2. **看板默认 `antd + recharts + ahooks + 内联 SVG 图标`**：KPI、筛选、图表和明细表都能覆盖；只有 Recharts 做不了的图才引入 `d3`。
3. **需要去 antd 味时，少量使用 `@radix-ui/themes`**：适合展示页、门户页、较轻的工具页；同一页面选一个主视觉语言，另一套组件只做局部补充。
4. **动效服务状态反馈**：`framer-motion` 用在抽屉、折叠、局部切换，服务用户理解状态变化。
5. **图标只作功能用途**：默认内联 SVG；需要统一开源图标库时按下方 `lucide-react` 用法引入。

## lucide-react 用法

Code Canvas 支持在页面源码中使用 `lucide-react`。从常用图标列表里选择具体组件，用 named import 引入：

```jsx
import { Search, RefreshCw, ChevronDown, Settings, Plus } from 'lucide-react';

function Toolbar() {
  return (
    <div>
      <Search size={16} />
      <RefreshCw size={16} />
      <ChevronDown size={16} />
      <Settings size={16} />
      <Plus size={16} />
    </div>
  );
}
```

图标名称来自数据或配置时，在页面内写映射表，映射值仍然是 named import 得到的组件：

```jsx
import { AlertCircle, Check, Clock, Search } from 'lucide-react';

const ICONS = {
  alert: AlertCircle,
  check: Check,
  clock: Clock,
  search: Search,
};

function StatusIcon(props) {
  const Icon = ICONS[props.type] || Search;
  return <Icon size={16} />;
}
```

常用图标可以选：`Search`、`RefreshCw`、`ChevronDown`、`ChevronUp`、`Settings`、`Plus`、`Download`、`Upload`、`Edit3`、`Trash2`、`Eye`、`Calendar`、`Clock`、`User`、`Users`、`Building2`、`FileText`、`Check`、`X`、`AlertCircle`、`Info`、`BarChart3`、`TrendingUp`。

## 生成页面时的组合示例

| 页面类型 | 推荐组合 |
| --- | --- |
| 工作台 / 门户 | `antd` + `ahooks` + 内联 SVG，需要轻动效时加 `framer-motion` |
| 数据看板 / 驾驶舱 | `antd` + `recharts` + `ahooks` + 内联 SVG，复杂图再加 `d3` |
| 列表 / 管理页 | `antd` + `ahooks` + 内联 SVG |
| 详情 / 展示页 | `antd` 或 `@radix-ui/themes` + 内联 SVG，时间线/折叠区域可少量动效 |

可直接输出推荐组合示例：

```bash
openyida sample yida-canvas-custom-page dashboard-starter --output project/pages/src/dashboard-starter.canvas.jsx
node -e "const fs=require('fs'); const {compileCanvasLocal}=require('./lib/app/canvas-compile'); const src=fs.readFileSync('project/pages/src/dashboard-starter.canvas.jsx','utf8'); console.log(compileCanvasLocal(src).importedModules)"
```

## 自查清单

- 所有 `import` 都在可用前端资源清单内，并能出现在 `importedModules`。
- 页面视觉方向已经先走 `yida-page-uiux`，组件库服务于既定视觉方向。
- antd 主色通过 `ConfigProvider` 跟随 App 品牌色。
- 图表和图标服务于信息层级；图标默认内联 SVG，明确需要图标库时再引入 `lucide-react`。
- 默认模板、示例和推荐话术只包含当前已验证可用资源能力。
