# GitHub 中文化（GitHub-ZH-Plugin）

[![version](https://img.shields.io/badge/version-1.3.2-blue)]()
[![license](https://img.shields.io/github/license/b8nw27v7wp-bit/GitHub-ZH-Plugin)](LICENSE)
[![tests](https://img.shields.io/badge/tests-114%20passed-brightgreen)]()
[![CI](https://github.com/b8nw27v7wp-bit/GitHub-ZH-Plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/b8nw27v7wp-bit/GitHub-ZH-Plugin/actions)

> 一个 Tampermonkey / Violentmonkey 油猴脚本：把 GitHub 界面翻成简体中文，覆盖 48 个页面类型、1176 条词条。

原版 GitHub 没有中文界面。这个脚本在页面加载时（`document-start`）就地替换界面文案——导航、按钮、菜单、提示、标题都翻，代码、文件名、昵称、README 正文一律不碰。翻译全在本地词典完成，不请求翻译 API。

## 它能做什么

### 界面中文化

- **1176 条词条**：1107 条静态精确匹配 + 69 条正则规则（如 `12 commits → 12 次提交`）
- 覆盖 **48 个页面类型**：首页/仪表盘、仓库主页、议题与 PR、Actions、设置、搜索、通知、探索/趋势、讨论、赞助、Copilot、登录注册、发行版、比较、责任追踪、分支/标签管理、安全页、项目看板、动态 Feed、组织页、代码视图、仓库设置、智能体会话、标签/里程碑/代码片段等
- 顶栏「新建」菜单、通知收件箱、新版仪表盘等改版界面文案都已跟上
- 页面标题（浏览器标签页）也会翻译，含正则规则

### 动态页面也能翻

GitHub 是 Turbo 驱动的 SPA，切页面不重载。脚本用 `MutationObserver` 监听 DOM 增量，新插入的节点即时翻译；URL 变化或 Turbo 切换时重建页面配置再翻一遍。

### 该跳过的一律跳过

自动识别并跳过代码高亮区（`.highlight`）、代码编辑器、文件树、Markdown 正文、搜索框、用户昵称——**只翻界面，不动内容**。这是这类脚本最容易翻车的地方：把变量名或仓库名翻成中文，比不翻更糟。

### 给贡献者的工具

- **未命中词条收集**（默认关闭）：记录没翻译的英文词条，附带页面类型 / 选择器 / 命中次数，一键导出 JSON
- `node script/missed-to-dict.js 导出.json` 把导出的 JSON 直接转成 `locales.js` 词条草稿：按页面类型归类、过滤已收录、按命中次数排序
- 仓库描述旁的「翻译」按钮：远程翻译仓库简介（唯一会出网的翻译功能）
- 油猴菜单可独立开关正则翻译 / 描述翻译 / 词条收集

## 技术栈

| 层 | 选型 | 说明 |
| --- | --- | --- |
| 形态 | 用户脚本（Tampermonkey / Violentmonkey） | 单文件主脚本 + 独立词典，零构建、零依赖，装完即用 |
| 词典 | `locales.js`（静态表 + 正则表） | 公共词典 + 按页面类型分组的页面词典，运行时合并；经 `@require` 远程加载，推送仓库后自动更新 |
| DOM 遍历 | `TreeWalker` | 文本节点、属性、`title`、输入框 `placeholder` 逐类处理 |
| 动态监听 | `MutationObserver` | 增量翻译新节点；监听 URL 变化适配 Turbo SPA |
| 词典加载容错 | 多 CDN 降级 + 本地缓存 + 自动重试 | raw.githubusercontent 不可达时自动切 jsDelivr，国内网络可用 |
| 安全 | 只用 `textContent` / 文本节点 `data` 写入 | 全程不用 `innerHTML`，杜绝 XSS |
| 测试 | Node 原生脚本 + GitHub Actions | 114 项功能断言真实执行主脚本核心函数，另有 7 项词典静态校验 |

## 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/)（Chrome/Edge/Firefox）或 [Violentmonkey](https://violentmonkey.github.io/)
2. 点开脚本安装：<https://raw.githubusercontent.com/b8nw27v7wp-bit/GitHub-ZH-Plugin/main/github-zh.user.js>
3. 访问任意 GitHub 页面即生效

词典通过 `@require` 远程加载，仓库更新后脚本无需重装即可用上新词条；加载失败时降级到 jsDelivr CDN + 本地缓存 + 自动重试。

## 工作原理

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

## 油猴菜单

| 菜单项 | 默认 | 说明 |
| --- | --- | --- |
| 启用/禁用 正则翻译 | 启用 | 正则规则匹配翻译（如 `12 commits → 12 次提交`） |
| 启用/禁用 描述翻译 | 启用 | 仓库描述旁的「翻译」按钮 |
| 启用/禁用 未命中词条收集 | 禁用 | 记录未翻译词条，可导出 JSON 用于贡献 |
| 导出词条 | — | 导出收集到的未翻译词条 |
| 清空词条 | — | 清空收集数据 |

## 安全与隐私

- **防 XSS**：所有翻译结果一律通过 `textContent` / 文本节点 `data` 写入，脚本全程不使用 `innerHTML`
- **不污染代码**：代码高亮、代码编辑器、Markdown 正文、文件名、用户昵称、搜索框等一律跳过
- **远程翻译透明**：仅「仓库描述翻译」会把描述文本发给第三方翻译服务（MyMemory），其余翻译全部在本地词典完成、零网络请求
- **词条收集可控**：默认关闭；开启后仅记录页面路径 + 英文词条 + 出现位置（`pageType` / 选择器 / 命中次数），不含账户或个人隐私，可一键清空
- **词典加载安全**：词典仅从本仓库主源与 jsDelivr CDN（HTTPS）加载，写入本地缓存前做结构校验；词典以脚本形式执行（`new Function`），来源限定为上述可信地址。请仅在信任本仓库的前提下安装使用

## 项目结构

```
GitHub-ZH-Plugin/
├── github-zh.user.js      # 主脚本（油猴脚本入口，含词典加载容错）
├── locales.js             # 翻译词典（1176 条词条 = 1107 静态 + 69 正则，48 个页面类型）
├── test/
│   ├── github-zh.test.js  # 功能测试（114 项断言，真实执行主脚本核心函数）
│   └── verify-locales.js  # 词典静态校验（7 项：重复键/空白键/正则组引用等）
├── script/
│   ├── bump-version.js    # 版本递增（同步 @version / CONFIG.VERSION / README）
│   └── missed-to-dict.js  # 未命中词条 JSON → locales.js 词条草稿
├── .github/workflows/ci.yml  # CI：功能测试 + 词典校验
└── LICENSE                # MIT
```

## 测试

```bash
node test/github-zh.test.js    # 114 项功能断言
node test/verify-locales.js    # 7 项词典静态校验
```

两个脚本都零依赖，CI（GitHub Actions）在 push / PR 时全跑。

## 贡献词条

1. Fork 本仓库
2. 编辑 `locales.js`，找到对应页面类型的 `static` 或 `regexp` 添加词条
3. 跑测试确认无回归：`node test/github-zh.test.js && node test/verify-locales.js`
4. 提交 Pull Request

偷懒路径：用「未命中词条收集」浏览 GitHub 后导出 JSON，再执行 `node script/missed-to-dict.js 导出.json`，脚本自动按页面类型归类、过滤已收录词条、按命中次数排序，直接生成词条草稿。

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

提交规范：Commit message 用 `feat:` / `fix:` / `docs:` 前缀；一个 PR 尽量只改一个页面类型，方便审查。

## 更新日志

- **v1.3.2**（2026-08）：补充 GitHub 近期改版界面词条约 40 条：通知收件箱（侧栏筛选器 / 批量操作 / 已保存）、仪表盘（Copilot 快捷入口、智能体会话、新版动态 feed 筛选器）、Copilot 页面与聊天面板（编程智能体、免费试用）、顶栏「新建」菜单及全局通用文案
- **v1.3.1**（2026-08）：词典加载容错（多 CDN 降级 + 本地缓存 + 自动重试）；词条收集升级（附带页面类型 / 选择器 / 命中次数）；修复 `/settings/profile` 页面类型误判、标题正则捕获组缺失等 bug；新增「真实执行主脚本」测试与 `verify-locales.js` 静态校验
- **v1.3.0**：新增 issues / pulls / commit / actions / wiki / packages 边缘页面翻译
- **v1.1.0**：架构升级，支持动态内容翻译、描述一键翻译、未命中词条收集

## FAQ

**为什么有些内容没翻译？**
出于安全考虑，代码块、文件名、用户昵称、README 正文等不会被翻译。此外如果某个词条还没收录，欢迎用词条收集功能提 PR 补充。

**会翻译我的代码吗？**
不会。脚本明确跳过代码高亮区域（`.highlight`）、代码编辑器、文件树，只翻界面文案。

**和 maboloshi/github-chinese 有什么区别？**
本项目是独立实现，架构更轻量（单文件主脚本 + 独立词典），并提供词条收集导出、CI 自动化测试等工程化能力，方便社区贡献翻译。

**如何更新脚本？**
Tampermonkey 会自动检查更新；词典通过 `@require` 远程加载，更新仓库后自动生效。若网络无法访问 raw.githubusercontent，脚本自动改用 jsDelivr CDN 并复用本地缓存。

## License

[MIT](LICENSE)

---

## English

**GitHub Chinese Localization** — A lightweight userscript that localizes the GitHub interface into Simplified Chinese: 1176 entries (1107 static + 69 regex) across 48 page types, real-time DOM translation via MutationObserver, Turbo SPA support, one-click repo description translation, and a missed-term collector for contributors. Zero dependencies, 114 automated tests in CI. MIT licensed.
