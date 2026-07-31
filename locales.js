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
                'header.GlobalNav',
                'qbsearch-input',
                '.highlight',
                '.notranslate',
                '[translate="no"]',
                '.cm-scroller',
            ],
            'repository/blob': ['td.blob-code', 'div.diff-text-inner', 'span.PRIVATE_TreeView-item-content-text'],
            'repository/pull': ['td.blob-code', '.js-full-logs-container'],
            'repository/commit': ['td.blob-code', 'div.diff-text-inner'],
            'repository/tree': ['article.markdown-body', 'tr.react-directory-row'],
            'repository/actions': ['table.highlight', '.js-full-logs-container'],
        },

        // 需要忽略的静态元素（永远不翻译）
        ignoreSelectors: {
            'page-profile': ['span.p-nickname', 'span.p-name'],
            'repository': [
                '.AppHeader-context-full',
                'strong[itemprop="name"]',
                'p.f4.my-3',
                'article.markdown-body',
            ],
            'repository/tree': ['span.PRIVATE_TreeView-item-content-text', 'a[itemprop="name codeRepository"]'],
        },

        // 需要翻译文本节点变化的页面类型
        characterDataPages: ['repository/new', 'repository/edit', 'repository/blob', 'repository/pull', 'repository/issues'],
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
            [new RegExp('^(\\d+) (?:k\\b)'), '$1k'],
        ],
    },

    // ==================== 首页/仪表盘 ====================
    dashboard: {
        title: {
            static: {
                'GitHub': 'GitHub',
            },
        },
        static: {
            'Home': '主页',
            'Feed': '动态',
            'Your repositories': '你的仓库',
            'Your projects': '你的项目',
            'Top Repositories': '常用仓库',
            'Recent activity': '最近活动',
            'Repository name': '仓库名称',
            'Description': '描述',
            'Public': '公开',
            'Private': '私有',
            'Internal': '内部',
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
            'Branch': '分支',
            'Branches': '分支',
            'Tags': '标签',
            'Stargazers': '星标者',
            'Watchers': '关注者',
            'Forks': '复刻',
            'Pinned': '已置顶',
            'Customize your pins': '自定义置顶',
            'Pin': '置顶',
            'Unpin': '取消置顶',
            'Up to date': '已是最新',
            'Update': '更新',
        },
        regexp: [
            [new RegExp('^(\\d+) (?:results?)'), '$1 个结果'],
        ],
    },

    // ==================== 仓库页面 ====================
    repository: {
        title: {
            static: {
                'GitHub': 'GitHub',
            },
            regexp: [
                [new RegExp('^(.+?)\\s*/\\s*(.+?)\\s*·\\s*GitHub$'), '$1/$2 · GitHub'],
            ],
        },
        static: {
            // 仓库头部
            'About': '关于',
            'Readme': '自述文件',
            'License': '许可证',
            'Activity': '活动',
            'Stars': '星标',
            'Forks': '复刻',
            'Watchers': '关注者',
            'Issues': '议题',
            'Pull requests': '拉取请求',
            'Actions': '操作',
            'Projects': '项目',
            'Wiki': '维基',
            'Security': '安全',
            'Insights': '洞察',

            // 仓库操作
            'Code': '代码',
            'Clone': '克隆',
            'Download ZIP': '下载 ZIP',
            'Open with GitHub Desktop': '用 GitHub Desktop 打开',
            'Add file': '添加文件',
            'Create new file': '创建新文件',
            'Upload files': '上传文件',
            'Find file': '查找文件',
            'Go to file': '转到文件',
            'Search or jump to...': '搜索或跳转...',
            'Unwatch': '取消关注',
            'Watch': '关注',
            'Fork': '复刻',
            'Star': '星标',
            'Unstar': '取消星标',

            // 文件列表
            'Latest commit': '最新提交',
            'Git stats': 'Git 统计',
            'Commit history': '提交历史',

            // 分支相关
            'branch': '分支',
            ' branches': '个分支',
            'tag': '标签',
            ' tags': '个标签',
            'default': '默认',
            'branches': '分支',
            'tags': '标签',
            'Switch branches/tags': '切换分支/标签',
            'All branches': '所有分支',
            'Default branch': '默认分支',

            // 提交相关
            'commit': '次提交',
            'commits': '次提交',
            'committing': '提交中',
            'committed': '已提交',
            'Committer': '提交者',
            'Author': '作者',
            'merge': '合并',
            'merged': '已合并',
            'Merged': '已合并',

            // PR 相关
            'Pull request': '拉取请求',
            'Open a pull request': '创建拉取请求',
            'Compare & pull request': '比较并创建拉取请求',
            'Reviewers': '审查者',
            'Assignees': '指派',
            'Labels': '标签',
            'Linked issues': '关联议题',
            'Merge pull request': '合并拉取请求',
            'Rebase and merge': '变基并合并',
            'Squash and merge': '压缩并合并',
            'Close pull request': '关闭拉取请求',

            // Issues 相关
            'New issue': '新建议题',
            'Open a new issue': '打开新议题',
            'Milestone': '里程碑',
            'Assignee': '指派人',
            'Milestones': '里程碑',
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

            // Settings 相关
            'General': '常规',
            'Access': '访问',
            'Collaborators': '协作者',
            'Branch protection rules': '分支保护规则',
            'Rules': '规则',
            'Webhooks': 'Webhooks',
            'Environments': '环境',
            'Codespaces': 'Codespaces',
            'Pages': 'GitHub Pages',
            'Deploy keys': '部署密钥',
            'Secrets and variables': '密钥和变量',
            'Integrations': '集成',
            'Notifications': '通知',
            'Change repository name': '更改仓库名称',
            'Delete this repository': '删除此仓库',
            'Danger Zone': '危险区域',
            'Transfer': '转让',

            // Release 相关
            'Releases': '发行版',
            'Latest': '最新',
            'Pre-release': '预发布',
            'Draft': '草稿',
            'Create a new release': '创建新发行版',
            'Generate release notes': '生成发行说明',
            'Release assets': '发行版资源',
            'Binary files': '二进制文件',
            'Source code': '源代码',

            // 其他
            'About this repository': '关于此仓库',
            'Packages': '包',
            'Languages': '语言',
            'Deployments': '部署',
            'Community': '社区',
            'Sponsor': '赞助',
            'Report repository': '举报仓库',
            'Unsubscribe': '取消订阅',
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
            'Follow': '关注',
            'Unfollow': '取消关注',
            'Followers': '关注者',
            'Following': '正在关注',
            'repositories': '个仓库',
            'Achievements': '成就',
            'Organizations': '组织',
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
            'Customize your pins': '自定义置顶',
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
                'Settings': '设置',
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
            'Name': '名称',
            'Public email': '公开邮箱',
            'Bio': '个人简介',
            'URL': '网址',
            'Company': '公司',
            'Location': '位置',
            'Social accounts': '社交账号',
            'Update profile': '更新资料',
            'Change username': '更改用户名',

            // 账户设置
            'Account': '账户',
            'Change password': '更改密码',
            'Two-factor authentication': '双重身份验证',
            'SSH and GPG keys': 'SSH 和 GPG 密钥',
            'Authentication log': '认证日志',
            'Sessions': '会话',
            'Security log': '安全日志',
            'Devices': '设备',
            'Emails': '邮箱',
            'Blocked users': '屏蔽的用户',
            'Interaction limits': '互动限制',

            // 通知设置
            'Notifications': '通知',
            'Email preferences': '邮箱偏好',
            'Subscribed': '已订阅',
            'Watching': '正在关注',
            'Participating': '参与中',
            '@Mentions': '@提及',

            // 存储
            'Billing': '账单',
            'Plans and usage': '计划和用量',
            'Payment information': '支付信息',
            'Spending limits': '支出限额',

            // 开发者
            'Developer settings': '开发者设置',
            'OAuth Apps': 'OAuth 应用',
            'Personal access tokens': '个人访问令牌',
            'GitHub Apps': 'GitHub 应用',

            // 通用
            'Appearance': '外观',
            'Accessibility': '无障碍',
            'SSH keys': 'SSH 密钥',
            'GPG keys': 'GPG 密钥',
            'Security': '安全',
            'Code review limits': '代码审查限制',
            'Saved replies': '保存的回复',
            'Scheduled reminders': '定时提醒',
            'Delete your account': '删除你的账户',
            'Danger zone': '危险区域',
            'Change your avatar': '更改头像',
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
            'Code': '代码',
            'Commits': '提交',
            'Discussions': '讨论',
            'Packages': '包',
            'Marketplace': '市场',
            'Topics': '话题',
            'Wikis': '维基',
            'Users': '用户',
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
        title: {
            static: {
                'Notifications': '通知',
            },
        },
        static: {
            'Inbox': '收件箱',
            'Unread': '未读',
            'Read': '已读',
            'Done': '已完成',
            'Mark all as read': '全部标为已读',
            'Mark as read': '标为已读',
            'Mark as unread': '标为未读',
            'Mark as done': '标为完成',
            'Unsubscribe': '取消订阅',
            'Ignore thread': '忽略对话',
            'Delete thread': '删除对话',
            'Customize': '自定义',
            'Notification settings': '通知设置',
            'Watching': '正在关注',
            'Participating': '参与中',
            '@Mentions': '@提及',
            'No new notifications': '没有新通知',
            'Filter': '筛选',
            'All': '全部',
            'None': '无',
            'Global': '全局',
        },
    },

    // ==================== 议题页面 ====================
    issues: {
        title: {
            static: {
                'Issues': '议题',
            },
        },
        static: {
            'Open': '打开',
            'Closed': '已关闭',
            'All': '全部',
            'Labels': '标签',
            'Milestones': '里程碑',
            'New issue': '新建议题',
            'New': '新建',
            'Author': '作者',
            'Assignee': '指派人',
            'Sort': '排序',
            'Filters': '筛选',
            'Comment': '评论',
            'Lock conversation': '锁定对话',
            'Unlock conversation': '解锁对话',
            'Transfer issue': '转让议题',
            'Reopen issue': '重新打开议题',
            'Close issue': '关闭议题',
        },
        regexp: [
            [new RegExp('^(\\d+) (?:Open)'), '$1 个打开'],
            [new RegExp('^(\\d+) (?:Closed)'), '$1 个已关闭'],
            [new RegExp('^(\\d+) (?:results?)'), '$1 个结果'],
        ],
    },

    // ==================== 拉取请求页面 ====================
    pulls: {
        title: {
            static: {
                'Pull requests': '拉取请求',
            },
        },
        static: {
            'Open': '打开',
            'Closed': '已关闭',
            'Merged': '已合并',
            'Draft': '草稿',
            'Reviewers': '审查者',
            'Labels': '标签',
            'Projects': '项目',
            'Milestones': '里程碑',
            'New pull request': '新建议题',
            'Compare': '比较',
            'Base': '基础',
            'Changes': '更改',
            'Merge pull request': '合并拉取请求',
            'Rebase and merge': '变基并合并',
            'Squash and merge': '压缩并合并',
            'Close pull request': '关闭拉取请求',
            'Merge': '合并',
            'Commits': '提交',
            'Files changed': '文件更改',
            'Enable auto-merge': '启用自动合并',
            'Ready for review': '准备审查',
            'Request reviewers': '请求审查',
            'Convert to draft': '转为草稿',
            'Mark as ready for review': '标记为准备审查',
            'commits': '个提交',
            'commit': '个提交',
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
            'Sign in': '登录',
            'Username or email address': '用户名或邮箱地址',
            'Password': '密码',
            'Forgot password?': '忘记密码？',
            'Sign in with a passkey': '用通行密钥登录',
            'Create an account': '创建账户',
            'New to GitHub?': 'GitHub 新用户？',
            'Sign in to GitHub': '登录 GitHub',
            'Two-factor authentication': '双重身份验证',
            'Verify': '验证',
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
            'Owner': '所有者',
            'Repository name': '仓库名称',
            'Description': '描述',
            'Optional': '可选',
            'Public': '公开',
            'Anyone on the internet can see this repository': '任何人都可以看到此仓库',
            'Private': '私有',
            'You choose who can see and commit to this repository': '你选择谁可以看到和提交到此仓库',
            'Initialize this repository with:': '使用以下内容初始化仓库：',
            'Add a README file': '添加 README 文件',
            'Create repository': '创建仓库',
        },
    },

    // ==================== 探索页面 ====================
    explore: {
        title: {
            static: {
                'Explore GitHub': '探索 GitHub',
            },
        },
        static: {
            'Explore': '探索',
            'Trending': '趋势',
            'Collections': '精选集',
            'Events': '活动',
            'Sponsors': '赞助',
            'Topics': '话题',
            'Resources': '资源',
            'More': '更多',
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
            'General': '常规',
            'Ideas': '想法',
            'Q&A': '问答',
            'Show and tell': '展示',
            'Join': '加入',
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
        title: {
            static: {
                'GitHub Copilot': 'GitHub Copilot',
            },
        },
        static: {
            'Copilot': 'Copilot',
            'Code completion': '代码补全',
            'Chat': '聊天',
            'Pricing': '定价',
            'Features': '功能',
            'Documentation': '文档',
            'Settings': '设置',
            'Plan': '计划',
            'Free': '免费',
            'Pro': '专业版',
            'Business': '商业版',
            'Enterprise': '企业版',
            'seat': '席位',
            'seats': '席位',
            'per month': '每月',
            'per year': '每年',
            'Get started': '开始使用',
            'Current plan': '当前计划',
            'Usage': '使用量',
            'Used': '已使用',
            'Remaining': '剩余',
            'Quota': '配额',
            'Reset date': '重置日期',
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
};
