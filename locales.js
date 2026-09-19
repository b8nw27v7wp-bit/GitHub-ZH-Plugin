/**
 * locales.js - GitHub 中文化插件翻译词典
 * 按页面类型组织，支持静态翻译和正则翻译
 *
 * Copyright (c) 2026 - Original work
 * License: MIT
 */

const LOCALES = {

    // ==================== 全局配置 ====================
    conf: {
        // URL 路径匹配规则（使用 RegExp 构造避免转义问题）
        rePagePath: new RegExp('^/($|home|dashboard|feed|copilot|signup|login|logout|sessions?|password_reset|orgs|explore|topics|notifications|watching|stars|issues|pulls|repos|search|trending|showcases|new|settings|marketplace|apps|projects|discussions|collections|sponsors|codespaces|features|security|education)'),

        // 仓库路径
        rePagePathRepo: new RegExp('^/[^/]+/[^/]+/(issues|pulls|pull|tree|watchers|stargazers|new|edit|delete|upload|wiki|branches|discussions|releases|packages|tags|labels|milestones?|compare|commit|blob|blame|actions|runs|deployments|security|pulse|community|forks|fork|graphs|network|settings|projects|codespaces|contribute|agents|tasks)'),

        // 组织路径
        rePagePathOrg: new RegExp('^/[^/]+/[^/]+/(repositories|discussions|projects|packages|teams|people|dashboard|settings|topics|audit-log|billing)'),

        // 需要忽略 MutationObserver 的元素（避免翻译代码、搜索框等）
        ignoreMutationSelectors: {
            '*': [
                'header.GlobalNav',           // React 版全局导航
                'header.GlobalNav [class*="Search-module__"]', // React 版顶部搜索按钮
                'qbsearch-input',             // 顶部搜索框自定义元素
                '.highlight',                 // 代码高亮区域
                '.notranslate',               // 标记为不翻译的元素
                '[translate="no"]',           // HTML translate 属性标记
                '.cm-scroller',               // CodeMirror 代码编辑器
                'div.QueryBuilder-StyledInputContainer', // 顶部搜索栏关键词
                '#qb-input-query span',       // 搜索页面搜索栏关键词
                'div.styled-input-content',   // 筛选条
            ],
            'repository/blob': [
                'td.blob-code',               // 代码差异 分屏/同屏
                'div.diff-text-inner',        // 代码差异内容
                'span.PRIVATE_TreeView-item-content-text', // 文件树文件夹/文件名
                '#highlighted-line-menu-positioner', // 代码视图行菜单
                '#repos-sticky-header',       // 代码视图置顶标题
                'nav[data-testid="breadcrumbs"]', // 面包屑导航
                'div[data-testid="breadcrumbs-filename"]', // 面包屑导航文件名部分
            ],
            'repository/pull': [
                'td.blob-code',               // 代码差异 分屏/同屏
                '.js-full-logs-container',    // 工作流运行日志
                'span.PRIVATE_TreeView-item-content-text', // 文件树文件夹/文件名
                'span.ActionList-item-label', // PR 文件树文件夹/文件名
            ],
            'repository/commit': [
                'td.blob-code',               // 代码差异 分屏/同屏
                'div.diff-text-inner',        // 代码差异内容
                'span.PRIVATE_TreeView-item-content-text', // 文件树文件夹/文件名
            ],
            'repository/compare': [
                'tbody',                      // 代码差异
                '.js-preview-body',           // 新建拉取请求正文编辑器预览
                'span.PRIVATE_TreeView-item-content-text', // 文件树文件夹/文件名
            ],
            'repository/tree': [
                'article.markdown-body',      // Markdown 正文
                'tr.react-directory-row',     // 文件列表中文件夹和文件条目
                'nav[data-testid="breadcrumbs"]', // 面包屑导航
                'div[data-testid="breadcrumbs-filename"]', // 面包屑导航文件名部分
            ],
            'repository/actions': [
                'table.highlight',            // 工作流程文件源码视图
                '.js-full-logs-container',    // 工作流运行日志
            ],
            'repository/releases': ['.Box-footer'], // 附件清单
            'repository/issues': [
                'div[aria-live="polite"]>div.markdown-body', // 新建议题正文编辑器预览
                '.markdown-body[data-team-hovercards-enabled="true"]', // 议题正文及编辑器预览
            ],
            'repository/new': ['.cm-scroller'], // 代码编辑器
            'repository/edit': ['.cm-scroller', 'table'], // 代码编辑器 + 代码差异预览
        },

        // 需要忽略的静态元素（永远不翻译）
        ignoreSelectors: {
            'page-profile': [
                'span.p-nickname',            // 用户昵称
                'span.p-name',                // 用户名称
            ],
            'repository': [
                '.AppHeader-context-full',    // 顶部 <username>/<repo_name>
                'strong[itemprop="name"]',    // 仓库名称
                'p.f4.my-3',                  // 仓库简介正文
                'article.markdown-body',      // README 正文
                '#translate-me',              // 翻译按钮标记
                '.my-3.d-flex.flex-items-center', // 仓库简介中的链接
            ],
            'repository/tree': [
                'span.PRIVATE_TreeView-item-content-text', // 文件树项目名称
                'a[itemprop="name codeRepository"]',       // 仓库名称
                'div.react-tree-show-tree-items',          // 左侧文件树项目
            ],
            'repository/blob': [
                '[id^="offset"]',             // 符号引用
                '#filter-results',            // 右侧符号筛选
                '.Text__StyledText-sc-17v1xeu-0', // 右侧符号筛选
            ],
            'repository/commit': [
                'span.ws-pre-wrap',           // 提交说明
                "h4[class^='Title-module__heading']", // 提交标题
            ],
        },

        // 需要翻译文本节点变化的页面类型
        characterDataPages: [
            'repository/new',                // 新建文件
            'repository/edit',               // 编辑文件
            'repository/blob',               // 代码视图
            'repository/pull',               // PR 差异
            'repository/commit',             // 提交差异
            'repository/issues',             // 议题编辑
            'repository/compare',            // 比较页面
            'new',                           // 新建仓库
            'marketplace',                   // 市场
            'copilot',                       // Copilot
            'pulls',                         // 拉取请求列表
            'issues',                        // 议题仪表盘（2025 改版后高度动态化）
            'feed',                          // 动态 Feed（2025 改版）
            'repos',                         // 仓库总览（2026 GA）
        ],
    },

    // ==================== 公共翻译（所有页面通用） ====================
    public: {
        static: {
            // 导航栏
            'Pull requests': '拉取请求',
            'Issues': '议题',
            'Marketplace': '市场',
            'Explore': '探索',
            'Sponsors': '赞助',
            'SignIn': '登录',
            'Register': '注册',
            'Sign in': '登录',
            'Sign up': '注册',
            'Sign out': '退出',
            'Dashboard': '仪表盘',
            'Overview': '概览',
            'Repositories': '仓库',
            'Organizations': '组织',
            'Stars': '星标',

            // 通用按钮
            'Save': '保存',
            'Cancel': '取消',
            'Delete': '删除',
            'Edit': '编辑',
            'Close': '关闭',
            'Copy': '复制',
            'Download': '下载',
            'Upload': '上传',
            'Search': '搜索',
            'Filter': '筛选',
            'Sort': '排序',
            'New': '新建',
            'Create': '创建',
            'Update': '更新',
            'Submit': '提交',
            'Confirm': '确认',
            'Back': '返回',
            'Next': '下一步',
            'Previous': '上一步',
            'Loading...': '加载中...',
            'Settings': '设置',
            'Actions': '操作',
            'Options': '选项',
            'View': '查看',
            'Show': '显示',
            'Hide': '隐藏',
            'More': '更多',
            'Less': '收起',
            'All': '全部',
            'None': '无',
            'Open': '打开',
            'Closed': '已关闭',
            'Merged': '已合并',

            // 常用操作
            'Accept': '接受',
            'Activate': '激活',
            'Add': '添加',
            'Apply': '应用',
            'Approve': '批准',
            'Archive': '归档',
            'Block': '屏蔽',
            'Browse': '浏览',
            'Change': '更改',
            'Check': '检查',
            'Choose': '选择',
            'Clear': '清除',
            'Clone': '克隆',
            'Collapse': '折叠',
            'Comment': '评论',
            'Compare': '比较',
            'Configure': '配置',
            'Connect': '连接',
            'Continue': '继续',
            'Convert': '转换',
            'Customize': '自定义',
            'Deploy': '部署',
            'Disable': '禁用',
            'Enable': '启用',
            'Export': '导出',
            'Find': '查找',
            'Follow': '关注',
            'Fork': '复刻',
            'Generate': '生成',
            'Import': '导入',
            'Install': '安装',
            'Invite': '邀请',
            'Join': '加入',
            'Label': '标签',
            'Learn': '学习',
            'Lock': '锁定',
            'Manage': '管理',
            'Merge': '合并',
            'Monitor': '监控',
            'Move': '移动',
            'Order': '排序',
            'Organize': '组织',
            'Pin': '置顶',
            'Preview': '预览',
            'Private': '私有',
            'Protect': '保护',
            'Publish': '发布',
            'Pull': '拉取',
            'Push': '推送',
            'Read': '读取',
            'Rebase': '变基',
            'Release': '发布',
            'Remove': '移除',
            'Rename': '重命名',
            'Replace': '替换',
            'Request': '请求',
            'Reset': '重置',
            'Resolve': '解决',
            'Restore': '恢复',
            'Revert': '回退',
            'Review': '审查',
            'Select': '选择',
            'Send': '发送',
            'Share': '分享',
            'Sign': '签名',
            'Start': '开始',
            'Stop': '停止',
            'Suspend': '挂起',
            'Switch': '切换',
            'Tag': '标签',
            'Test': '测试',
            'Transfer': '转让',
            'Unarchive': '取消归档',
            'Undo': '撤销',
            'Unfollow': '取消关注',
            'Unlock': '解锁',
            'Unpin': '取消置顶',
            'Verify': '验证',
            'Watch': '关注',

            // 常用短语
            'About this page': '关于此页面',
            'Account': '账户',
            'Account switcher': '账户切换',
            'Active': '活跃',
            'Activity': '活动',
            'Add a comment': '添加评论',
            'Add a description': '添加描述',
            'Add a title': '添加标题',
            'Add files': '添加文件',
            'Add to list': '添加到清单',
            'Advanced': '高级',
            'All done': '全部完成',
            'Appearance': '外观',
            'Attach files': '附加文件',
            'Author': '作者',
            'Avatar': '头像',
            'Billing': '账单',
            'Branch': '分支',
            'Branches': '分支',
            'Change password': '更改密码',
            'Code': '代码',
            'Collaborators': '协作者',
            'Collections': '精选集',
            'Comments': '评论',
            'Company': '公司',
            'Commit': '提交',
            'Commits': '提交',
            'Community': '社区',
            'Contact': '联系',
            'Contribute': '贡献',
            'Contributors': '贡献者',
            'Create new': '新建',
            'Customize your pins': '自定义置顶',
            'Dark': '深色',
            'Default': '默认',
            'Deployments': '部署',
            'Description': '描述',
            'Design': '设计',
            'Disabled': '已禁用',
            'Draft': '草稿',
            'Email': '邮箱',
            'Enabled': '已启用',
            'Enterprise': '企业版',
            'Environment': '环境',
            'Error': '错误',
            'Events': '活动',
            'External': '外部',
            'Features': '功能',
            'File': '文件',
            'Files': '文件',
            'Forks': '复刻',
            'General': '常规',
            'Get started': '开始使用',
            'Gists': '代码片段',
            'Header': '头部',
            'Help': '帮助',
            'Home': '主页',
            'Hook': '钩子',
            'Hooks': '钩子',
            'In progress': '进行中',
            'Information': '信息',
            'Installed': '已安装',
            'Internal': '内部',
            'Key': '密钥',
            'Keys': '密钥',
            'Labels': '标签',
            'Language': '语言',
            'Languages': '语言',
            'Last updated': '最后更新',
            'Latest': '最新',
            'Light': '浅色',
            'Link': '链接',
            'Location': '位置',
            'Locked': '已锁定',
            'Log': '日志',
            'Login': '登录',
            'Logout': '退出',
            'Main': '主分支',
            'Mentions': '提及',
            'Message': '消息',
            'Milestone': '里程碑',
            'Milestones': '里程碑',
            'More options': '更多选项',
            'Name': '名称',
            'No': '否',
            'Notifications': '通知',
            'OK': '确定',
            'Offline': '离线',
            'Online': '在线',
            'Opened': '已打开',
            'Organization': '组织',
            'Owner': '所有者',
            'Package': '包',
            'Packages': '包',
            'Page': '页面',
            'Pages': '页面',
            'Password': '密码',
            'Pause': '暂停',
            'Pending': '待定',
            'Permissions': '权限',
            'Personal': '个人',
            'Plan': '计划',
            'Plans': '计划',
            'Policies': '策略',
            'Policy': '策略',
            'Profile': '个人资料',
            'Projects': '项目',
            'Public': '公开',
            'Pulse': '活跃度',
            'Queued': '排队中',
            'Readme': '自述文件',
            'Refine': '优化',
            'Releases': '发行版',
            'Reopen': '重新打开',
            'Repository': '仓库',
            'Required': '必需',
            'Role': '角色',
            'Rules': '规则',
            'Run': '运行',
            'Runs': '运行',
            'Runtime': '运行时',
            'Security': '安全',
            'Selected': '已选择',
            'Sender': '发送者',
            'Source': '来源',
            'Stale': '过期',
            'Star': '星标',
            'Status': '状态',
            'Storage': '存储',
            'Subscribe': '订阅',
            'Subscribed': '已订阅',
            'Summary': '摘要',
            'Support': '支持',
            'Syntax': '语法',
            'System': '系统',
            'Tags': '标签',
            'Teams': '团队',
            'Title': '标题',
            'Token': '令牌',
            'Tools': '工具',
            'Topic': '话题',
            'Topics': '话题',
            'Traffic': '流量',
            'Two-factor authentication': '双重身份验证',
            'Type': '类型',
            'Types': '类型',
            'Uninstall': '卸载',
            'Unsubscribe': '取消订阅',
            'Updated': '已更新',
            'Upgrade': '升级',
            'URL': '网址',
            'Usage': '使用量',
            'User': '用户',
            'Users': '用户',
            'Version': '版本',
            'Versions': '版本',
            'View all': '查看全部',
            'View details': '查看详细',
            'View more': '查看更多',
            'Visibility': '可见性',
            'Warning': '警告',
            'Wiki': '维基',
            'Yes': '是',
            'You': '你',
            'Your': '你的',

            // 新版界面（2025-2026 改版）
            'Create new...': '新建…',
            'New repository': '新仓库',
            'Import repository': '导入仓库',
            'New codespace': '新建代码空间',
            'New gist': '新建代码片段',
            'New organization': '新建组织',
            'New project': '新建项目',
            'New agent task': '新建智能体任务',
            'Copilot Chat': 'Copilot 聊天',
            'Ask Copilot': '询问 Copilot',
            'Agents': '智能体',
            'Learn more': '了解更多',
            'Read more': '阅读更多',
            'See more': '查看更多',
            // 顶栏通知面板提示
            'You have no unread notifications': '您没有未读通知',
            'You have unread notifications': '您有未读通知',

            // 时间相关
            'just now': '刚刚',
            'less than a minute ago': '不到 1 分钟前',
            'minutes ago': '分钟前',
            'hour ago': '小时前',
            'hours ago': '小时前',
            'day ago': '天前',
            'days ago': '天前',
            'week ago': '周前',
            'weeks ago': '周前',
            'month ago': '个月前',
            'months ago': '个月前',
            'year ago': '年前',
            'years ago': '年前',
            'on': '',
        },
        regexp: [
            [new RegExp('^(\\d+) (?:results?)'), '$1 个结果'],
            [new RegExp('^(\\d+) (?:commits?)'), '$1 次提交'],
            [new RegExp('^(\\d+) (?:files? changed)'), '$1 个文件变更'],
            [new RegExp('^(\\d+) (?:additions?)'), '$1 处新增'],
            [new RegExp('^(\\d+) (?:deletions?)'), '$1 处删除'],
            [new RegExp('^(\\d+) (?:changes?)'), '$1 处变更'],
            [new RegExp('^(\\d+) (?:repositories?)'), '$1 个仓库'],
            [new RegExp('^(\\d+) (?:followers?)'), '$1 位关注者'],
            [new RegExp('^(\\d+) (?:following)'), '$1 位正在关注'],
            [new RegExp('^(\\d+) (?:Open)'), '$1 个打开'],
            [new RegExp('^(\\d+) (?:Closed)'), '$1 个已关闭'],
            [new RegExp('^(\\d+) (?:branches?)'), '$1 个分支'],
            [new RegExp('^(\\d+) (?:tags?)'), '$1 个标签'],
            [new RegExp('^(\\d+) (?:releases?)'), '$1 个发行版'],
            [new RegExp('^(\\d+) (?:reviews?)'), '$1 个审查'],
            [new RegExp('^(\\d+) (?:comments?)'), '$1 条评论'],
            [new RegExp('^(\\d+) (?:solutions?)'), '$1 个解决方案'],
            [new RegExp('^(\\d+) (?:upvotes?)'), '$1 个赞同'],
        ],
    },

    // ==================== 首页/仪表盘 ====================
    dashboard: {
        static: {
            'Feed': '动态',
            'Your repositories': '你的仓库',
            'Your projects': '你的项目',
            'Top Repositories': '常用仓库',
            'Recent activity': '最近活动',
            'Repository name': '仓库名称',
            'Create repository': '创建仓库',
            'Create new repository': '创建新仓库',
            'Import repository': '导入仓库',
            'New repository': '新仓库',
            'Give us a name': '给仓库起个名',
            'Try again with a different name': '换个名字试试',
            'Great repository names are short and memorable': '好的仓库名简短好记',
            'Type a name or a short description': '输入名称或简短描述',
            'Available for GitHub Free': 'GitHub Free 可用',
            'This repository is a mirror': '此仓库是镜像',
            'README': '自述文件',
            'Stargazers': '星标者',
            'Watchers': '关注者',
            'Pinned': '已置顶',
            'Up to date': '已是最新',
            // 新版首页功能区与 Copilot 入口
            'Ask': '询问',
            'Task': '任务',
            'Write code': '编写代码',
            'Models': '模型',
            'Create issue': '创建议题',
            'Agent sessions': '智能体会话',
            'Start a session': '启动会话',
            'Open in Copilot Chat': '在 Copilot Chat 中打开',
            'Assign to Copilot': '分配给 Copilot',
            'uses AI. Check for mistakes.': '由 AI 生成。请注意甄别。',
            // 新版 feed
            'Feed filters': '动态筛选器',
            'Announcements': '公告',
            'Send feedback': '发送反馈',
            'Try the new experience': '体验新版',
            // 新版 My Work 选项卡（2025-2026 改版）
            'My Work': '我的工作',
            'Create a view': '创建视图',
            'Save view': '保存视图',
            'Saved views': '已保存的视图',
            'Customize': '自定义',
        },
        regexp: [
            [new RegExp('^(\\d+) (?:results?)'), '$1 个结果'],
        ],
    },

    // ==================== 动态 Feed（github.com/feed） ====================
    feed: {
        title: {
            regexp: [
                [new RegExp('^Feed\\s*·\\s*GitHub$'), '动态 · GitHub'],
            ],
        },
        static: {
            'Feed': '动态',
            'Feed filters': '动态筛选器',
            'Following': '正在关注',
            'Send feedback': '发送反馈',
        },
    },

    // ==================== 仓库页面 ====================
    repository: {
        title: {
            regexp: [
                [new RegExp('^(.+?)\\s*/\\s*(.+?)\\s*·\\s*GitHub$'), '$1/$2 · GitHub'],
            ],
        },
        static: {
            // 仓库头部
            'About': '关于',
            'License': '许可证',
            'Watchers': '关注者',
            'Insights': '洞察',

            'Download ZIP': '下载 ZIP',
            'Open with GitHub Desktop': '用 GitHub Desktop 打开',
            'Add file': '添加文件',
            'Create new file': '创建新文件',
            'Upload files': '上传文件',
            'Find file': '查找文件',
            'Go to file': '转到文件',
            'Search or jump to...': '搜索或跳转...',
            'Unwatch': '取消关注',
            'Unstar': '取消星标',

            // 文件列表
            'Latest commit': '最新提交',
            'Git stats': 'Git 统计',
            'Commit history': '提交历史',

            // 分支相关
            'branch': '分支',
            'tag': '标签',
            'default': '默认',
            'branches': '分支',
            'tags': '标签',
            'Switch branches/tags': '切换分支/标签',
            'All branches': '所有分支',
            'Default branch': '默认分支',

            'committing': '提交中',
            'committed': '已提交',
            'Committer': '提交者',
            'merge': '合并',
            'merged': '已合并',

            // PR 相关
            'Pull request': '拉取请求',
            'Open a pull request': '创建拉取请求',
            'Compare & pull request': '比较并创建拉取请求',
            'Reviewers': '审查者',
            'Assignees': '指派',
            'Linked issues': '关联议题',
            'Merge pull request': '合并拉取请求',
            'Rebase and merge': '变基并合并',
            'Squash and merge': '压缩并合并',
            'Close pull request': '关闭拉取请求',

            // Issues 相关
            'New issue': '新建议题',
            'Open a new issue': '打开新议题',
            'Assignee': '指派人',
            'New milestone': '新里程碑',
            'New label': '新标签',

            // Actions 相关
            'All workflows': '所有工作流',
            'New workflow': '新建工作流',
            'Run workflow': '运行工作流',
            'Workflows': '工作流',
            'triggered': '触发',
            'Total duration': '总耗时',
            'Artifacts': '构件',
            'Logs': '日志',
            'Re-run all jobs': '重新运行所有作业',
            'Cancel workflow': '取消工作流',

            'Access': '访问',
            'Branch protection rules': '分支保护规则',
            'Environments': '环境',
            'Pages': 'GitHub Pages',
            'Deploy keys': '部署密钥',
            'Secrets and variables': '密钥和变量',
            'Integrations': '集成',
            'Change repository name': '更改仓库名称',
            'Delete this repository': '删除此仓库',
            'Danger Zone': '危险区域',

            'Pre-release': '预发布',
            'Create a new release': '创建新发行版',
            'Generate release notes': '生成发行说明',
            'Release assets': '发行版资源',
            'Binary files': '二进制文件',
            'Source code': '源代码',

            // 其他
            'About this repository': '关于此仓库',
            'Sponsor': '赞助',
            'Report repository': '举报仓库',
            'Nothing to show': '暂无内容',
        },
        regexp: [
            [new RegExp('^(\\d+) (?:commits?)'), '$1 次提交'],
            [new RegExp('^(\\d+) (?:files? changed)'), '$1 个文件变更'],
            [new RegExp('^(\\d+) (?:additions?)'), '$1 处新增'],
            [new RegExp('^(\\d+) (?:deletions?)'), '$1 处删除'],
            [new RegExp('^(\\d+) (?:changes?)'), '$1 处变更'],
        ],
    },

    // ==================== 用户资料页面 ====================
    'page-profile': {
        title: {
            regexp: [
                [new RegExp('^(.+?)\\s*\\(.*?\\)\\s*·\\s*GitHub$'), '$1 · GitHub'],
            ],
        },
        static: {
            'Followers': '关注者',
            'Following': '正在关注',
            'repositories': '个仓库',
            'Achievements': '成就',
            'Sponsoring': '赞助中',
            'Sponsor': '赞助',
            'Top Languages': '常用语言',
            'Most used': '最常使用',
            'Contribution settings': '贡献设置',
            'Contributions in the last year': '过去一年的贡献',
            'Private contributions': '私有贡献',
            'Public contributions': '公开贡献',
            'Include private contributions': '包含私有贡献',
            'Contribution calendar': '贡献日历',
            'Create a repository': '创建仓库',
            'Popular repositories': '热门仓库',
            'Pinned': '已置顶',
        },
        regexp: [
            [new RegExp('^(\\d+) (?:repositories?)'), '$1 个仓库'],
            [new RegExp('^(\\d+) (?:followers?)'), '$1 位关注者'],
            [new RegExp('^(\\d+) (?:following)'), '$1 位正在关注'],
        ],
    },

    // ==================== 设置页面 ====================
    settings: {
        title: {
            static: {
                'Your profile': '个人资料',
                'Your account': '你的账户',
                'Your repositories': '你的仓库',
                'Your organizations': '你的组织',
                'Your projects': '你的项目',
                'Your stars': '你的星标',
                'Your sponsors': '你的赞助者',
                'Your gists': '你的代码片段',
            },
        },
        static: {
            // 基础设置
            'Public profile': '公开资料',
            'Public email': '公开邮箱',
            'Bio': '个人简介',
            'Social accounts': '社交账号',
            'Update profile': '更新资料',
            'Change username': '更改用户名',

            'SSH and GPG keys': 'SSH 和 GPG 密钥',
            'Authentication log': '认证日志',
            'Sessions': '会话',
            'Security log': '安全日志',
            'Devices': '设备',
            'Emails': '邮箱',
            'Blocked users': '屏蔽的用户',
            'Interaction limits': '互动限制',

            'Email preferences': '邮箱偏好',
            'Watching': '正在关注',
            'Participating': '参与中',
            '@Mentions': '@提及',

            'Plans and usage': '计划和用量',
            'Payment information': '支付信息',
            'Spending limits': '支出限额',

            // 开发者
            'Developer settings': '开发者设置',
            'OAuth Apps': 'OAuth 应用',
            'Personal access tokens': '个人访问令牌',
            'GitHub Apps': 'GitHub 应用',

            'Accessibility': '无障碍',
            'SSH keys': 'SSH 密钥',
            'GPG keys': 'GPG 密钥',
            'Code review limits': '代码审查限制',
            'Saved replies': '保存的回复',
            'Scheduled reminders': '定时提醒',
            'Delete your account': '删除你的账户',
            'Danger zone': '危险区域',
            'Change your avatar': '更改头像',

            // Copilot 与安全（2025-2026 新增设置区）
            'Rulesets': '规则集',
            'New ruleset': '新建规则集',
            'Models': '模型',
            'Content exclusions': '内容排除',
            'Budgets': '预算',
            'Usage report': '用量报告',
            'Custom properties': '自定义属性',
            'Allowed values': '允许值',
            'Multi select': '多选',
            'Merge queue': '合并队列',
            'Advanced Security': '高级安全',
            'Secret Protection': '密钥保护',
            'Code Security': '代码安全',
            'Push protection': '推送保护',
        },
        regexp: [],
    },

    // ==================== 搜索页面 ====================
    search: {
        title: {
            static: {
                'GitHub Search': 'GitHub 搜索',
            },
        },
        static: {
            'Search GitHub': '搜索 GitHub',
            'Search or jump to...': '搜索或跳转...',
            'Discussions': '讨论',
            'Wikis': '维基',
            'Sorting': '排序',
            'Best match': '最佳匹配',
            'Most stars': '最多星标',
            'Fewest stars': '最少星标',
            'Most forks': '最多复刻',
            'Fewest forks': '最少复刻',
            'Recently updated': '最近更新',
            'Least recently updated': '最久未更新',
            'Filter by language': '按语言筛选',
            'results': '个结果',
            'result': '个结果',
            'No results matched your search': '没有匹配的搜索结果',
            'Try different search terms': '尝试不同的搜索词',
        },
        regexp: [
            [new RegExp('^(\\d+) (?:results?)'), '$1 个结果'],
        ],
    },

    // ==================== 通知页面 ====================
    notifications: {
        static: {
            'Inbox': '收件箱',
            'Unread': '未读',
            'Read': '已读',
            'Done': '已完成',
            'Mark all as read': '全部标为已读',
            'Mark as read': '标为已读',
            'Mark as unread': '标为未读',
            'Mark as done': '标为完成',
            'Ignore thread': '忽略对话',
            'Delete thread': '删除对话',
            'Notification settings': '通知设置',
            'Watching': '正在关注',
            'Participating': '参与中',
            '@Mentions': '@提及',
            'No new notifications': '没有新通知',
            'Global': '全局',
            // 侧栏筛选器（新版收件箱）
            'Filters': '筛选器',
            'Saved': '已保存',
            // 批量操作下拉菜单
            'Unsubscribe': '退订',
            'Select all': '全选',
        },
    },

    // ==================== 议题页面 ====================
    issues: {
        static: {
            'New issue': '新建议题',
            'Assignee': '指派人',
            'Filters': '筛选',
            'Lock conversation': '锁定对话',
            'Unlock conversation': '解锁对话',
            'Transfer issue': '转让议题',
            'Reopen issue': '重新打开议题',
            'Close issue': '关闭议题',
            // 新版 Issues 仪表盘（2025 改版）
            'Recent activity': '最近活动',
            'Recently viewed': '最近查看',
            'Advanced search': '高级搜索',
        },
        regexp: [
            [new RegExp('^(\\d+) (?:Open)'), '$1 个打开'],
            [new RegExp('^(\\d+) (?:Closed)'), '$1 个已关闭'],
            [new RegExp('^(\\d+) (?:results?)'), '$1 个结果'],
        ],
    },

    // ==================== 拉取请求页面 ====================
    pulls: {
        static: {
            'Reviewers': '审查者',
            'New pull request': '新建拉取请求',
            'Base': '基础',
            'Changes': '更改',
            'Merge pull request': '合并拉取请求',
            'Rebase and merge': '变基并合并',
            'Squash and merge': '压缩并合并',
            'Close pull request': '关闭拉取请求',
            'Files changed': '文件更改',
            'Enable auto-merge': '启用自动合并',
            'Ready for review': '准备审查',
            'Request reviewers': '请求审查',
            'Convert to draft': '转为草稿',
            'Mark as ready for review': '标记为准备审查',
            // 新版 PR 仪表盘（Inbox + Saved views，2026-07 GA）
            'Inbox': '收件箱',
            'Saved views': '已保存的视图',
            'Create a view': '创建视图',
            'Save view': '保存视图',
            'Authored by me': '我创建的',
            'Assigned to me': '指派给我的',
            'Involves me': '与我相关的',
            'Review requested': '请求审查的',
            'Ready to merge': '可合并',
            'Merge queue': '合并队列',
            'Recent activity': '最近活动',
        },
    },

    // ==================== 认证页面 ====================
    'session-authentication': {
        title: {
            static: {
                'Sign in to GitHub · GitHub': '登录 GitHub · GitHub',
            },
        },
        static: {
            'Username or email address': '用户名或邮箱地址',
            'Forgot password?': '忘记密码？',
            'Sign in with a passkey': '用通行密钥登录',
            'Create an account': '创建账户',
            'New to GitHub?': 'GitHub 新用户？',
            'Sign in to GitHub': '登录 GitHub',
        },
    },

    // ==================== 创建仓库页面 ====================
    'repository/new': {
        title: {
            static: {
                'Create a new repository · GitHub': '创建新仓库 · GitHub',
            },
        },
        static: {
            'Create a new repository': '创建新仓库',
            'Repository name': '仓库名称',
            'Optional': '可选',
            'Anyone on the internet can see this repository': '任何人都可以看到此仓库',
            'You choose who can see and commit to this repository': '你选择谁可以看到和提交到此仓库',
            'Initialize this repository with:': '使用以下内容初始化仓库：',
            'Add a README file': '添加 README 文件',
            'Add .gitignore': '添加 .gitignore',
            'Choose a license': '选择许可证',
            'License': '许可证',
            'Include all branches': '包含所有分支',
            'Create repository': '创建仓库',
        },
    },


    // ==================== 议题页面（仓库内） ====================
    'repository/issues': {
        title: {
            regexp: [
                [new RegExp('^(.+?)\\s*Issues\\s*·\\s*GitHub$'), '$1 · 议题 · GitHub'],
                [new RegExp('^Issues\\s*·\\s*(.+?)\\s*·\\s*GitHub$'), '议题 · $1 · GitHub'],
                [new RegExp('^(.+?)\\s*·\\s*Issue\\s*#(\\d+)\\s*·\\s*GitHub$'), '$1 · 议题 #$2 · GitHub'],
            ],
        },
        static: {
            // 列表页
            'All issues': '所有议题',
            'Your issues': '您的议题',
            'Create new issue': '新建议题',
            'New issue': '新建议题',
            'Open': '开启',
            'Assignee': '指派人',
            'Newest': '最新',
            'Oldest': '最旧',
            'Most commented': '评论最多',
            'Least commented': '评论最少',
            'Recently updated': '最近更新',
            'No results matched your search': '没有与您的搜索匹配的结果',
            'Clear current search query, filters, and sorts': '清除当前搜索查询、筛选和排序',
            'Filters': '筛选',
            'Search all issues': '搜索所有议题',
            'Jump to issue': '跳转到议题',
            'Previous': '上一页',
            'Next': '下一页',
            // 详情页
            'Close issue': '关闭议题',
            'Reopen issue': '重新打开议题',
            'Not watching': '未关注',
            'Participants': '参与者',
            'Linked pull requests': '关联的拉取请求',
            'None yet': '暂无',
            'No one assigned': '未指派任何人',
            'No milestone': '无里程碑',
            'No labels': '无标签',
            'This issue has no labels yet': '此议题暂无标签',
            'Member': '成员',
            'Pin issue': '置顶议题',
            'Unpin issue': '取消置顶议题',
            'Transfer issue': '转移议题',
            'Delete issue': '删除议题',
            'Copy link': '复制链接',
            'Quote reply': '引用回复',
            'Add a reaction': '添加表情反应',
            'Lock conversation': '锁定对话',
            'Unlock conversation': '解锁对话',
            'Edit comment': '编辑评论',
            'Delete comment': '删除评论',
            'Leave a comment': '发表评论',
            'Write': '撰写',
            'Markdown is supported': '支持 Markdown',
            'Comment now': '立即评论',
            'Close with comment': '评论并关闭',
            'Close without comment': '直接关闭',
            'Reopen with comment': '评论并重新打开',
            'Reopen without comment': '直接重新打开',
            'Created by': '由...创建',
            'edited': '已编辑',
            // 子议题 / 类型 / 依赖（2025 GA）
            'Sub-issues': '子议题',
            'Create sub-issue': '创建子议题',
            'Add existing issue': '添加现有议题',
            'Convert to sub-issue': '转换为子议题',
            'Blocked by': '被阻止',
            'Blocking': '阻止中',
            'Duplicate': '重复',
            'Mark as duplicate': '标记为重复',
            'Feature': '功能',
            'Task': '任务',
            'Close as completed': '以已完成关闭',
            'Close as not planned': '以不计划关闭',
            'Close as duplicate': '以重复关闭',
            'Create more': '继续创建',
            'Parent': '父议题',
        },
        regexp: [
            [new RegExp('^(\\d+) Open$'), '$1 个开启'],
            [new RegExp('^(\\d+) Closed$'), '$1 个已关闭'],
            [new RegExp('^([\\w.-]+) opened this issue$'), '$1 打开了此议题'],
            [new RegExp('^([\\w.-]+) closed this issue$'), '$1 关闭了此议题'],
            [new RegExp('^(\\d+) participants?$'), '$1 位参与者'],
        ],
    },

    // ==================== 拉取请求页面（仓库内） ====================
    'repository/pulls': {
        title: {
            regexp: [
                [new RegExp('^(.+?)\\s*Pull Requests\\s*·\\s*GitHub$'), '$1 · 拉取请求 · GitHub'],
                [new RegExp('^Pull Requests\\s*·\\s*(.+?)\\s*·\\s*GitHub$'), '拉取请求 · $1 · GitHub'],
                [new RegExp('^(.+?)\\s*·\\s*Pull Request\\s*#(\\d+)\\s*·\\s*GitHub$'), '$1 · 拉取请求 #$2 · GitHub'],
            ],
        },
        static: {
            // 列表页
            'All pull requests': '所有拉取请求',
            'Your pull requests': '您的拉取请求',
            'New pull request': '新建拉取请求',
            'Open': '开启',
            'Assignee': '指派人',
            'Reviewers': '审查者',
            'Newest': '最新',
            'Oldest': '最旧',
            'Most commented': '评论最多',
            'Least commented': '评论最少',
            'Recently updated': '最近更新',
            'No results matched your search': '没有与您的搜索匹配的结果',
            'Clear current search query, filters, and sorts': '清除当前搜索查询、筛选和排序',
            'Search all pull requests': '搜索所有拉取请求',
            'You don’t have any open pull requests in this repository': '此仓库中没有任何开启的拉取请求',
            'Create a new pull request': '创建新的拉取请求',
            'ProTip!': '小贴士！',
            'Jump to pull request': '跳转到拉取请求',
            'Previous': '上一页',
            'Next': '下一页',
            // 详情页
            'Conversation': '对话',
            'Checks': '检查',
            'Files changed': '文件变更',
            'Ready for review': '准备就绪，等待审查',
            'Mark as draft': '标记为草稿',
            'Convert to draft': '转换为草稿',
            'Open a draft pull request': '创建草稿拉取请求',
            'Compare & pull request': '比较并创建拉取请求',
            'Create pull request': '创建拉取请求',
            'Merge pull request': '合并拉取请求',
            'Squash and merge': '压缩并合并',
            'Rebase and merge': '变基并合并',
            'Close pull request': '关闭拉取请求',
            'Reopen pull request': '重新打开拉取请求',
            'Merge without waiting for requirements to be met': '无需等待要求满足即合并',
            'Add a detailed description': '添加详细描述',
            'This branch has no conflicts with the base branch': '此分支与基础分支无冲突',
            'Only those with write access to this repository can merge pull requests': '只有具有此仓库写入权限的人才能合并拉取请求',
            'Review changes': '审查更改',
            'Request changes': '请求更改',
            'Leave a review': '提交审查',
            'Review summary': '审查摘要',
            'Update branch': '更新分支',
            'Create a merge commit': '创建合并提交',
            'Squash and merge commits': '压缩合并提交',
            'Rebase and merge commits': '变基合并提交',
            'Delete branch': '删除分支',
            'This branch was deleted': '此分支已被删除',
            'View git blame': '查看 git 责备视图',
            'No one—you’re good!': '无人—一切就绪！',
            'No reviewers': '无审查者',
            'Merge queue': '合并队列',
        },
        regexp: [
            [new RegExp('^(\\d+) Open$'), '$1 个开启'],
            [new RegExp('^(\\d+) Closed$'), '$1 个已关闭'],
            [new RegExp('^(\\d+) Merged$'), '$1 个已合并'],
            [new RegExp('^([\\w.-]+) wants to merge (\\d+) commits? into'), '$1 想合并 $2 个提交到'],
            [new RegExp('^([\\w.-]+) opened this pull request$'), '$1 打开了此拉取请求'],
            [new RegExp('^([\\w.-]+) closed this pull request$'), '$1 关闭了此拉取请求'],
            [new RegExp('^([\\w.-]+) merged this pull request$'), '$1 合并了此拉取请求'],
            [new RegExp('^Reviewers \\((\\d+)\\)$'), '审查者（$1）'],
            [new RegExp('^Assignees \\((\\d+)\\)$'), '指派（$1）'],
            [new RegExp('^Labels \\((\\d+)\\)$'), '标签（$1）'],
        ],
    },

    // ==================== 提交详情页面 ====================
    'repository/commit': {
        title: {
            regexp: [
                [new RegExp('^(.+?)\\s*·\\s*[a-f0-9]{7,40}\\s*·\\s*GitHub$'), '$1 · GitHub'],
            ],
        },
        static: {
            'Commit details': '提交详情',
            'Browse the repository at this point in the history': '浏览历史中此时间点的仓库',
            'Browse files': '浏览文件',
            'Parent': '父提交',
            'Showing': '显示',
            'changed files': '个变更文件',
            'with': '共',
            'additions': '处新增',
            'deletions': '处删除',
            'Load diff': '加载差异',
            'Unified diff': '统一视图',
            'Split': '分屏视图',
            'View file': '查看文件',
            'View raw': '查看原始',
            'Copy path': '复制路径',
            'View blame': '查看责备视图',
            'This commit does not belong to any branch on this repository, and may belong to a fork outside of the repository': '此提交不属于此仓库的任何分支，可能属于仓库外的复刻',
            'This commit was created on GitHub.com and signed with a verified signature': '此提交在 GitHub.com 上创建，并带有已验证的签名',
            'This commit was signed with the committer’s verified signature': '此提交已用提交者已验证的签名签署',
            'Verified': '已验证',
            'View verified signature': '查看已验证的签名',
            'No commits': '无提交',
            'Commit statuses': '提交状态',
            'All checks have passed': '所有检查均已通过',
            'Some checks haven’t completed yet': '部分检查尚未完成',
            'All checks have failed': '所有检查均失败',
            'No checks have been run yet': '尚未运行任何检查',
            'This check was cancelled': '此检查已被取消',
            'This check was skipped': '此检查已被跳过',
            'Revert commit': '还原提交',
            'Revert this commit': '还原此提交',
            'Create a revert commit': '创建还原提交',
            'Revert changes from this commit': '还原此提交中的更改',
            'Commit message': '提交信息',
            'Commit description': '提交描述',
            'Committed on': '提交于',
            'Authored by': '作者',
        },
        regexp: [
            [new RegExp('^(\\d+) changed files?$'), '$1 个文件变更'],
            [new RegExp('^(\\d+) additions?$'), '$1 处新增'],
            [new RegExp('^(\\d+) deletions?$'), '$1 处删除'],
            [new RegExp('^([\\w.-]+) committed$'), '$1 已提交'],
            [new RegExp('^Verified \\[([\\w]+)\\]$'), '已验证 [$1]'],
        ],
    },

    // ==================== Actions 页面 ====================
    'repository/actions': {
        title: {
            regexp: [
                [new RegExp('^(.+?)\\s*Actions\\s*·\\s*GitHub$'), '$1 · 操作 · GitHub'],
                [new RegExp('^Actions\\s*·\\s*(.+?)\\s*·\\s*GitHub$'), '操作 · $1 · GitHub'],
            ],
        },
        static: {
            'Get started with GitHub Actions': '开始使用 GitHub Actions',
            'Automate any workflow': '自动化任何工作流',
            'All workflows': '所有工作流',
            'Workflows': '工作流',
            'New workflow': '新建工作流',
            'Run workflow': '运行工作流',
            'Re-run all jobs': '重新运行所有作业',
            'Re-run failed jobs': '重新运行失败的作业',
            'Cancel workflow': '取消工作流',
            'Edit workflow': '编辑工作流',
            'Delete workflow': '删除工作流',
            'View workflow file': '查看工作流文件',
            'Workflow runs': '工作流运行',
            'Total duration': '总耗时',
            'Artifacts': '构件',
            'Logs': '日志',
            'Jobs': '作业',
            'All jobs': '所有作业',
            'Annotations': '注释',
            'Recent': '最近',
            'in progress': '进行中',
            'queued': '排队中',
            'completed': '已完成',
            'success': '成功',
            'failure': '失败',
            'cancelled': '已取消',
            'skipped': '已跳过',
            'stale': '过期',
            'triggered': '触发',
            'Started': '开始',
            'Finished': '完成',
            'Check runs': '检查运行',
            'Check suites': '检查套件',
            'Enable workflow': '启用工作流',
            'Disable workflow': '禁用工作流',
            'This workflow has a YAML error': '此工作流存在 YAML 错误',
            'There was an error reading this workflow': '读取此工作流时出错',
            'Set up a workflow yourself': '自行创建工作流',
            'Simple workflow': '简单工作流',
            'Deploy to GitHub Pages': '部署到 GitHub Pages',
            'Create new job': '新建作业',
            'Build': '构建',
            'Review deployments': '审核部署',
            'Required reviewers': '必需的审核者',
            'Approve and deploy': '批准并部署',
        },
        regexp: [
            [new RegExp('^(\\d+) workflow runs?$'), '$1 个工作流运行'],
            [new RegExp('^(\\d+) jobs?$'), '$1 个作业'],
            [new RegExp('^(\\d+) artifacts?$'), '$1 个构件'],
            [new RegExp('^([\\w.-]+) triggered this run$'), '$1 触发了此运行'],
            [new RegExp('^Run #(\\d+)$'), '运行 #$1'],
        ],
    },

    // ==================== Wiki 页面 ====================
    'repository/wiki': {
        title: {
            regexp: [
                [new RegExp('^(.+?)\\s*·\\s*([\\w.-]+)\\s*·\\s*GitHub$'), '$1 · $2 · GitHub'],
                [new RegExp('^(.+?)\\s*Wiki\\s*·\\s*GitHub$'), '$1 · 维基 · GitHub'],
            ],
        },
        static: {
            'Home': '首页',
            'New page': '新页面',
            'Edit page': '编辑页面',
            'Delete page': '删除页面',
            'Clone this wiki locally': '在本地克隆此维基',
            'Create the first page': '创建第一个页面',
            'Welcome to your wiki!': '欢迎使用您的维基！',
            'Let’s create the first page': '让我们创建第一个页面',
            'Get started': '开始',
            'The wiki has not been enabled yet': '维基尚未启用',
            'Learn more about wikis': '了解更多关于维基的信息',
            'Page history': '页面历史',
            'Revision': '修订',
            'Latest revision': '最新修订',
            'Compare revisions': '比较修订',
            'Revert to this revision': '还原到此修订',
            'Back to': '返回',
            'Edit this page': '编辑此页面',
            'Save page': '保存页面',
            'Add a custom sidebar': '添加自定义侧边栏',
            'Add a custom footer': '添加自定义页脚',
            'Footer': '页脚',
            'Sidebar': '侧边栏',
            'Wiki page updated': '维基页面已更新',
            'Page successfully created': '页面创建成功',
            'Page successfully deleted': '页面删除成功',
            'Clone URL': '克隆地址',
            'Use HTTPS': '使用 HTTPS',
            'Use SSH': '使用 SSH',
            'Share this page': '分享此页面',
            'This page is empty': '此页面为空',
        },
        regexp: [
            [new RegExp('^Edited (\\d+) times$'), '已编辑 $1 次'],
            [new RegExp('^(\\d+) pages?$'), '$1 个页面'],
            [new RegExp('^([\\w.-]+) edited this page$'), '$1 编辑了此页面'],
        ],
    },

    // ==================== 软件包页面 ====================
    'repository/packages': {
        title: {
            regexp: [
                [new RegExp('^(.+?)\\s*Packages\\s*·\\s*GitHub$'), '$1 · 软件包 · GitHub'],
                [new RegExp('^Packages\\s*·\\s*(.+?)\\s*·\\s*GitHub$'), '软件包 · $1 · GitHub'],
            ],
        },
        static: {
            'Packages': '软件包',
            'Package': '软件包',
            'Your Packages': '我的软件包',
            'Search packages': '搜索软件包',
            'Search all packages': '搜索所有软件包',
            'No packages found': '未找到软件包',
            'No packages published yet': '尚未发布任何软件包',
            'Publish your first package': '发布您的第一个软件包',
            'Get started with GitHub Packages': '开始使用 GitHub Packages',
            'Learn more about publishing a package': '了解更多关于发布软件包的信息',
            'Published': '已发布',
            'Published by': '发布者',
            'Owned by': '拥有者',
            'Installation instructions': '安装说明',
            'Configure npm client': '配置 npm 客户端',
            'Copied': '已复制',
            'Details': '详情',
            'Downloads': '下载',
            'Total downloads': '总下载量',
            'Visible to': '可见范围',
            'Package source': '包来源',
            'Link to source repository': '链接到源仓库',
            'This package has no source repository': '此包没有源仓库',
            'Registry': '注册表',
            'Container': '容器',
            'Trusted publishing': '可信发布',
        },
        regexp: [
            [new RegExp('^(\\d+) downloads?$'), '$1 次下载'],
            [new RegExp('^(\\d+) versions?$'), '$1 个版本'],
            [new RegExp('^([\\w.-]+) published this package$'), '$1 发布了此软件包'],
        ],
    },

    // ==================== 探索页面 ====================
    explore: {
        title: {
            static: {
                'Explore GitHub': '探索 GitHub',
            },
        },
        static: {
            'Trending': '趋势',
            'Resources': '资源',
            'Popular repositories': '热门仓库',
            'Trending repositories': '趋势仓库',
            'Stars today': '今日星标',
            'Built by': '开发者',
        },
    },

    // ==================== 讨论页面 ====================
    discussions: {
        title: {
            static: {
                'Discussions': '讨论',
            },
        },
        static: {
            'Start a discussion': '开始讨论',
            'New discussion': '新建讨论',
            'Categories': '类别',
            'Announcements': '公告',
            'Ideas': '想法',
            'Q&A': '问答',
            'Show and tell': '展示',
            'Leave': '离开',
            'Category': '类别',
            'Answered': '已回答',
            'Unanswered': '未回答',
            'Upvote': '赞同',
            'Mark as answer': '标记为答案',
            'Pin discussion': '置顶讨论',
            'Convert to issue': '转为议题',
            'Delete discussion': '删除讨论',
            'Lock discussion': '锁定讨论',
        },
    },

    // ==================== Copilot 页面 ====================
    copilot: {
        static: {
            'Code completion': '代码补全',
            'Chat': '聊天',
            'Pricing': '定价',
            'Documentation': '文档',
            'Free': '免费',
            'Pro': '专业版',
            'Business': '商业版',
            'seat': '席位',
            'seats': '席位',
            'per month': '每月',
            'per year': '每年',
            'Current plan': '当前计划',
            'Used': '已使用',
            'Remaining': '剩余',
            'Quota': '配额',
            'Reset date': '重置日期',
            // 设置页与聊天入口（2025 改版）
            'Getting started': '开始使用',
            'Start free trial': '开始免费试用',
            'Go to Copilot': '前往 Copilot',
            'Agent tasks': '智能体任务',
            'Copilot coding agent': 'Copilot 编程智能体',
            'New conversation': '新对话',
            // 编程智能体会话（2025-2026）
            'Sessions': '会话',
            'Session logs': '会话日志',
            'Custom agent': '自定义智能体',
            'Custom agents': '自定义智能体',
            'Models': '模型',
            'MCP servers': 'MCP 服务器',
            'Take over': '接管',
        },
    },

    // ==================== 赞助页面 ====================
    sponsors: {
        title: {
            static: {
                'GitHub Sponsors': 'GitHub 赞助',
            },
        },
        static: {
            'Sponsors': '赞助者',
            'Sponsor': '赞助',
            'Sponsoring': '赞助中',
            'Featured sponsors': '精选赞助者',
            'Sponsor a developer': '赞助开发者',
            'All sponsors': '所有赞助者',
            'Monthly': '每月',
            'One-time': '一次性',
            'Custom': '自定义',
            'Edit sponsorship': '编辑赞助',
            'Cancel sponsorship': '取消赞助',
        },
    },

    // ==================== 趋势页面 ====================
    trending: {
        title: {
            static: {
                'Trending GitHub repositories': 'GitHub 趋势仓库',
            },
        },
        static: {
            'Trending': '趋势',
            'Developed today': '今日开发',
            'Open source projects': '开源项目',
            'Built by': '开发者',
            'Stars today': '今日星标',
            'Stars this week': '本周星标',
            'Stars this month': '本月星标',
            'Stars this year': '本年星标',
            'spoken language': '语言',
            'language': '语言',
            'Filter by language': '按语言筛选',
            'daily': '每日',
            'weekly': '每周',
            'monthly': '每月',
        },
    },

    // ==================== 发行版页面 ====================
    'repository/releases': {
        title: {
            regexp: [
                [new RegExp('^(.+?)\\s*Releases\\s*·\\s*GitHub$'), '$1 发行版 · GitHub'],
            ],
        },
        static: {
            'Pre-release': '预发布',
            'Create a new release': '创建新发行版',
            'Generate release notes': '生成发行说明',
            'Release assets': '发行版资源',
            'Binary files': '二进制文件',
            'Source code': '源代码',
            'Download ZIP': '下载 ZIP',
            'Total releases': '总发行版数',
            'Edit release': '编辑发行版',
            'Delete release': '删除发行版',
            'Release information': '发行版信息',
            'Release title': '发行版标题',
            'Release notes': '发行说明',
            'Attach binaries by dropping them here': '拖拽二进制文件到此处',
            'Add notes': '添加说明',
            'Publish release': '发布发行版',
            'Save draft': '保存草稿',
            'Discard draft': '放弃草稿',
            'Tag version': '标签版本',
            'Target': '目标分支',
            'This is a pre-release': '这是一个预发布版本',
            'Create discussion for this release': '为此发行版创建讨论',
        },
        regexp: [
            [new RegExp('^(\\d+) releases?$'), '$1 个发行版'],
        ],
    },

    // ==================== 比较页面 ====================
    'repository/compare': {
        title: {
            regexp: [
                [new RegExp('^(.+?)\\s*Comparing\\s*·\\s*GitHub$'), '$1 比较 · GitHub'],
            ],
        },
        static: {
            'Comparing': '正在比较',
            'base': '基础',
            'compare': '比较',
            'Changes': '更改',
            'Files changed': '文件更改',
            'No changes': '无更改',
            'Create pull request': '创建拉取请求',
            'Create a new pull request': '创建新拉取请求',
            'Reviewers': '审查者',
            'Assignees': '指派人',
        },
        regexp: [
            [new RegExp('^(\\d+) commits?$'), '$1 个提交'],
            [new RegExp('^(\\d+) files? changed$'), '$1 个文件变更'],
            [new RegExp('^(\\d+) additions?$'), '$1 处新增'],
            [new RegExp('^(\\d+) deletions?$'), '$1 处删除'],
        ],
    },

    // ==================== Blame 页面 ====================
    'repository/blame': {
        title: {
            regexp: [
                [new RegExp('^(.+?)\\s*Blame\\s*·\\s*GitHub$'), '$1 责任追踪 · GitHub'],
            ],
        },
        static: {
            'Blame': '责任追踪',
            'Latest commit': '最新提交',
            'Copy the full SHA': '复制完整 SHA',
            'View blame for this revision': '查看此版本的责任追踪',
        },
    },

    // ==================== 分支页面 ====================
    'repository/branches': {
        title: {
            regexp: [
                [new RegExp('^(.+?)\\s*Branches\\s*·\\s*GitHub$'), '$1 分支 · GitHub'],
            ],
        },
        static: {
            'Default branch': '默认分支',
            'New branch': '新分支',
            'Search branches...': '搜索分支...',
            'Filter by name': '按名称筛选',
            'Unprotect': '取消保护',
        },
        regexp: [
            [new RegExp('^(\\d+) branches?$'), '$1 个分支'],
        ],
    },

    // ==================== 标签页面 ====================
    'repository/tags': {
        title: {
            regexp: [
                [new RegExp('^(.+?)\\s*Tags\\s*·\\s*GitHub$'), '$1 标签 · GitHub'],
            ],
        },
        static: {
            'New tag': '新标签',
            'Search tags...': '搜索标签...',
        },
        regexp: [
            [new RegExp('^(\\d+) tags?$'), '$1 个标签'],
        ],
    },

    // ==================== 安全页面 ====================
    'repository/security': {
        title: {
            regexp: [
                [new RegExp('^(.+?)\\s*Security\\s*·\\s*GitHub$'), '$1 安全 · GitHub'],
                [new RegExp('^(.+?)\\s*Security and quality\\s*·\\s*GitHub$'), '$1 安全与质量 · GitHub'],
            ],
        },
        static: {
            'Security overview': '安全概览',
            'Code scanning': '代码扫描',
            'Secret scanning': '密钥扫描',
            'Dependabot alerts': 'Dependabot 警报',
            'Dependency graph': '依赖图',
            'Security policy': '安全策略',
            'Vulnerabilities': '漏洞',
            'Secrets': '密钥',
            'Dismiss': '忽略',
            // 规则集与新版安全能力（2025-2026）
            'Security and quality': '安全与质量',
            'Rulesets': '规则集',
            'New ruleset': '新建规则集',
            'Enforcement status': '强制执行状态',
            'Bypass list': '绕过名单',
            'Secret Protection': '密钥保护',
            'Code Security': '代码安全',
            'Advanced Security': '高级安全',
            'Push protection': '推送保护',
            'Copilot Autofix': 'Copilot 自动修复',
            'Autofix': '自动修复',
            'Security campaigns': '安全活动',
            'Mitigated': '已缓解',
            'Custom patterns': '自定义模式',
            'Dependabot': 'Dependabot',
            'Auto-triage': '自动分类',
            'Snooze': '延后处理',
            'CodeQL': 'CodeQL',
            'Require code scanning results': '需要代码扫描结果',
            'Merge protection': '合并保护',
        },
    },

    // ==================== 项目页面 ====================
    'repository/projects': {
        title: {
            regexp: [
                [new RegExp('^(.+?)\\s*Projects\\s*·\\s*GitHub$'), '$1 项目 · GitHub'],
            ],
        },
        static: {
            'New project': '新项目',
            'Board': '看板',
            'Table': '表格',
            'Roadmap': '路线图',
            'Insights': '洞察',
            'Views': '视图',
            'View settings': '查看设置',
            'No items to show': '暂无内容',
        },
    },

    // ==================== 拉取请求详情页 ====================
    'repository/pull': {
        title: {
            regexp: [
                [new RegExp('^(.+?)\\s*·\\s*Pull Request\\s*#(\\d+)\\s*·\\s*GitHub$'), '$1 · 拉取请求 #$2 · GitHub'],
            ],
        },
        static: {
            'Conversation': '对话',
            'Checks': '检查',
            'Files changed': '文件更改',
            'Review changes': '审查更改',
            'Request changes': '请求更改',
            'Merge pull request': '合并拉取请求',
            'Squash and merge': '压缩并合并',
            'Rebase and merge': '变基并合并',
            'Close pull request': '关闭拉取请求',
            'Reopen pull request': '重新打开拉取请求',
            'Update branch': '更新分支',
            'Delete branch': '删除分支',
            'Mark as ready for review': '标记为准备审查',
            'Convert to draft': '转为草稿',
            'Ready for review': '准备审查',
            'Added to merge queue': '已加入合并队列',
            'Merge when ready': '就绪即合并',
        },
    },

    // ==================== 文件浏览页 ====================
    'repository/tree': {
        static: {
            'Add file': '添加文件',
            'Create new file': '创建新文件',
            'Upload files': '上传文件',
            'Find file': '查找文件',
            'Go to file': '转到文件',
            'Latest commit': '最新提交',
            'Commit history': '提交历史',
            'History': '历史',
        },
    },

    // ==================== 代码视图页 ====================
    'repository/blob': {
        static: {
            'Copy path': '复制路径',
            'Copy permalink': '复制永久链接',
            'View raw': '查看原始',
            'View blame': '查看责备视图',
            'History': '历史',
            'Add file': '添加文件',
        },
    },

    // ==================== 仓库设置页 ====================
    'repository/settings': {
        static: {
            'Access': '访问',
            'Collaborators': '协作者',
            'Moderation options': '审核选项',
            'Rulesets': '规则集',
            'New ruleset': '新建规则集',
            'Branch protection rules': '分支保护规则',
            'Runners': '运行器',
            'Secrets and variables': '密钥和变量',
            'Environments': '环境',
            'Deploy keys': '部署密钥',
            'Advanced Security': '高级安全',
            'Secret Protection': '密钥保护',
            'Code Security': '代码安全',
            'Merge queue': '合并队列',
            'Merge method': '合并方式',
            'Danger Zone': '危险区域',
            'Delete this repository': '删除此仓库',
            'Change repository name': '更改仓库名称',
        },
    },

    // ==================== 组织页面（各 orgs/* 类型回退共用） ====================
    orgs: {
        static: {
            'People': '成员',
            'Outside collaborators': '外部协作者',
            'Custom properties': '自定义属性',
            'Allowed values': '允许值',
            'New property': '新建属性',
            'Audit log': '审计日志',
            'Verified': '已验证',
            'Member privileges': '成员权限',
        },
    },

    // ==================== 智能体会话页 ====================
    'repository/agents': {
        static: {
            'Sessions': '会话',
            'Session logs': '会话日志',
            'Custom agent': '自定义智能体',
            'Take over': '接管',
        },
    },

    // ==================== 仓库总览页（github.com/repos） ====================
    repos: {
        title: {
            static: {
                'Your repositories': '你的仓库',
            },
        },
        static: {
            'My contributions': '我的贡献',
            'My repositories': '我的仓库',
            'My forks': '我的复刻',
            'Admin access': '管理员权限',
        },
    },

    // ==================== 标签管理页 ====================
    'repository/labels': {
        static: {
            'New label': '新标签',
            'Search labels': '搜索标签',
            'Default': '默认',
        },
    },

    // ==================== 里程碑页 ====================
    'repository/milestones': {
        static: {
            'New milestone': '新里程碑',
            'Create a milestone': '创建里程碑',
            'Due date': '截止日期',
            'No due date': '无截止日期',
        },
    },

    // ==================== 仓库图表页 ====================
    'repository/graphs': {
        static: {
            'Insights': '洞察',
            'Traffic': '流量',
            'Contributors': '贡献者',
        },
    },

    // ==================== 仓库人脉页 ====================
    'repository/network': {
        static: {
            'Network': '网络',
            'Members': '成员',
        },
    },

    // ==================== 社区档案页 ====================
    'repository/community': {
        static: {
            'Community profile': '社区档案',
        },
    },

    // ==================== 仓库讨论页 ====================
    'repository/discussions': {
        static: {
            'New discussion': '新建讨论',
            'Categories': '类别',
            'Announcements': '公告',
            'General': '常规',
            'Q&A': '问答',
            'Answered': '已回答',
            'Unanswered': '未回答',
            'Upvote': '赞同',
            'Mark as answer': '标记为答案',
        },
    },

    // ==================== 在线开发环境页 ====================
    'repository/codespaces': {
        static: {
            'New codespace': '新建 Codespace',
            'Machine type': '机器类型',
        },
    },

    // ==================== 工作流运行页 ====================
    'repository/runs': {
        static: {
            'Jobs': '作业',
            'Annotations': '注释',
            'Re-run failed jobs': '重新运行失败的作业',
            'Summary': '摘要',
        },
    },

    // ==================== 关注者 / 星标者页 ====================
    'repository/watchers': {
        static: {
            'Watchers': '关注者',
        },
    },
    'repository/stargazers': {
        static: {
            'Stargazers': '星标者',
        },
    },

    // ==================== 代码片段页 ====================
    gist: {
        static: {
            'Create a public gist': '创建公开代码片段',
            'Create a secret gist': '创建私密代码片段',
        },
    },
};
