# 字段类型与 URL 规则

> 建表单查字段类型、拼应用访问链接时查本文档。（常见问题排障见主 SKILL.md「常见问题」）

## 表单字段类型速查

| 分类 | 类型 | 说明 | 特殊属性 |
|------|------|------|---------|
| **文本** | `TextField` | 单行文本 | — |
| | `TextareaField` | 多行文本 | — |
| **数值** | `NumberField` | 数字 | `precision`（小数位）· `innerAfter`（单位） |
| | `RateField` | 评分 | `count`（星级数） |
| | `SerialNumberField` | 流水号 | `serialNumberRule` |
| **选择** | `RadioField` | 单选 | `options` |
| | `CheckboxField` | 多选 | `options` |
| | `SelectField` | 下拉单选 | `options` / `remoteDataSource` |
| | `MultiSelectField` | 下拉多选 | `options` / `remoteDataSource` |
| | `CountrySelectField` | 国家选择 | `multiple` |
| **日期** | `DateField` | 日期 | `format`（如 `"YYYY-MM-DD"`） |
| | `CascadeDateField` | 级联日期（范围） | `format` |
| **人员·组织·地址** | `EmployeeField` | 成员选择 | `multiple` |
| | `DepartmentSelectField` | 部门选择 | `multiple` |
| | `AddressField` | 地址 | — |
| **附件·媒体** | `AttachmentField` | 附件上传 | — |
| | `ImageField` | 图片上传 | — |
| **结构·关联** | `TableField` | 子表格 | `children`（子字段列表） |
| | `AssociationFormField` | 关联表单 | `associationForm` |

## 宜搭应用 URL 规则

拼接模板（`{base_url}` 取自登录域名，如公有云 `https://www.aliwork.com`）：

| 页面类型 | URL 格式 |
|---------|---------|
| 应用首页 | `{base_url}/{appType}/workbench` |
| 表单提交页 | `{base_url}/{appType}/submission/{formUuid}` |
| 自定义页面 | `{base_url}/{appType}/custom/{formUuid}` |
| 自定义页面（隐藏导航） | 上行 + `?isRenderNav=false` |
| 表单详情页 | `{base_url}/{appType}/formDetail/{formUuid}?formInstId={formInstId}` |
| 表单详情页（编辑态） | 上行 + `&mode=edit` |

> 任意地址追加 `&corpid={corpId}` 可自动切到对应组织。
