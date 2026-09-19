/**
 * github-zh 功能测试
 * 通过注入语法钩子实际执行主脚本 IIFE，测试真实实现（transText/buildPageConfig/detectPageType/MissedTermsManager 等）
 * 运行: node test/github-zh.test.js
 */
const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; console.log('  ✓ ' + name); } else { fail++; console.error('  ✗ ' + name); } };

// ---------- 最小 DOM 模拟（足以让主脚本 IIFE 真实运行） ----------
class FakeMutationObserver {
    disconnect() {}
    observe() {}
    takeRecords() { return []; }
}
global.MutationObserver = FakeMutationObserver;

global.Node = { TEXT_NODE: 3, ELEMENT_NODE: 1 };
global.NodeFilter = { SHOW_ELEMENT: 1, SHOW_TEXT: 4, FILTER_ACCEPT: 1, FILTER_REJECT: 2 };

const __location = {
    href: 'https://github.com/maboloshi/github-chinese',
    pathname: '/maboloshi/github-chinese',
};
global.location = __location;

global.document = {
    documentElement: { lang: 'en' },
    body: {
        classList: { contains: () => false },
    },
    title: '',
    readyState: 'complete',
    createTreeWalker(rootNode, whatToShow, filter) {
        return { nextNode() { return null; } };
    },
    querySelector() { return null; },
    addEventListener() {},
};
const window_mock = {
    location: __location,
    addEventListener() {},
};
global.window = window_mock;

global.GM_getValue = (key, def) => def;
const gmStore = {}; // 捕获 GM_setValue 写入，供持久化断言使用
global.GM_setValue = (key, val) => { gmStore[key] = val; };
global.GM_addStyle = () => {};
global.GM_registerMenuCommand = () => 0;
global.GM_unregisterMenuCommand = () => {};
global.GM_notification = () => {};
global.GM_xmlhttpRequest = () => {};
global.console = console;

// ---------- 加载被测代码 ----------
console.log('\n[加载]');
const localesCode = fs.readFileSync(path.join(BASE, 'locales.js'), 'utf8');
const mainCode = fs.readFileSync(path.join(BASE, 'github-zh.user.js'), 'utf8');

let LOCALES;
try {
    LOCALES = new Function(localesCode + '; return LOCALES;')();
    global.LOCALES = LOCALES;
    ok('locales.js 语法 + 加载', true);
} catch (e) {
    ok('locales.js 语法 + 加载: ' + e.message, false);
    process.exit(1);
}

// 剥离元数据块并在 IIFE 结束前注入导出钩子（定位最后一个 })();，不依赖尾部空白格式）
const HOOK = [
    '    window.__ghzTest = {',
    '        transText, transTitle, buildPageConfig, detectPageType, updatePageConfig,',
    '        traverseNode, handleTextNode, MissedTermsManager, getDescSelector,',
    '        get featureSet() { return State.featureSet; },',
    '    };',
    '',
].join('\n');
const closeIdx = mainCode.lastIndexOf('})();');
let mainBody;
if (closeIdx === -1) {
    mainBody = mainCode + '\n;throw new Error("未找到 IIFE 结束标记");';
} else {
    mainBody = mainCode.slice(0, closeIdx) + HOOK + mainCode.slice(closeIdx);
}

try {
    new Function(mainBody)();
    ok('github-zh.user.js 执行', true);
} catch (e) {
    ok('github-zh.user.js 执行: ' + e.stack, false);
    process.exit(1);
}

const ghz = window_mock.__ghzTest;
ok('导出测试钩子 __ghzTest', !!ghz);

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
    'trending', 'discussions', 'copilot', 'sponsors', 'repository/new',
    'feed', 'repos', 'gist', 'orgs', 'repository/pull', 'repository/tree',
    'repository/blob', 'repository/settings', 'repository/agents',
    'repository/labels', 'repository/milestones', 'repository/graphs',
    'repository/network', 'repository/community', 'repository/discussions',
    'repository/codespaces', 'repository/runs', 'repository/watchers',
    'repository/stargazers'];
