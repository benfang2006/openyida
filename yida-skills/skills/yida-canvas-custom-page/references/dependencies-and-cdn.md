# Code Canvas 依赖白名单与 CDN 加载

本文件承载 Code Canvas 的依赖白名单、windowAlias 映射与编译改写规则。依赖加载细节以当前宜搭物料运行时为准；本文只保留页面作者需要遵循的 import / CDN 契约。核实自 `vc-deep-yida/src/components/yida-code-canvas` 源码（`dependencies.ts` / `factory.tsx`）。

## 依赖白名单（核实自 `yida-code-canvas/dependencies.ts`）

编译阶段把 `import` 改写为下列白名单的 `windowAlias` 引用，运行时按 `windowAlias` 加载到 `window` 上。带 `${cdn}` 的资源前缀由平台运行时按当前环境决定。

| 包名 | windowAlias | 资源 |
| --- | --- | --- |
| react | `React` | g.alicdn.com react 18.3.1 |
| react-dom | `ReactDOM` | g.alicdn.com react-dom 18.3.1 |
| antd | `antd` | g.alicdn.com antd **5.23.3** `antd-with-locales.js` |
| @ant-design/icons | `icons` | g.alicdn.com ant-design-icons 5.5.1 |
| ahooks | `ahooks` | `${cdn}/platform/yida-assets/ahooks.js`（默认追加） |
| d3 | `d3` | g.alicdn.com d3 7.9.0 |
| recharts | `Recharts` | g.alicdn.com recharts 2.15.0 |
| @radix-ui/themes | `Radix` | `${cdn}/.../radix.js` + `radix.css` |
| lucide-react | `DynamicIcon` | `${cdn}/.../lucideReact.js` |
| framer-motion | `FramerMotion` | `${cdn}/.../framerMotion.js` |
| yida-plugin-markdown | `YidaMarkdown` | moduleFederation 0.0.4 |

新增依赖必须同时满足：① 编译能把 import 抽进 `importedModules` 并映射到 windowAlias（见 `canvas-compile.js` 的 `MODULE_ALIAS_MAP`）；② 上表或平台运行时能把依赖加载到 window；③ `runtimeCode` 引用的变量名与 windowAlias 一致；④ CSS 资源可加载。页面源码只 import 白名单包；`yida-utils`、`@ali/deep`、原生字段组件等宜搭运行态能力通过 `window.Deep`、`window.DeepYida`、`window.YidaNativeComponents` 等 `window.*` 访问。

当宜搭物料依赖表已经先于 OpenYida CLI 升级，且已确认运行时确实会注入某个新裸包时，可以临时设置 `OPENYIDA_CANVAS_ALLOW_UNSUPPORTED_IMPORTS=1` 退回旧式 `window["pkg"]` 映射发布。该开关只用于白名单漂移期间的发布验证；常规页面仍使用上表白名单和明确的 `windowAlias`。

真实表单数据绑定使用页面内本地 `useYidaData(binding)`、`DataBridge` 与同源 `fetch` 实现。

编译位置：OpenYida CLI **本地用 Babel** 把源码转译为 `runtimeCode` + `importedModules`（`import`→`window.<别名>`、`export default`→`YidaComp`、依赖名正则抽取），不调用任何在线编译服务，因此不依赖登录态、不经过风控。别名映射逐条镜像自 `dependencies.ts` 的 `getModuleAliasMap()`；运行时消费契约见 `factory.tsx`（`new Function` 执行 `runtimeCode` 取 `YidaComp`）。
