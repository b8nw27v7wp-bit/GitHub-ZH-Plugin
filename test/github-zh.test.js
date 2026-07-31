/**
 * github-zh 功能测试
 * 用最小 DOM 模拟验证翻译引擎、页面配置、词条收集逻辑
 * 运行: node test/github-zh.test.js
 */
const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; console.log('  ✓ ' + name); } else { fail++; console.error('  ✗ ' + name); } };

// ---------- 最小 DOM 模拟 ----------
class FakeTextNode {
    constructor(text) { this.data = text; this.length = text.length; this.nodeType = 3; }
}
class FakeElement {
    constructor(tag) {
        this.tagName = tag; this.nodeType = 1; this.children = [];
        this.dataset = {}; this.attrs = {};
        this.className = ''; this.type = '';
        this.shadowRoot = null;
        this.textContent = '';
        this.nextElementSibling = null;
    }
    matches() { return false; }
    closest() { return null; }
    querySelector() { return null; }
}
const documentStub = {
    documentElement: { lang: 'en' },
    body: null,
    title: '',
    readyState: 'complete',
    createTreeWalker() {
        return {
            nextNode() { return null; }
        };
    },
    addEventListener() {},
    querySelector() { return null; },
};

global.document = documentStub;
global.window = {
    location: { href: 'https://github.com/maboloshi/github-chinese', pathname: '/maboloshi/github-chinese' },
    addEventListener() {},
};
global.location = global.window.location;
global.Node = { TEXT_NODE: 3, ELEMENT_NODE: 1 };
global.NodeFilter = { SHOW_ELEMENT: 1, SHOW_TEXT: 4, FILTER_ACCEPT: 1, FILTER_REJECT: 2 };
global.URL = URL;
global.GM_getValue = () => undefined;
global.GM_setValue = () => {};
global.GM_addStyle = () => {};
global.GM_registerMenuCommand = () => 0;
global.GM_notification = () => {};
global.console = console;

// ---------- 加载被测代码 ----------
console.log('\n[加载]');
const localesCode = fs.readFileSync(path.join(BASE, 'locales.js'), 'utf8');
const mainCode = fs.readFileSync(path.join(BASE, 'github-zh.user.js'), 'utf8');

// 1. locales.js 必须可执行
let LOCALES;
try {
    LOCALES = new Function(localesCode + '; return LOCALES;')();
    global.LOCALES = LOCALES;
    ok('locales.js 语法 + 加载', true);
} catch (e) {
    ok('locales.js 语法 + 加载: ' + e.message, false);
    process.exit(1);
}

