<div align="center">

# GitHub 中文化

> 让 GitHub 界面全面中文化 — 轻量 · 实时 · 智能

![version](https://img.shields.io/badge/version-1.3.2-blue)
![license](https://img.shields.io/github/license/b8nw27v7wp-bit/GitHub-ZH-Plugin)
![stars](https://img.shields.io/github/stars/b8nw27v7wp-bit/GitHub-ZH-Plugin)
![tests](https://img.shields.io/badge/tests-87%20passed-brightgreen)
[![CI](https://github.com/b8nw27v7wp-bit/GitHub-ZH-Plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/b8nw27v7wp-bit/GitHub-ZH-Plugin/actions/workflows/ci.yml)

**简体中文** · [English](#english)

</div>

---

## ✨ 功能特性

| 功能 | 说明 | 状态 |
|------|------|------|
| 🌐 **界面全面中文化** | 导航、按钮、菜单、提示、标题等 930+ 词条 | ✅ |
| ⚡ **动态内容实时翻译** | MutationObserver 监听 DOM 变化，新增内容即时翻译 | ✅ |
| 🧠 **智能跳过** | 自动跳过代码块、搜索框、用户昵称、文件名等不应翻译的内容 | ✅ |
| 🔄 **SPA 无刷新支持** | 适配 GitHub Turbo 页面切换，无需重载即可翻译新页面 | ✅ |
| 📖 **仓库描述一键翻译** | 点击"翻译"按钮，远程翻译仓库简介 | ✅ |
| 📊 **未命中词条收集** | 收集未翻译的英文词条，一键导出 JSON，贡献翻译更简单 | ✅ |
| 🎛️ **功能开关菜单** | 油猴菜单可独立开关正则翻译 / 描述翻译 / 词条收集 | ✅ |
| 🌙 **深色模式适配** | 自动跟随 GitHub 深色/浅色主题 | ✅ |
| 🏷️ **页面标题翻译** | 翻译浏览器标签页标题（含正则规则） | ✅ |
| 🔒 **安全设计** | 翻译结果使用 `textContent` 写入，杜绝 XSS | ✅ |

## 📦 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/)（Chrome/Edge/Firefox）或 [Violentmonkey](https://violentmonkey.github.io/)
2. 点击安装：

**[📦 点击安装脚本](https://raw.githubusercontent.com/b8nw27v7wp-bit/GitHub-ZH-Plugin/main/github-zh.user.js)**

> 💡 安装后访问任意 GitHub 页面即生效。词典经 `@require` 远程加载（推送仓库后自动更新）；加载失败时自动降级到 jsDelivr CDN + 本地缓存 + 自动重试，国内网络也能正常使用。

## 🖥️ 支持的页面

| 页面 | 类型 | 覆盖词条 |
|------|------|---------|
| 首页 / 仪表盘 | `dashboard` | ✅ |
| 仓库主页 | `repository` | ✅ |
| 议题 / PR | `issues` / `pulls` | ✅ |
| Actions | `repository/actions` | ✅ |
| 设置页 | `settings` | ✅ |
| 用户资料 | `page-profile` | ✅ |
| 搜索页 | `search` | ✅ |
| 通知页 | `notifications` | ✅ |
| 探索 / 趋势 | `explore` / `trending` | ✅ |
| 讨论 / 赞助 / Copilot | `discussions` / `sponsors` / `copilot` | ✅ |
| 登录 / 注册 | `session-authentication` | ✅ |
| 新建仓库 | `repository/new` | ✅ |
| **发行版** | `repository/releases` | ✅ |
| **比较页面** | `repository/compare` | ✅ |
| **责任追踪** | `repository/blame` | ✅ |
| **分支管理** | `repository/branches` | ✅ |
| **标签管理** | `repository/tags` | ✅ |
| **安全页面** | `repository/security` | ✅ |
| **项目看板** | `repository/projects` | ✅ |

## 🔧 工作原理

```
GitHub 页面加载 (document-start)
    │
    ├─ ① 检测页面类型 (URL + DOM 特征)
    │    仓库 / 议题 / 设置 / 个人资料 / ...
    │
    ├─ ② 构建页面配置 (合并 公共词典 + 页面词典)
    │    静态词条 → 精确匹配
    │    正则规则 → 模式匹配 (可开关)
    │
    ├─ ③ TreeWalker 遍历 DOM
    │    文本节点 / 属性 / 标题 / 输入框占位符
    │    跳过: 代码块、搜索框、文件名、用户昵称
    │
    ├─ ④ MutationObserver 实时监听
    │    新增节点 → 去重 → 增量翻译
    │    URL 变化 / Turbo 切换 → 重建配置 + 重新翻译
    │
    └─ ⑤ 附加功能
         描述翻译按钮 (远程 API)
         未命中词条收集 → 导出 JSON
```

## 🎛️ 油猴菜单

脚本安装后，可在 Tampermonkey 菜单中找到以下开关：

| 菜单项 | 默认 | 说明 |
|--------|------|------|
| 启用/禁用 正则翻译 | 启用 | 正则规则匹配翻译（如 `12 commits → 12 次提交`） |
| 启用/禁用 描述翻译 | 启用 | 仓库描述旁的"翻译"按钮 |
| 启用/禁用 未命中词条收集 | 禁用 | 记录未翻译词条，可导出 JSON 用于贡献 |
| 📥 导出词条 | — | 导出收集到的未翻译词条 |
| 🗑️ 清空词条 | — | 清空收集数据 |

## 🔒 安全与隐私

- **防 XSS**：所有翻译结果一律通过 `textContent` / 文本节点 `data` 写入，脚本全程不使用 `innerHTML`
- **不污染代码**：代码高亮、代码编辑器、Markdown 正文、文件名、用户昵称、搜索框等一律跳过
- **远程翻译透明**：仅「仓库描述翻译」会将描述文本发送给第三方翻译服务（MyMemory），其余翻译全部在本地词典完成、零网络请求
- **词条收集可控**：默认关闭；开启后仅记录页面路径 + 英文词条 + 出现位置（`pageType`/选择器/命中次数），不包含任何账户或个人隐私，可一键清空
- **词典加载安全**：词典仅从本仓库主源与 jsDelivr CDN（HTTPS）加载，写入本地缓存前做结构校验；词典本身以脚本形式执行（`new Function`），来源限定为上述可信地址、无其他第三方注入。请仅在信任本仓库的前提下安装使用

## 📁 项目结构

```
GitHub-ZH-Plugin/
├── github-zh.user.js      # 主脚本（油猴脚本入口，含词典加载容错）
├── locales.js             # 翻译词典（930+ 词条，28 个页面类型）
├── test/
│   ├── github-zh.test.js  # 功能测试（87 项断言，真实执行主脚本核心函数）
│   └── verify-locales.js  # 词典静态校验（7 项：重复键/空白键/正则组引用等）
├── script/
│   ├── bump-version.js    # 版本递增脚本（同步 @version / CONFIG.VERSION / README）
│   └── missed-to-dict.js  # 未命中词条 JSON → locales.js 词条草稿
├── .github/workflows/ci.yml  # CI：功能测试 + 词典校验
├── README.md
└── LICENSE                # MIT 许可证
```

## 🤝 贡献

### 贡献翻译词条（最欢迎！）

1. Fork 本仓库
2. 编辑 `locales.js`，找到对应页面类型的 `static` 或 `regexp` 添加词条
3. 运行测试确认无回归：`node test/github-zh.test.js && node test/verify-locales.js`
4. 提交 Pull Request

> 💡 **偷懒路径**：用「未命中词条收集」浏览 GitHub 后导出 JSON，再执行
> `node script/missed-to-dict.js 导出.json`，脚本会自动：按页面类型归类、过滤已收录词条、
> 按命中次数排序，直接生成词条草稿供粘贴填写（含 pageType/选择器/命中次数信息）。

### 词条格式

```js
// locales.js 中的公共词典
public: {
    static: {
        'Pull requests': '拉取请求',  // 英文原文: 中文翻译
    },
    regexp: [
        [new RegExp('^(\\d+) (?:commits?)'), '$1 次提交'],  // 正则规则
    ],
},
```

> 💡 使用「未命中词条收集」功能收集你在浏览 GitHub 时遇到的未翻译词条，导出后提 PR 即可！

### 提交规范

- Commit message 使用 `feat:` / `fix:` / `docs:` 前缀
- 词条贡献一个 PR 尽量只改一个页面类型，方便审查

## 🔄 更新日志

- **v1.3.2**（2026-08）：补充 GitHub 近期改版界面词条约 40 条：通知收件箱（侧栏筛选器 / 批量操作 / 已保存）、仪表盘（Copilot 快捷入口、智能体会话、新版动态 feed 筛选器）、Copilot 页面与聊天面板（编程智能体、免费试用）、顶栏「新建」菜单及全局通用文案；词典总数 900+ → 930+
- **v1.3.1**（2026-08）：词典加载容错（多 CDN 降级 + 本地缓存 + 自动重试）；词条收集升级（附带页面类型 / 选择器 / 命中次数）；修复 `/settings/profile` 页面类型误判、标题正则捕获组缺失等 bug；新增「真实执行主脚本」测试与 `verify-locales.js` 静态校验；新增 `bump-version.js` / `missed-to-dict.js` 工具
- **v1.3.0**：新增 issues / pulls / commit / actions / wiki / packages 边缘页面翻译
- **v1.1.0**：架构升级，支持动态内容翻译、描述一键翻译、未命中词条收集

## ❓ FAQ

**Q: 为什么有些内容没翻译？**
A: 出于安全考虑，代码块、文件名、用户昵称、README 正文等不会被翻译。此外，如果某个词条还未收录，欢迎使用词条收集功能并提 PR 补充。

**Q: 会翻译我的代码吗？**
A: 不会。脚本明确跳过了代码高亮区域（`.highlight`）、代码编辑器、文件树等，只翻译界面文案。

**Q: 和 maboloshi/github-chinese 有什么区别？**
A: 本项目是独立实现，架构更轻量（单文件主脚本 + 独立词典），提供词条收集导出、CI 自动化测试等工程化能力，方便社区贡献翻译。

**Q: 如何更新脚本？**
A: Tampermonkey 会自动检查更新；词典通过 `@require` 远程加载，更新仓库后自动生效。若所在网络无法访问 raw.githubusercontent，脚本会自动改用 jsDelivr CDN 并复用本地缓存。

## 📄 许可证

[MIT License](LICENSE)

---

<a name="english"></a>

## English

**GitHub Chinese Localization** — A lightweight userscript that localizes the GitHub interface into Simplified Chinese. Features real-time DOM translation, SPA support, one-click repo description translation, and a missed-term collector for contributors. MIT licensed.
