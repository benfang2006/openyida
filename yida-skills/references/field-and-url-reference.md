# 字段类型、URL 规则与常见问题

> 本文档是 `openyida` 主技能的参考文档，收录表单字段类型速查、宜搭应用 URL 拼接规则、常见问题排查。

## 表单字段类型速查

| 类型 | 说明 | 特殊属性 |
|------|------|---------|
| `TextField` | 单行文本 | — |
| `TextareaField` | 多行文本 | — |
| `NumberField` | 数字 | `precision`（小数位）、`innerAfter`（单位） |
| `RadioField` | 单选 | `options` |
| `CheckboxField` | 多选 | `options` |
| `SelectField` | 下拉单选 | `options` / `remoteDataSource` |
| `MultiSelectField` | 下拉多选 | `options` / `remoteDataSource` |
| `DateField` | 日期 | `format`（如 `"YYYY-MM-DD"`） |
| `CascadeDateField` | 级联日期（范围） | `format` |
| `EmployeeField` | 成员选择 | `multiple` |
| `DepartmentSelectField` | 部门选择 | `multiple` |
| `AddressField` | 地址 | — |
| `AttachmentField` | 附件上传 | — |
| `ImageField` | 图片上传 | — |
| `TableField` | 子表格 | `children`（子字段列表） |
| `AssociationFormField` | 关联表单 | `associationForm` |
| `SerialNumberField` | 流水号 | `serialNumberRule` |
| `RateField` | 评分 | `count`（星级数） |
| `CountrySelectField` | 国家选择 | `multiple` |

## 宜搭应用 URL 规则

| 页面类型 | URL 格式 |
|---------|---------|
| 应用首页 | `{base_url}/{appType}/workbench` |
| 表单提交页 | `{base_url}/{appType}/submission/{formUuid}` |
| 自定义页面 | `{base_url}/{appType}/custom/{formUuid}` |
| 自定义页面（隐藏导航） | `{base_url}/{appType}/custom/{formUuid}?isRenderNav=false` |
| 表单详情页 | `{base_url}/{appType}/formDetail/{formUuid}?formInstId={formInstId}` |
| 表单详情页（编辑模式） | `{base_url}/{appType}/formDetail/{formUuid}?formInstId={formInstId}&mode=edit` |

> 所有地址拼接 `&corpid={corpId}` 可自动切换到对应组织。

## 常见问题

**Q：发布时提示登录失效？**

重新登录后再发布：
```bash
openyida login
openyida publish <源文件路径> <appType> <formUuid> --health-check
```

**Q：如何查看已有表单的字段 ID？**

使用 `yida-get-schema` 技能获取表单 Schema，从中读取各字段的 `fieldId`：
```bash
openyida get-schema <appType> <formUuid>
```

**Q：如何更新已有表单字段？**

使用 `yida-create-form-page` 的 update 模式，详见 `skills/yida-create-form-page/SKILL.md`：
```bash
openyida create-form update <appType> <formUuid> '[{"action":"add","field":{"type":"TextField","label":"新字段"}}]'
```

**Q：发布时提示 corpId 不匹配？**

询问用户是否在当前组织创建新应用发布，或重新登录到正确组织：
```bash
openyida logout
openyida login
```
