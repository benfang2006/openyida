# 应用主题与 token 参考

本文件是 OpenYida 应用主题的统一参考。其他 skill 需要应用主题 key、默认推荐主题或 token 变量时，引用本文，不要在各自文档里重复维护完整主题清单。

默认推荐使用 `podBlue`、`podGreen`、`podOrange` 等应用主题。`blue`、`green`、`orange` 也是应用主题 token profile，保留原名，不自动改写成其他主题名。

注意：`openyida create-app/update-app --theme` 只能传平台支持的应用主题 key；页面级 `--theme-profile` / `style#yida-global-theme` 可以使用本文的应用主题 token profile。

## 应用主题 key 清单

`openyida create-app --theme <key>` / `openyida update-app --theme <key>` 只能填写下面的应用主题 key，不能填 AI 自己设计的任意主题名或色值。

| key | 颜色倾向 |
| --- | --- |
| `deepBlue` | 深蓝 |
| `podBlue` | 其他蓝色 |
| `royalBlue` | 皇家蓝 |
| `lightBlue` | 浅蓝 |
| `teal` | 青色 |
| `podGreen` | 绿色 |
| `deepPurple` | 深紫 |
| `purple` | 紫色 |
| `podOrange` | 橙色 |
| `yellow` | 黄色 |
| `magenta` | 玫红 |
| `red` | 红色 |
| `greyBlue` | 灰蓝 |
| `coffee` | 咖啡 |
| `black` | 黑色 |

## 应用主题 token profile

默认推荐项是 `podBlue`、`podGreen`、`podOrange`；`blue`、`green`、`orange` 保留为同名应用主题 token profile。

## blue

```json
{
  "--color-brand1-1": "rgb(51, 160, 255)",
  "--color-brand1-2": "rgb(242, 249, 255)",
  "--color-brand1-3": "rgba(0, 137, 255, 0.2)",
  "--color-brand1-6": "rgb(0, 137, 255)",
  "--color-brand1-9": "rgb(0, 109, 204)",
  "--color-brand1-10": "rgba(0, 137, 255, 0.3)",
  "--color-brand-1": "rgb(178, 219, 255)",
  "--color-brand-2": "rgb(51, 160, 255)",
  "--color-brand-3": "rgb(0, 137, 255)",
  "--color-brand-4": "rgb(0, 109, 204)"
}
```

## green

```json
{
  "--color-brand1-1": "rgb(60, 190, 113)",
  "--color-brand1-2": "rgb(246, 252, 248)",
  "--color-brand1-3": "rgba(64, 179, 112, 0.2)",
  "--color-brand1-6": "rgb(64, 179, 112)",
  "--color-brand1-9": "rgb(62, 170, 107)",
  "--color-brand1-10": "rgba(64, 179, 112, 0.3)",
  "--color-brand-1": "rgb(197, 232, 212)",
  "--color-brand-2": "rgb(60, 190, 113)",
  "--color-brand-3": "rgb(64, 179, 112)",
  "--color-brand-4": "rgb(62, 170, 107)"
}
```

## orange

```json
{
  "--color-brand1-1": "rgb(255, 125, 26)",
  "--color-brand1-2": "rgb(255, 248, 242)",
  "--color-brand1-3": "rgba(255, 111, 0, 0.2)",
  "--color-brand1-6": "rgb(255, 111, 0)",
  "--color-brand1-9": "rgb(242, 105, 0)",
  "--color-brand1-10": "rgba(255, 111, 0, 0.3)",
  "--color-brand-1": "rgb(255, 211, 178)",
  "--color-brand-2": "rgb(255, 125, 26)",
  "--color-brand-3": "rgb(255, 111, 0)",
  "--color-brand-4": "rgb(242, 105, 0)"
}
```

## podBlue

```json
{
  "--color-brand1-1": "rgb(51, 160, 255)",
  "--color-brand1-2": "rgb(242, 249, 255)",
  "--color-brand1-3": "rgba(0, 137, 255, 0.2)",
  "--color-brand1-6": "rgb(0, 137, 255)",
  "--color-brand1-9": "rgb(0, 109, 204)",
  "--color-brand1-10": "rgba(0, 137, 255, 0.3)",
  "--color-brand-1": "rgb(178, 219, 255)",
  "--color-brand-2": "rgb(51, 160, 255)",
  "--color-brand-3": "rgb(0, 137, 255)",
  "--color-brand-4": "rgb(0, 109, 204)"
}
```

## podGreen

```json
{
  "--color-brand1-1": "rgb(60, 190, 113)",
  "--color-brand1-2": "rgb(246, 252, 248)",
  "--color-brand1-3": "rgba(64, 179, 112, 0.2)",
  "--color-brand1-6": "rgb(64, 179, 112)",
  "--color-brand1-9": "rgb(62, 170, 107)",
  "--color-brand1-10": "rgba(64, 179, 112, 0.3)",
  "--color-brand-1": "rgb(197, 232, 212)",
  "--color-brand-2": "rgb(60, 190, 113)",
  "--color-brand-3": "rgb(64, 179, 112)",
  "--color-brand-4": "rgb(62, 170, 107)"
}
```

## podOrange

```json
{
  "--color-brand1-1": "rgb(255, 125, 26)",
  "--color-brand1-2": "rgb(255, 248, 242)",
  "--color-brand1-3": "rgba(255, 111, 0, 0.2)",
  "--color-brand1-6": "rgb(255, 111, 0)",
  "--color-brand1-9": "rgb(242, 105, 0)",
  "--color-brand1-10": "rgba(255, 111, 0, 0.3)",
  "--color-brand-1": "rgb(255, 211, 178)",
  "--color-brand-2": "rgb(255, 125, 26)",
  "--color-brand-3": "rgb(255, 111, 0)",
  "--color-brand-4": "rgb(242, 105, 0)"
}
```