for (const pt of pageTypes) {
    ok(`页面类型 ${pt} 有 static 词典`, !!LOCALES[pt]?.static && Object.keys(LOCALES[pt].static).length > 0);
}

// ---------- 真实实现：页面类型检测 ----------
console.log('\n[detectPageType 真实实现]');
function setPath(href, pathname) { __location.href = href; __location.pathname = pathname; }
ok('仓库路径 /user/repo/issues → repository/issues', (() => { setPath('https://github.com/u/r/issues', '/u/r/issues'); return ghz.detectPageType() === 'repository/issues'; })());
ok('仓库路径 /user/repo/pull/1 → repository/pull', (() => { setPath('https://github.com/u/r/pull/1', '/u/r/pull/1'); return ghz.detectPageType() === 'repository/pull'; })());
ok('仓库主页 /user/repo → repository', (() => { setPath('https://github.com/u/r', '/u/r'); return ghz.detectPageType() === 'repository'; })());
ok('设置路径 /settings/profile → settings', (() => { setPath('https://github.com/settings/profile', '/settings/profile'); return ghz.detectPageType() === 'settings'; })());
ok('通知路径 /notifications → notifications', (() => { setPath('https://github.com/notifications', '/notifications'); return ghz.detectPageType() === 'notifications'; })());
ok('gist 域名 → gist', (() => { setPath('https://gist.github.com/u/abc', '/u/abc'); return ghz.detectPageType() === 'gist'; })());
ok('status 域名 → status', (() => { setPath('https://www.githubstatus.com/', '/'); return ghz.detectPageType() === 'status'; })());
ok('非仓库单段路径不命中任何类型（返回 null）', (() => { setPath('https://github.com/maboloshi', '/maboloshi'); return ghz.detectPageType() === null; })());

// ---------- 真实实现：构建页面配置 ----------
console.log('\n[buildPageConfig 真实实现]');
{
    const cfg = ghz.buildPageConfig('repository');
    ok('合并公共词典 (Pull requests → 拉取请求)', cfg.staticDict['Pull requests'] === '拉取请求');
    ok('合并页面词典 (Code → 代码)', cfg.staticDict['Code'] === '代码');
    ok('regexpRules 页面优先于公共', cfg.regexpRules[0] === LOCALES.repository.regexp[0] &&
        cfg.regexpRules.length === LOCALES.repository.regexp.length + LOCALES.public.regexp.length);
    ok('ignoreSelectors 为合并串', typeof cfg.ignoreSelectors === 'string');
    ok('characterData 默认 false', cfg.characterData === false);
}

// ---------- 真实实现：页面配置首段回退 ----------
console.log('\n[buildPageConfig 首段回退]');
{
    const orgCfg = ghz.buildPageConfig('orgs/teams');
    ok('orgs/teams 回退到 orgs 词典 (People → 成员)', orgCfg.staticDict['People'] === '成员');
    const starsCfg = ghz.buildPageConfig('page-profile/stars');
    ok('page-profile/stars 回退到 page-profile 词典 (Followers → 关注者)', starsCfg.staticDict['Followers'] === '关注者');
    const unknownCfg = ghz.buildPageConfig('no/such-type');
    ok('未知类型仅含公共词典', unknownCfg.staticDict['Pull requests'] === '拉取请求' && unknownCfg.staticDict['People'] === undefined);
}

// ---------- 真实实现：新词典端到端 ----------
console.log('\n[新词典端到端]');
{
    setPath('https://github.com/u/r/pull/1', '/u/r/pull/1');
    ghz.updatePageConfig('测试');
    ok('repository/pull: Added to merge queue → 已加入合并队列',
        ghz.transText('Added to merge queue') === '已加入合并队列');
    setPath('https://github.com/orgs/octo/people', '/orgs/octo/people');
    ok('组织成员页识别为 orgs/people', ghz.detectPageType() === 'orgs/people');
    ghz.updatePageConfig('测试');
    ok('orgs/people 复用 orgs 回退词典 (Audit log → 审计日志)',
        ghz.transText('Audit log') === '审计日志');
    // 恢复仓库上下文供后续区块使用
    setPath('https://github.com/u/r', '/u/r');
    ghz.updatePageConfig('测试');
}

