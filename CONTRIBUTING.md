# 贡献指南

感谢你愿意参与 **GitHub 中文化** 插件的贡献！无论是补充翻译词条、修复 Bug、改进文档，还是报告建议，都非常欢迎。

本指南面向所有贡献者，请花几分钟阅读，能让协作更顺畅。

---

## 目录

- [环境准备](#环境准备)
- [项目结构](#项目结构)
- [词典贡献流程](#词典贡献流程)
- [代码规范](#代码规范)
- [测试流程](#测试流程)
- [提交规范](#提交规范)
- [版本发布](#版本发布)
- [未命中词条反馈](#未命中词条反馈)

---

## 环境准备

本项目是**纯静态 userscript**，没有 `package.json`，无需安装任何 npm 依赖、无需构建步骤，只需要：

- **Node.js 18+**（推荐 20，与 CI 一致）

验证环境：

```bash
node --version        # 应输出 v18 或更高
```

克隆仓库并进入目录：

```bash
git clone https://github.com/b8nw27v7wp-bit/GitHub-ZH-Plugin.git
cd GitHub-ZH-Plugin
```

确认主脚本与词典可以正常加载：

```bash
node test/github-zh.test.js
node test/verify-locales.js
```

两条命令均以 `0 通过 + 0 失败` 结束即表示环境就绪。

## 项目结构

```
GitHub-ZH-Plugin/
├── github-zh.user.js      # 主脚本（油猴入口，含词典加载容错；只在改逻辑时动它）
├── locales.js             # 翻译词典（900+ 词条，28 个页面类型，37 个 static 块）
├── test/
│   ├── github-zh.test.js  # 功能测试（真实执行主脚本核心函数）
│   └── verify-locales.js  # 词典静态校验（重复键 / 空白键 / 正则组引用等）
├── script/
│   ├── bump-version.js    # 版本递增脚本（同步 @version / CONFIG.VERSION / README）
│   └── missed-to-dict.js  # 未命中词条 JSON → locales.js 词条草稿
├── .github/workflows/ci.yml  # CI：功能测试 + 词典校验
├── CONTRIBUTING.md
├── README.md
└── LICENSE                # MIT 许可证
```

> ⚠️ **主脚本与词典分离**：贡献词条只改 `locales.js`，不要动 `github-zh.user.js` 中的翻译逻辑。

## 词典贡献流程

贡献翻译词条是最受欢迎的贡献方式。核心流程：

1. **Fork 本仓库**，并克隆到本地
2. **找到对应页面类型**：在 `locales.js` 中定位目标页面类型的 `static` / `regexp` 块
3. **添加词条**（格式见下）
4. **运行测试**确认无回归：`node test/github-zh.test.js && node test/verify-locales.js`
5. **提交 Pull Request**（一个 PR 尽量只改一个页面类型，方便审查合并）

### 词条格式

`locales.js` 的组织方式：顶层是 `conf`（配置正则）、`public`（公共词典，所有页面生效），然后是各个页面类型词典（如 `repository`、`settings`、`issues` …）。

```js
// 公共词典（所有页面生效）
public: {
    static: {
        'Pull requests': '拉取请求',   // 英文原文: 中文翻译
    },
    regexp: [
        [new RegExp('^(\\d+) (?:commits?)'), '$1 次提交'],  // [正则, 替换串]
    ],
},

// 页面词典（仅该页面类型生效），以每页标题词条 + static + regexp 三块组成
repository: {
    static: {
        'Code': '代码',
        ...
    },
    regexp: [
        [new RegExp('^(\\d+) (?:files?) changed'), '$1 个文件变更'],
    ],
},
```

### 静态词条书写规范

- **键**：GitHub 上实际显示的英文原文，**精确匹配**，一般保留原样（大小写、空格一致）
- **值**：简体中文翻译
- 键与值都用**单引号**包裹，条目以逗号结尾
- 键首尾不要有空白；除非有意为之（如 `'on': ''`），否则翻译值不要留空
- 不要添加与相邻页面类型重复的键——公共词条已覆盖的内容，优先放进 `public`
- 不要重复收录已被词典覆盖的词条（先跑 `verify-locales.js`，它会提示重复键）

### 正则规则书写规范

- 规则组成为 `[new RegExp('正则')， '替换串']`：
  - **正则**：匹配英文文本的模式，注意转义（`\d+` 要写作 `'\\d+'`）
  - **替换串**：`$1`、`$2` 引用捕获组
- 捕获组的数量必须大于等于替换串引用的最大编号，否则会越界报错
- 优先使用非捕获组 `(?:...)` 表达不需要引用的分组
- 正则应足够精确，避免误伤（例如不要用过于宽泛的 `.*` 匹配整页文本）

### 已收录的页面类型

`conf.rePagePath` / `conf.rePagePathRepo` 定义了 URL 解析规则，具体页面类型包括：

`dashboard`、`repository`、`page-profile`、`settings`、`search`、`notifications`、`issues`、`pulls`、`session-authentication`、`explore`、`discussions`、`copilot`、`sponsors`、`trending`、`repository/new`、`repository/issues`、`repository/pulls`、`repository/commit`、`repository/actions`、`repository/wiki`、`repository/packages`、`repository/releases`、`repository/compare`、`repository/blame`、`repository/branches`、`repository/tags`、`repository/security`、`repository/projects`

## 代码规范

### 安全红线（必须遵守）

- **禁止 XSS**：翻译结果一律通过 `textContent` / 文本节点 `data` 写入，全程**不得使用 `innerHTML`**
- **禁止污染用户内容**：代码高亮区（`.highlight`）、代码编辑器、Markdown 正文、文件名、用户昵称、搜索框等一律跳过，不要试图翻译它们
- 新增的翻译输出逻辑必须先跑功能测试，并由维护者 review

### 修改原则

- **词条贡献只改 `locales.js`**；不要修改 `github-zh.user.js` 的翻译流程
- 逻辑改动（改 `github-zh.user.js`）必须同时：更新/新增对应测试用例，保持 README 与功能一致
- 保持现有代码风格：4 空格缩进、单引号、中文注释、分号结尾
- 新增功能默认遵循「静态词条 → 精确匹配」「正则规则 → 模式匹配」的两级翻译架构
- 若改动涉及新页面类型，同步把 `conf.rePagePath*`、`ignoreSelectors` 等配置与 README 的支持页面表更新

## 测试流程

代码改动（尤其是 `locales.js` 与 `github-zh.user.js`）后，**提交前必须跑全部测试**：

```bash
node test/github-zh.test.js      # 功能测试：真实执行主脚本核心函数 + 词典结构断言
node test/verify-locales.js      # 词典静态校验：重复键 / 首尾空白 / 空值 / 正则引用越界 / 括号配对
```

若新增词条后功能测试失败，多半是新增词典条目标注了错误页面类型，或测试中被断言的目标页面不支持该词条，对照失败输出修正即可。

### 新增测试用例

新增功能或修改逻辑时，请在 `test/github-zh.test.js` 中补充断言，遵循既有模式：

- 结构断言（如：页面类型有 static 词典）仿照「词典结构」一节
- 翻译断言（如：某文本应译成某中文）仿照「transText 真实实现」一节
- 注意按需切换 `__location`（`setPath`）与调用 `ghz.updatePageConfig()` 后再断言

### CI

提交到 `main` 或创建 PR 时，GitHub Actions 会**自动运行** `github-zh.test.js` 与 `verify-locales.js`（Node 20 / Ubuntu）。请确保本地测试通过，避免 CI 红标。CI 配置位于 `.github/workflows/ci.yml`。

## 提交规范

- Commit message 使用 **`feat:` / `fix:` / `docs:`** 等 Conventional Commits 前缀，可附简短中文/英文说明：
  - `feat: 补充 repository/tags 页面词条`
  - `fix: 修复标题翻译捕获组缺失`
  - `docs: 更新 README 支持页面表`
- 词条贡献：**一个 PR 尽量只改一个页面类型**，方便审查
- 每个 PR 只解决一个问题；如有多项改动请拆分为多个 PR
- 提交前先自查：`git status` 确认只包含预期文件，不提交临时文件、密钥或本地方便文件
- PR 标题与描述说明改动目的，必要时附上测试输出截图

## 版本发布

常规翻译/表更提交不需要发版，维护者合并后推送到 `main` 即自动生效（Tampermonkey 自动更新，词典经 `@require` 远程加载）。

需要发版（正式功能迭代）时，用版本脚本统一递增：

```bash
node script/bump-version.js           # 默认 patch：1.3.1 → 1.3.2
node script/bump-version.js minor     # minor：1.3.1 → 1.4.0
node script/bump-version.js major     # major：1.3.1 → 2.0.0
```

脚本会**同步更新**三处，无需手改：

- `github-zh.user.js` 的 `// @version`
- `github-zh.user.js` 的 `CONFIG.VERSION`
- `README.md` 的版本徽章

改完后在 `README.md` 更新日志节追加一条记录（`**vX.Y.Z**（日期）：改动摘要`）。由于词典通过 `@require` 远程加载（失败时降级 jsDelivr CDN + 本地缓存 + 自动重试），词典更新无需发版即可生效。

## 未命中词条反馈

### 使用插件收集（推荐）

脚本自带「未命中词条收集」功能，无需手动报告：

1. 在 Tampermonkey 菜单中开启「启用/禁用 未命中词条收集」（默认关闭）
2. 正常浏览 GitHub 页面，脚本会自动记录未翻译的英文词条（仅记录路径 + 词条 + 出现位置，不包含隐私，可一键清空）
3. 点菜单「📥 导出词条」得到 JSON 文件

### 提交收集结果给项目

**方式一（贡献翻译）：** 用转换脚本把导出 JSON 转成词条草稿，直接填写翻译后提 PR：

```bash
node script/missed-to-dict.js 导出文件.json               # 全部页面类型
node script/missed-to-dict.js 导出文件.json --page settings  # 只看某个页面类型
```

脚本会自动：按页面类型归类、跳过已收录/已被正则覆盖的词条、按命中次数排序，输出带 `CHANGE_ME` 占位符与注释（命中次数 / 出现路径）的草稿，把草稿贴到 `locales.js` 对应页面类型即可。

**方式二（仅反馈）：** 把导出的 JSON 附到 Issue（[New Issue](https://github.com/b8nw27v7wp-bit/GitHub-ZH-Plugin/issues/new)），或直接把未翻译词条 + 出现页面的列表发在 Issue 里，标题建议带 `[未命中词条]` 前缀。

---

## 致谢

贡献不分大小：一个词条、一个测试用例、一份文档改进都值得尊重。期待你的 PR！