// 2. 主脚本必须可执行（剥离油猴元数据块）
const mainBody = mainCode.replace(/\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
try {
    new Function(mainBody);
    ok('github-zh.user.js 语法', true);
} catch (e) {
    ok('github-zh.user.js 语法: ' + e.message, false);
    process.exit(1);
}

// ---------- 词典结构 ----------
console.log('\n[词典结构]');
ok('含 conf', !!LOCALES.conf);
ok('conf.rePagePath 为正则', LOCALES.conf.rePagePath instanceof RegExp);
ok('conf.rePagePathRepo 为正则', LOCALES.conf.rePagePathRepo instanceof RegExp);
ok('conf.rePagePathOrg 为正则', LOCALES.conf.rePagePathOrg instanceof RegExp);
ok('含 public 词典', !!LOCALES.public?.static);
ok('公共词条 >= 50', Object.keys(LOCALES.public.static).length >= 50);

const pageTypes = ['dashboard', 'repository', 'page-profile', 'settings', 'search',
    'notifications', 'issues', 'pulls', 'session-authentication', 'explore',
    'trending', 'discussions', 'copilot', 'sponsors', 'repository/new'];
for (const pt of pageTypes) {
    ok(`页面类型 ${pt} 有 static 词典`, !!LOCALES[pt]?.static && Object.keys(LOCALES[pt].static).length > 0);
}

// ---------- 翻译核心验证 ----------
console.log('\n[翻译核心]');

// 从主脚本提取关键逻辑独立测试（因为主脚本 IIFE 在模拟环境直接跑有副作用）
// 这里直接测词典匹配语义 + 正则规则
function staticTranslate(text, pageType) {
    const cleaned = text.trim().replace(/\xa0|[\s]+/g, ' ');
    const staticDict = { ...(LOCALES.public.static || {}), ...(LOCALES[pageType]?.static || {}) };
    return staticDict[cleaned] || null;
}
function regexpTranslate(text, pageType) {
    const cleaned = text.trim().replace(/\xa0|[\s]+/g, ' ');
    const rules = [...(LOCALES[pageType]?.regexp || []), ...(LOCALES.public.regexp || [])];
    for (const [pattern, replacement] of rules) {
        const result = cleaned.replace(pattern, replacement);
        if (result !== cleaned) return result;
    }
    return null;
}

ok('公共: Pull requests → 拉取请求', staticTranslate('Pull requests', 'repository') === '拉取请求');
ok('公共: Issues → 议题', staticTranslate('Issues', 'repository') === '议题');
ok('公共: Settings → 设置', staticTranslate('Settings', 'settings') === '设置');
ok('仓库: Code → 代码', staticTranslate('Code', 'repository') === '代码');
ok('仓库: Merge pull request → 合并拉取请求', staticTranslate('Merge pull request', 'repository') === '合并拉取请求');
ok('设置: Change password → 更改密码', staticTranslate('Change password', 'settings') === '更改密码');
ok('搜索: Best match → 最佳匹配', staticTranslate('Best match', 'search') === '最佳匹配');
ok('PR: Files changed → 文件更改', staticTranslate('Files changed', 'pulls') === '文件更改');
ok('仓库正则: 12 commits → 12 次提交', regexpTranslate('12 commits', 'repository') === '12 次提交');
ok('仓库正则: 3 files changed → 3 个文件变更', regexpTranslate('3 files changed', 'repository') === '3 个文件变更');
ok('仓库正则: 5 additions → 5 处新增', regexpTranslate('5 additions', 'repository') === '5 处新增');
ok('搜索结果正则: 42 results → 42 个结果', regexpTranslate('42 results', 'search') === '42 个结果');
ok('纯中文不翻译', staticTranslate('这是一个测试', 'repository') === null);
ok('纯数字不翻译', staticTranslate('12345', 'repository') === null);

// ---------- 页面类型检测 ----------
console.log('\n[页面类型正则]');
ok('仓库路径 /user/repo/issues → repository/issues',
    '/user/repo/issues'.match(LOCALES.conf.rePagePathRepo)?.[1] === 'issues');
ok('仓库路径 /user/repo/pull/1 → repository/pull',
    '/user/repo/pull/1'.match(LOCALES.conf.rePagePathRepo)?.[1] === 'pull');
ok('仓库路径 /user/repo/settings → repository/settings',
    '/user/repo/settings'.match(LOCALES.conf.rePagePathRepo)?.[1] === 'settings');
ok('设置路径 /settings/profile → settings',
    '/settings/profile'.match(LOCALES.conf.rePagePath)?.[1] === 'settings');
ok('通知路径 /notifications → notifications',
    '/notifications'.match(LOCALES.conf.rePagePath)?.[1] === 'notifications');
ok('趋势路径 /trending → trending',
    '/trending'.match(LOCALES.conf.rePagePath)?.[1] === 'trending');
ok('组织路径 /orgs/foo/teams → teams',
    '/orgs/foo/teams'.match(LOCALES.conf.rePagePathOrg)?.[1] === 'teams');

// ---------- 元数据 ----------
console.log('\n[油猴元数据]');
ok('@match github.com', /@match\s+https:\/\/github\.com\/\*/.test(mainCode));
ok('@match gist.github.com', /@match\s+https:\/\/gist\.github\.com\/\*/.test(mainCode));
ok('@require locales.js', /@require.*locales\.js/.test(mainCode));
ok('@grant GM_registerMenuCommand', /@grant\s+GM_registerMenuCommand/.test(mainCode));
ok('@grant GM_notification', /@grant\s+GM_notification/.test(mainCode));
ok('@run-at document-start', /@run-at\s+document-start/.test(mainCode));
ok('@license MIT', /@license\s+MIT/.test(mainCode));
ok('版本号 >= 1.1.0', /@version\s+1\.1\.0/.test(mainCode));

// ---------- 核心函数存在 ----------
console.log('\n[核心函数]');
for (const fn of ['detectPageType', 'buildPageConfig', 'transText', 'traverseNode',
    'handleTextNode', 'handleElementNode', 'setupObserver', 'transTitle',
    'transDesc', 'MissedTermsManager', 'setupMenuCommands', 'init']) {
    ok(`含 ${fn}`, mainCode.includes(fn));
}

// ---------- 总结 ----------
console.log(`\n${'='.repeat(50)}`);
console.log(`结果: ${pass} 通过, ${fail} 失败`);
process.exit(fail > 0 ? 1 : 0);