// ---------- 真实实现：transText ----------
console.log('\n[transText 真实实现]');
setPath('https://github.com/u/r', '/u/r');
ghz.updatePageConfig('测试');
ok('静态: Pull requests → 拉取请求', ghz.transText('Pull requests') === '拉取请求');
ok('静态: Code → 代码', ghz.transText(' Code  ')?.trim() === '代码');
ok('正则: 12 commits → 12 次提交', ghz.transText('12 commits') === '12 次提交');
ok('正则: 3 files changed → 3 个文件变更', ghz.transText('3 files changed') === '3 个文件变更');
ok('纯中文不翻译', ghz.transText('这是一个测试') === false);
ok('纯数字不翻译', ghz.transText('12345') === false);
ok('未收录英文返回 false', ghz.transText('TotallyUnknownTermXYZ') === false);
ok('空翻译词条 on 返回空字符串', ghz.transText('on') === '');

// 空字符串是有效翻译值，必须写入文本节点
{
    const tn = { data: 'on', length: 2 };
    ghz.handleTextNode(tn);
    ok('空翻译写入文本节点 data', tn.data === '');
    const tn2 = { data: 'Pull requests', length: 13 };
    ghz.handleTextNode(tn2);
    ok('普通翻译写入文本节点 data', tn2.data === '拉取请求');
}

// 禁用正则后，antian 规则不再生效
ghz.featureSet.enable_RegExp = false;
ok('关闭正则后 12 commits 不翻译', ghz.transText('12 commits') === false);
ok('关闭正则后静态翻译仍生效', ghz.transText('Pull requests') === '拉取请求');
ghz.featureSet.enable_RegExp = true;

// ---------- 真实实现：描述选择器 ----------
console.log('\n[getDescSelector 真实实现]');
{
    setPath('https://github.com/u/r', '/u/r');
    ghz.updatePageConfig('测试');
    ok('repository → p.f4.my-3（与 ignoreSelectors 一致）', ghz.getDescSelector() === 'p.f4.my-3');
    setPath('https://gist.github.com/u/abc', '/u/abc');
    ghz.updatePageConfig('测试');
    ok('gist → .gist-content [itemprop="about"]', ghz.getDescSelector() === '.gist-content [itemprop="about"]');
    // 恢复仓库上下文并重建配置，供后续区块使用
    setPath('https://github.com/u/r', '/u/r');
    ghz.updatePageConfig('测试');
}

// ---------- 真实实现：未命中词条收集 ----------
console.log('\n[MissedTermsManager 真实实现]');
{
    ghz.MissedTermsManager.clear();
    ghz.MissedTermsManager.record('Untranslated Something', { el: { id: '', tagName: 'SPAN', className: 'foo bar' } });
    const path = __location.pathname;
    const entry = ghz.MissedTermsManager.data[path]['Untranslated Something'];
    ok('记录到当前路径', !!entry);
    ok('记录 pageType', entry.pageType === 'repository');
    ok('记录统计次数', entry.count === 1);
    ghz.MissedTermsManager.record('Untranslated Something', { el: { id: '', tagName: 'SPAN', className: 'foo bar' } });
    ok('重复命中 count 递增', ghz.MissedTermsManager.data[path]['Untranslated Something'].count === 2);
    ok('纯中文不记录', !ghz.MissedTermsManager.data[path]['这是一个测试']);
    ghz.MissedTermsManager.record('Legacy shape', {});
    ghz.MissedTermsManager.data[path]['Legacy shape'] = '';
    ghz.MissedTermsManager.record('Legacy shape', { el: { id: 'btn-id', tagName: '', className: '' } });
    ok('旧结构自动升级为对象', typeof ghz.MissedTermsManager.data[path]['Legacy shape'] === 'object');
    ok('升级后 count=1 且 selector 取 id', ghz.MissedTermsManager.data[path]['Legacy shape'].count === 1 && ghz.MissedTermsManager.data[path]['Legacy shape'].selector === '#btn-id');
    const stats = ghz.MissedTermsManager.getStats();
    ok('getStats 返回统计', stats.paths >= 1 && stats.terms >= 2);
    ghz.MissedTermsManager.clear();
    clearTimeout(ghz.MissedTermsManager._timer);
}

