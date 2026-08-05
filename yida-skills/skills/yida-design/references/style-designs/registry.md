# design.md 模板与示例索引

本目录不再提供多套页面样式供模型套用。`yida-design` Step 5 只消费一个结构模板和一个示例，用来约束 `prd/<项目名>/design.md` 的完整度；真实项目的配色、视觉 DNA、布局配方和组件规则必须由模型根据当前业务、角色、数据形态、应用主题和用户要求生成。

| 文件 | 类型 | 用途 | 使用规则 |
| --- | --- | --- | --- |
| `_design-md-template.md` | template | `design.md` 完整结构模板 | 必读；最终产物章节和字段完整度必须对齐它 |
| `generated-business-design.example.md` | example | 一份完整示例，展示详略、字段和自检方式 | 只看结构和粒度；不得复制业务、色盘、字段、组件组合或页面顺序 |

## 消费规则

1. 先读取 `_design-md-template.md`，按当前业务生成新的 `prd/<项目名>/design.md`。
2. 需要判断详略时读取 `generated-business-design.example.md`，只学习“写到多细”，不学习“长成什么样”。
3. 配色由模型根据行业、品牌、应用主题、业务情绪和用户偏好生成；不得从示例复制固定颜色。
4. `design_id` 使用当前项目生成的 slug，例如 `<业务域>-<体验关键词>-generated`。
5. `baseDesignSource` 或等价字段写 `generated-from-business-context`，不要写某个示例文件。
6. 每个自定义页面最终只读取当前项目 `prd.md` 和 `design.md`；实现阶段不回读本目录。

## 新增示例规则

本目录默认只保留一个示例。确需替换示例时，新示例必须内容中立、显式写“不得复制示例色盘/业务字段”，并保留完整的视觉 DNA、快捷入口、组件状态、响应式、可访问性和自检清单。
