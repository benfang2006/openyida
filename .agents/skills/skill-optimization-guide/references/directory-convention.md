# Skill 目录规范

## 用途

步骤 2 拆分重组时，用来决定每个文件放在哪个目录。

## 标准目录结构

```
skills/<skill-name>/
  SKILL.md              ← 入口，agent 第一个读的文件
  workflow/
    step-1-*.md         ← 按顺序执行的步骤
    step-2-*.md
  references/
    *.md                ← 规则详解、参数表、场景列表
    scenes/*.md         ← 页面场景（如果有）
  script/
    *.sh / *.js / ...   ← 可运行的脚本（检查、生成、部署等）
  sub_skill/<name>/
    SKILL.md            ← 子流程入口
  assets/
    *.json / *.tmpl / ...← 模板、素材、非脚本类可复用文件
```

## 放哪里的判断表

| 这条信息的特征 | 放在 | 理由 |
|--------------|------|------|
| agent 进入技能后必须立刻知道 | SKILL.md | 入口零延迟获取 |
| 步骤多（>4 步）或单步内容长（>50 行） | workflow/step-*.md | 简单流程直接写在 SKILL.md，复杂才拆目录 |
| 只有特定场景才需要查看 | references/*.md | 按需阅读，不增加入口负担 |
| 是某类页面的专属规则 | references/scenes/*.md | 收敛到 scenes 子目录 |
| 是可运行的脚本（检查、生成、部署等） | script/ | 脚本和文档分开，方便直接执行 |
| 需要独立入口但不是顶层 skill | sub_skill/<name>/SKILL.md | 保持顶层 skill 列表干净 |
| 是模板或素材，不是可运行脚本 | assets/ | 和脚本、文档分开存放 |

## script/ 和 assets/ 的区别

| 目录 | 放什么 | 举例 |
|------|--------|------|
| script/ | 可以直接运行的脚本 | `check-links.sh`、`generate-template.js`、`deploy.sh` |
| assets/ | 被脚本或文档引用的素材和模板 | `page-template.json`、`config.tmpl`、`icon.svg` |

判断标准：这个文件能不能直接 `bash xxx.sh` 或 `node xxx.js` 运行？能 → script/，不能 → assets/。

## 合并规则

- 内容少于 50 行的独立 .md 文件，合并到最相关的文件中。
- 合并后在原位留一个引用行即可，例如："详见 [写作规则](references/writing-rules.md) 第 3 节"。

## 命名规则

- workflow 文件：`step-{序号}-{动作动词}.md`，如 `step-1-assess.md`
- references 文件：`{内容主题}.md`，如 `writing-rules.md`、`api-params.md`
- script 文件：`{动作}-{对象}.{ext}`，如 `check-links.sh`、`generate-template.js`
- assets 文件：保留原始文件名，无特殊要求