// ---------- 真实实现：收集器上限与 flush ----------
console.log('\n[MissedTermsManager 上限与 flush]');
{
    ghz.MissedTermsManager.clear();
    const path = __location.pathname;
    for (let i = 0; i < 2001; i++) {
        ghz.MissedTermsManager.record('Term ' + i, {});
    }
    ok('记录数受 MAX_TOTAL(2000) 上限约束',
        Object.keys(ghz.MissedTermsManager.data[path]).length === 2000);
    // 腾出一个名额后可继续记录，证明拒绝源于上限而非逻辑失效
    delete ghz.MissedTermsManager.data[path]['Term 0'];
    ghz.MissedTermsManager.record('FlushProbe', {});
    ok('上限内可继续记录新词条', !!ghz.MissedTermsManager.data[path]['FlushProbe']);
    ghz.MissedTermsManager.flush();
    ok('flush 立即持久化（防抖窗口外不丢数据）',
        !!(gmStore['missedTerms'] && gmStore['missedTerms'][path]['FlushProbe']));
    ghz.MissedTermsManager.clear();
    ok('clear 后立即持久化空对象',
        gmStore['missedTerms'] && Object.keys(gmStore['missedTerms']).length === 0);
}

// ---------- 真实实现：标题翻译（冒烟） ----------
console.log('\n[transTitle 冒烟]');
try {
    document.title = 'GitHub';
    setPath('https://github.com/', '/');
    ghz.updatePageConfig('测试');
    ghz.transTitle();
    ok('transTitle 不抛异常', true);
} catch (e) {
    ok('transTitle 不抛异常: ' + e.message, false);
}

// ---------- 元数据 ----------
console.log('\n[油猴元数据]');
ok('@match github.com', /@match\s+https:\/\/github\.com\/\*/.test(mainCode));
ok('@match gist.github.com', /@match\s+https:\/\/gist\.github\.com\/\*/.test(mainCode));
ok('@require locales.js', /@require.*locales\.js/.test(mainCode));
ok('@grant GM_registerMenuCommand', /@grant\s+GM_registerMenuCommand/.test(mainCode));
ok('@grant GM_notification', /@grant\s+GM_notification/.test(mainCode));
ok('@grant GM_xmlhttpRequest', /@grant\s+GM_xmlhttpRequest/.test(mainCode));
ok('@connect cdn.jsdelivr.net', /@connect\s+cdn\.jsdelivr\.net/.test(mainCode));
ok('@run-at document-start', /@run-at\s+document-start/.test(mainCode));
ok('@license MIT', /@license\s+MIT/.test(mainCode));
{
    const vm = mainCode.match(/@version\s+(\d+\.\d+\.\d+)/);
    const verOk = vm && (() => {
        const [a, b, c] = vm[1].split('.').map(Number);
        return a > 1 || (a === 1 && b > 1) || (a === 1 && b === 1 && c >= 0);
    })();
    ok('版本号 >= 1.1.0', !!verOk);
}

// ---------- 核心函数存在 ----------
console.log('\n[核心函数]');
for (const fn of ['detectPageType', 'buildPageConfig', 'transText', 'traverseNode',
    'handleTextNode', 'handleElementNode', 'setupObserver', 'transTitle',
    'transDesc', 'MissedTermsManager', 'setupMenuCommands', 'init', 'boot']) {
    ok(`含 ${fn}`, mainCode.includes(fn));
}

// ---------- 总结 ----------
console.log(`\n${'='.repeat(50)}`);
console.log(`结果: ${pass} 通过, ${fail} 失败`);
process.exit(fail > 0 ? 1 : 0);