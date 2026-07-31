# GitHub 中文化插件

一款轻量级的 GitHub 界面中文化油猴脚本，支持 Tampermonkey / Violentmonkey。

## ✨ 功能特性

- 🌐 GitHub 界面全面中文化（菜单、按钮、提示、标题等）
- 🌙 自动适配深色/浅色主题
- ⚡ MutationObserver 实时监听页面变化，动态内容即时翻译
- 🔄 支持 Turbo 页面无刷新切换
- 📝 仓库描述一键翻译（调用 AI 翻译 API）
- 🛡️ 智能跳过代码区域、用户昵称等不应翻译的内容
- 📊 未翻译词条收集器，方便贡献翻译

## 📦 安装方式

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/)
2. 点击下方安装链接：

**[📦 点击安装脚本](https://raw.githubusercontent.com/b8nw27v7wp-bit/GitHub-ZH-Plugin/main/github-zh.user.js)**

## 🔧 工作原理

```
GitHub 页面加载
    ↓
检测页面类型（首页/仓库/个人资料等）
    ↓
加载对应翻译词典
    ↓
遍历 DOM 节点，匹配翻译
    ↓
MutationObserver 监听动态变化
    ↓
实时翻译新增内容
```

## 📁 项目结构

```
github-zh/
├── github-zh.user.js      # 主脚本（油猴脚本入口）
├── locales.js              # 翻译词典
├── README.md               # 项目说明
└── LICENSE                 # MIT 许可证
```

## 🤝 贡献翻译

欢迎提交 PR 补充翻译词条！

1. Fork 本仓库
2. 编辑 `locales.js` 添加翻译
3. 提交 Pull Request

## 📄 许可证

[MIT License](LICENSE)
