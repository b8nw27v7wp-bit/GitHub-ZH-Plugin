// ==UserScript==
// @name         GitHub 中文化
// @namespace    https://github.com/b8nw27v7wp-bit/GitHub-ZH-Plugin
// @version      1.3.1
// @description  GitHub 界面中文化插件 — 轻量、实时、智能。支持动态内容翻译、描述一键翻译、未命中词条收集。
// @author       b8nw27v7wp-bit
// @license      MIT
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @match        https://www.githubstatus.com/*
// @require      https://raw.githubusercontent.com/b8nw27v7wp-bit/GitHub-ZH-Plugin/main/locales.js
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @connect      cdn.jsdelivr.net
// @connect      fastly.jsdelivr.net
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 配置 ====================
    const CONFIG = {
        LANG: 'zh-CN',
        DEV: false,
        VERSION: '1.3.1',
        // 翻译引擎（仓库描述远程翻译，可自由替换）
        TRANS_ENGINES: {
            mymemory: {
                name: 'MyMemory',
                url: 'https://api.mymemory.translated.net',
                getRequestData: (text) => ({
                    q: text,
                    langpair: 'en|zh-CN',
                }),
                parseResponse: (data) => data?.responseData?.translatedText || '',
            },
        },
        OBSERVER_CONFIG: {
            childList: true,
            subtree: true,
            characterData: true,
            attributeFilter: ['value', 'placeholder', 'aria-label', 'data-confirm'],
        },
        // 词典远程源（依次降级，主源不可达时换 CDN；缓解 raw.githubusercontent 被墙）
        LOCALES_URLS: [
            'https://raw.githubusercontent.com/b8nw27v7wp-bit/GitHub-ZH-Plugin/main/locales.js',
            'https://cdn.jsdelivr.net/gh/b8nw27v7wp-bit/GitHub-ZH-Plugin@main/locales.js',
            'https://fastly.jsdelivr.net/gh/b8nw27v7wp-bit/GitHub-ZH-Plugin@main/locales.js',
        ],
        LOCALES_CACHE_KEY: 'localesCache',       // 词典内容缓存键
        LOCALES_TIMEOUT: 15000,                  // 单源获取超时 (ms)
        LOCALES_RETRY_DELAY: 30000,              // 全部源失败后的重试间隔 (ms)
        LOCALES_MAX_RETRY: 5,                    // 最大重试次数
    };

    // ==================== 状态管理 ====================
    const State = {
        // 功能开关（持久化）
        featureSet: {
            enable_RegExp: GM_getValue('enable_RegExp', true),
            enable_missedTerms: GM_getValue('enable_missedTerms', false),
            enable_transDesc: GM_getValue('enable_transDesc', true),
        },
        pageConfig: null,
        currentURL: location.href,
        observer: null,
        menuIds: {},          // 动态菜单 ID（用于注销旧菜单项）
    };

    // ==================== 工具函数 ====================
    function safe(fn, label) {
        return function (...args) {
            try { return fn.apply(this, args); }
            catch (e) { console.error(`[GitHub 中文化] ${label}:`, e); }
        };
    }

    function checkLocalesLoaded() {
        if (typeof LOCALES === 'undefined') {
            throw new Error('locales.js 未加载');
        }
    }

    // ==================== 词典加载容错 ====================
    // 摘要：@require 远程加载失败时，依次尝试 GM 缓存与多 CDN 源；全部失败则自动重试
    function installLocales(src) {
        // 词典文件形如 `const LOCALES = {...};`，锚定变量名截取对象字面量执行
        const objSrc = src.replace(/^[\s\S]*?\bLOCALES\s*=\s*/, '').replace(/;\s*$/, '').trim();
        const parsed = new Function(`return (${objSrc});`)();
        if (!parsed || !parsed.conf || !parsed.public) throw new Error('词典内容解析失败');
        globalThis.LOCALES = parsed;
    }

    function loadLocalesFromCache() {
        const cached = GM_getValue(CONFIG.LOCALES_CACHE_KEY, '');
        if (!cached) return false;
        try {
            installLocales(cached);
            return true;
        } catch (e) {
            console.error('[GitHub 中文化] 词典缓存损坏:', e);
            GM_setValue(CONFIG.LOCALES_CACHE_KEY, '');
            return false;
        }
    }

    function fetchText(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                timeout: CONFIG.LOCALES_TIMEOUT,
                onload: r => (r.status >= 200 && r.status < 300)
                    ? resolve(r.responseText)
                    : reject(new Error('HTTP ' + r.status)),
                onerror: () => reject(new Error('网络错误')),
                ontimeout: () => reject(new Error('超时')),
            });
        });
    }

    async function loadLocalesFromRemote() {
        const errs = [];
        for (const url of CONFIG.LOCALES_URLS) {
            try {
                const src = await fetchText(url);
                installLocales(src);
                GM_setValue(CONFIG.LOCALES_CACHE_KEY, src);
                return;
            } catch (e) {
                errs.push(e.message);
            }
        }
        throw new Error('词典源均不可用: ' + errs.join(' / '));
    }

    function boot(attempt = 1) {
        // @require 已在脚本前加载 或 可用缓存兜底 → 直接启动
        if (typeof LOCALES !== 'undefined' || loadLocalesFromCache()) {
            init();
            return;
        }

        loadLocalesFromRemote()
            .then(() => init())
            .catch(err => {
                console.error('[GitHub 中文化] 词典加载失败:', err);
                if (attempt === 1) {
                    GM_notification('「GitHub 中文化」词典加载失败，将自动重试…', '提示');
                }
                if (attempt >= CONFIG.LOCALES_MAX_RETRY) return;
                setTimeout(() => boot(attempt + 1), CONFIG.LOCALES_RETRY_DELAY);
            });
    }

    // ==================== 页面类型检测 ====================
    function detectPageType() {
        const url = new URL(location.href);
        const { pathname, hostname } = url;

        // 特殊站点
        if (hostname === 'gist.github.com') return 'gist';
        if (hostname === 'www.githubstatus.com') return 'status';

        // 认证页面
        if (document.body?.classList.contains('session-authentication')) return 'session-authentication';

        // 首页（登录/未登录）
        if (pathname === '/') return 'dashboard';

        // 仓库页面
        const repoMatch = pathname.match(LOCALES.conf.rePagePathRepo);
        if (repoMatch) return `repository/${repoMatch[1]}`;

        // 组织页面
        const orgMatch = pathname.match(LOCALES.conf.rePagePathOrg);
        if (orgMatch) return `orgs/${orgMatch[1] || orgMatch.slice(-1)[0]}`;

        // 用户资料页面
        if (document.body?.classList.contains('page-profile')) {
            return pathname.includes('/stars') ? 'page-profile/stars' : 'page-profile';
        }

        // 通用页面（先于仓库主页启发式检测，避免 /settings/profile 等被误判为仓库）
        const pathMatch = pathname.match(LOCALES.conf.rePagePath);
        if (pathMatch) return pathMatch[1] || pathMatch.slice(-1)[0];

        // 仓库主页 /user/repo（无子路径）
        if (/^\/[^/]+\/[^/]+$/.test(pathname)) {
            return 'repository';
        }

        return null;
    }

    // ==================== 页面配置构建 ====================
    function buildPageConfig(pageType) {
        // 词典为扁平结构：LOCALES.public / LOCALES.repository / LOCALES.settings ...
        const publicZh = LOCALES.public || {};
        const pageZh = LOCALES[pageType] || {};

        // 合并忽略选择器
        const allIgnoreMutation = [
            ...(LOCALES.conf.ignoreMutationSelectors['*'] || []),
            ...(LOCALES.conf.ignoreMutationSelectors[pageType] || []),
        ];
        const allIgnoreStatic = [
            ...(LOCALES.conf.ignoreSelectors['*'] || []),
            ...(LOCALES.conf.ignoreSelectors[pageType] || []),
        ];

        return {
            pageType,
            pathname: location.pathname,
            // 静态翻译词典（公共 + 页面特定，页面特定优先）
            staticDict: {
                ...(publicZh.static || {}),
                ...(pageZh.static || {}),
            },
            // 正则翻译规则（页面特定优先）
            regexpRules: [
                ...(pageZh.regexp || []),
                ...(publicZh.regexp || []),
            ],
            // 页面标题翻译
            titleDict: pageZh.title?.static || {},
            titleRegexp: pageZh.title?.regexp || [],
            // 忽略选择器
            ignoreMutationSelectors: allIgnoreMutation.join(', '),
            ignoreSelectors: allIgnoreStatic.join(', '),
            // 是否监视 characterData
            characterData: (LOCALES.conf.characterDataPages || []).includes(pageType),
        };
    }

    function updatePageConfig(trigger) {
        const newType = detectPageType();
        if (!newType) {
            State.pageConfig = null;
        } else if (newType !== State.pageConfig?.pageType) {
            State.pageConfig = buildPageConfig(newType);
        }
        if (CONFIG.DEV) console.log(`[GitHub 中文化] ${trigger} → ${State.pageConfig?.pageType || 'N/A'}`);
    }

    // ==================== 翻译核心 ====================
    function transText(text, context) {
        if (!text || /^[0-9\s]*$/.test(text) || /^[\u4e00-\u9fa5]+$/.test(text) || !/[a-zA-Z,.]/.test(text)) {
            return false;
        }

        const trimmed = text.trim();
        const cleaned = trimmed.replace(/\xa0|[\s]+/g, ' ');

        const cfg = State.pageConfig;
        if (!cfg) return false;

        // 静态匹配（用函数替换，避免译文中的 $ 序列被二次解释）
        const staticResult = cfg.staticDict[cleaned];
        if (typeof staticResult === 'string' && staticResult !== cleaned) {
            return text.replace(trimmed, () => staticResult);
        }

        // 正则匹配
        if (State.featureSet.enable_RegExp) {
            for (const [pattern, replacement] of cfg.regexpRules) {
                const result = cleaned.replace(pattern, replacement);
                if (result !== cleaned) {
                    return text.replace(trimmed, () => result);
                }
            }
        }

        // 记录未命中词条（贡献翻译用）
        if (State.featureSet.enable_missedTerms) {
            MissedTermsManager.record(cleaned, context);
        }

        return false;
    }

    // ==================== DOM 遍历 ====================
    function traverseNode(rootNode) {
        if (rootNode.nodeType === Node.TEXT_NODE) {
            handleTextNode(rootNode);
            return;
        }

        const walker = document.createTreeWalker(
            rootNode,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
            node => {
                if (node.nodeType === Node.ELEMENT_NODE && State.pageConfig?.ignoreSelectors) {
                    if (node.matches(State.pageConfig.ignoreSelectors)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        );

        let node;
        while ((node = walker.nextNode())) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                handleElementNode(node);
            } else if (node.nodeType === Node.TEXT_NODE) {
                handleTextNode(node);
            }
        }
    }

    function handleTextNode(node) {
        if (node.length > 500) return;
        const text = node.data;
        if (!text) return;
        const result = transText(text, { el: node.parentElement });
        // transText 以 false 表示未命中；空字符串是有效翻译值（如 'on': ''），需写入
        if (result !== false && result !== text) {
            node.data = result;
        }
    }

    function handleElementNode(node) {
        const tag = node.tagName;

        // 时间元素
        if (tag === 'RELATIVE-TIME') {
            if (node.shadowRoot) {
                // 仅修改文本节点，避免整体替换破坏 shadow DOM 结构
                const walker = document.createTreeWalker(node.shadowRoot, NodeFilter.SHOW_TEXT);
                let tn;
                while ((tn = walker.nextNode())) {
                    const text = tn.data;
                    const result = text.replace(/^on/, '');
                    if (result !== text) tn.data = result;
                }
            }
            return;
        }

        // 输入框
        if (tag === 'INPUT' || tag === 'TEXTAREA') {
            if (['button', 'submit', 'reset'].includes(node.type)) {
                transAttrs(node.dataset, 'confirm');
                transAttrs(node, 'value');
            } else {
                transAttrs(node, 'placeholder');
            }
            return;
        }

        // 选项组
        if (tag === 'OPTGROUP') {
            transAttrs(node, 'label');
            return;
        }

        // 按钮
        if (tag === 'BUTTON') {
            transAttrs(node, ['title', 'cancelConfirmText']);
            transAttrs(node.dataset, ['confirm', 'confirmText', 'confirmCancelText', 'disableWith', 'visibleText']);
        }

        // 链接和 span
        if (tag === 'A' || tag === 'SPAN') {
            transAttrs(node, 'title');
            transAttrs(node.dataset, 'visibleText');
        }

        // 工具提示
        if (/tooltipped/.test(node.className)) {
            transAttrs(node, 'ariaLabel');
        }
    }

    function transAttrs(target, attrs) {
        const attrList = Array.isArray(attrs) ? attrs : [attrs];
        for (const attr of attrList) {
            const text = target[attr];
            if (!text) continue;
            const result = transText(text, { el: target });
            if (result !== false && result !== text) target[attr] = result;
        }
    }

    // ==================== 标题翻译 ====================
    function transTitle() {
        const cfg = State.pageConfig;
        if (!cfg) return;

        const text = document.title;
        let result = cfg.titleDict[text] || '';

        if (!result) {
            for (const [pattern, replacement] of cfg.titleRegexp) {
                result = text.replace(pattern, replacement);
                if (result !== text) break;
            }
        }

        if (result) document.title = result;
    }

    // ==================== 仓库描述翻译 ====================
    function transDesc(selector) {
        if (!State.featureSet.enable_transDesc) return;
        const element = document.querySelector(selector);
        if (!element || element.nextElementSibling?.classList.contains('translate-button')) return;

        const button = document.createElement('div');
        button.className = 'translate-button';
        button.textContent = '📖 翻译';
        button.title = '使用 MyMemory 翻译此描述';
        element.after(button);

        button.addEventListener('click', safe(async () => {
            // div 无 disabled 行为，用 dataset 标志防连点
            if (button.dataset.translating === '1') return;
            const text = element.textContent.trim();
            if (!text) return;
            button.dataset.translating = '1';
            button.textContent = '⏳ 翻译中...';

            try {
                const engine = CONFIG.TRANS_ENGINES.mymemory;
                const params = new URLSearchParams(engine.getRequestData(text));
                const res = await fetch(`${engine.url}/get?${params}`);
                if (!res.ok) throw new Error('HTTP ' + res.status);
                const data = await res.json();
                const result = engine.parseResponse(data);

                if (result && result !== text) {
                    const box = document.createElement('div');
                    box.className = 'translation-result';
                    box.textContent = result;
                    button.after(box);
                    button.textContent = '📖 已翻译';
                    // 成功后保持标志位，按钮一次性生效，避免重复插入结果框
                } else {
                    button.textContent = '❌ 翻译失败';
                    delete button.dataset.translating; // 允许重试
                }
            } catch (err) {
                console.error('[GitHub 中文化] 描述翻译失败:', err);
                button.textContent = '❌ 翻译失败';
                delete button.dataset.translating;
            }
        }, '描述翻译'));
    }

    // 未命中词条的简单来源描述：优先 id，其次 tag+单一 class
    function simpleDesc(el) {
        if (!el || typeof el !== 'object') return '';
        const id = el.id;
        if (id) return `#${id}`;
        const tag = typeof el.tagName === 'string' ? el.tagName.toLowerCase() : '';
        const cls = typeof el.className === 'string' ? el.className.trim() : '';
        return tag + (cls && !/\s/.test(cls) ? '.' + cls : '');
    }

    // ==================== 未命中词条收集器 ====================
    const MissedTermsManager = {
        data: GM_getValue('missedTerms', {}),
        MAX_TOTAL: 2000,      // 词条总量上限，防止无限膨胀

        // 当前词条总数（仅在新增词条时统计，避免高频开销）
        totalSize() {
            let n = 0;
            for (const p in this.data) n += Object.keys(this.data[p]).length;
            return n;
        },

        record(text, context) {
            if (!text || text.length > 60) return;
            const path = location.pathname;
            if (!this.data[path]) this.data[path] = {};
            if (!this.data[path][text] && this.totalSize() >= this.MAX_TOTAL) return;
            // 兼容旧结构（value 为字符串 ''）：统一升级为对象
            const prev = this.data[path][text];
            const entry = (prev && typeof prev === 'object') ? prev : {};
            entry.count = (entry.count || 0) + 1;
            entry.pageType = State.pageConfig?.pageType || '';
            const desc = simpleDesc(context?.el);
            if (desc) entry.selector = desc;
            this.data[path][text] = entry;
            // 防抖保存
            clearTimeout(this._timer);
            this._timer = setTimeout(() => {
                this._timer = null;
                GM_setValue('missedTerms', this.data);
            }, 2000);
        },

        // 立即持久化（页面隐藏时调用，避免防抖窗口内的记录丢失）
        flush() {
            if (!this._timer) return;
            clearTimeout(this._timer);
            this._timer = null;
            GM_setValue('missedTerms', this.data);
        },

        getStats() {
            const paths = Object.keys(this.data);
            const terms = paths.reduce((sum, p) => sum + Object.keys(this.data[p]).length, 0);
            const freq = paths.reduce((sum2, p) => sum2 + Object.values(this.data[p])
                .reduce((s, v) => s + (typeof v === 'object' ? (v.count || 1) : 1), 0), 0);
            return { paths: paths.length, terms, freq };
        },

        exportJSON() {
            return JSON.stringify(this.data, null, 2);
        },

        clear() {
            this.data = {};
            GM_setValue('missedTerms', {});
        },
    };

    // ==================== 菜单命令 ====================
    function setupMenuCommands() {
        // 1. 正则翻译开关
        refreshToggleMenu('正则翻译', 'enable_RegExp');
        // 2. 描述翻译开关
        refreshToggleMenu('描述翻译', 'enable_transDesc');
        // 3. 未命中词条收集器开关（动态菜单）
        refreshMissedTermsMenu();
    }

    // 注销旧菜单项后重注册，保证开关文案与实际状态同步
    function refreshToggleMenu(label, key) {
        const menuId = 'toggle_' + key;
        if (State.menuIds[menuId]) {
            GM_unregisterMenuCommand(State.menuIds[menuId]);
            delete State.menuIds[menuId];
        }
        State.menuIds[menuId] = GM_registerMenuCommand(
            `${State.featureSet[key] ? '禁用' : '启用'} ${label}`,
            () => {
                const newState = !State.featureSet[key];
                State.featureSet[key] = newState;
                GM_setValue(key, newState);
                GM_notification(`${label}已${newState ? '启用' : '禁用'}`);
                if (newState && State.pageConfig) safe(traverseNode, '菜单触发遍历')(document.body);
                refreshToggleMenu(label, key);
            }
        );
    }

    function refreshMissedTermsMenu() {
        // 先注销旧菜单项，避免重复累积
        ['missedToggle', 'exportMissed', 'clearMissed'].forEach(id => {
            if (State.menuIds[id]) {
                GM_unregisterMenuCommand(State.menuIds[id]);
                delete State.menuIds[id];
            }
        });

        const label = `${State.featureSet.enable_missedTerms ? '禁用' : '启用'} 未命中词条收集`;
        State.menuIds.missedToggle = GM_registerMenuCommand(label, () => {
            State.featureSet.enable_missedTerms = !State.featureSet.enable_missedTerms;
            GM_setValue('enable_missedTerms', State.featureSet.enable_missedTerms);
            GM_notification(State.featureSet.enable_missedTerms ? '已启用词条收集' : '已禁用词条收集');
            refreshMissedTermsMenu();
        });

        if (State.featureSet.enable_missedTerms) {
            const stats = MissedTermsManager.getStats();
            if (stats.terms > 0) {
                State.menuIds.exportMissed = GM_registerMenuCommand(`📥 导出词条 (${stats.terms}条)`, () => {
                    const blob = new Blob([MissedTermsManager.exportJSON()], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `github_zh_missed_${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                });
                State.menuIds.clearMissed = GM_registerMenuCommand('🗑️ 清空词条', () => {
                    MissedTermsManager.clear();
                    GM_notification('词条已清空');
                    refreshMissedTermsMenu();
                });
            }
        }
    }

    // ==================== MutationObserver ====================
    function setupObserver() {
        if (State.observer) State.observer.disconnect();

        State.observer = new MutationObserver(
            safe(mutations => {
                // 检测 URL 变化
                if (location.href !== State.currentURL) {
                    State.currentURL = location.href;
                    updatePageConfig('URL变化');
                    if (State.pageConfig) {
                        transTitle();
                        transDesc(getDescSelector());
                    }
                }

                if (!State.pageConfig) return;

                const nodes = new Set();
                for (const { target, addedNodes, type } of mutations) {
                    if (type === 'childList') {
                        for (const node of addedNodes) {
                            if (!shouldIgnoreMutation(node)) nodes.add(node);
                        }
                    } else if (type === 'attributes') {
                        if (!shouldIgnoreMutation(target)) nodes.add(target);
                    } else if (type === 'characterData' && State.pageConfig.characterData) {
                        if (!shouldIgnoreMutation(target)) nodes.add(target);
                    }
                }

                // 去重：过滤掉已被祖先包含的节点
                const topNodes = new Set();
                for (const node of nodes) {
                    let ancestor = node.parentElement;
                    let hasAncestor = false;
                    while (ancestor) {
                        if (nodes.has(ancestor)) { hasAncestor = true; break; }
                        ancestor = ancestor.parentElement;
                    }
                    if (!hasAncestor) topNodes.add(node);
                }

                for (const node of topNodes) {
                    traverseNode(node);
                }
            }, 'MutationObserver')
        );

        State.observer.observe(document.body, CONFIG.OBSERVER_CONFIG);
    }

    function shouldIgnoreMutation(node) {
        const el = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
        if (!el) return true;
        if (State.pageConfig?.ignoreMutationSelectors && el.closest?.(State.pageConfig.ignoreMutationSelectors)) {
            return true;
        }
        return false;
    }

    // ==================== 描述选择器 ====================
    function getDescSelector() {
        const type = State.pageConfig?.pageType;
        // 与 conf.ignoreSelectors.repository 的描述元素保持一致
        if (type === 'repository') return 'p.f4.my-3';
        if (type === 'gist') return '.gist-content [itemprop="about"]';
        return null;
    }

    // ==================== Turbo 事件 ====================
    function setupTurboEvents() {
        document.addEventListener('turbo:load', safe(() => {
            if (!State.pageConfig) return;
            transTitle();
            safe(traverseNode, 'turbo遍历')(document.body);
            transDesc(getDescSelector());
        }, 'turbo:load'));
    }

    // ==================== 初始化 ====================
    function init() {
        checkLocalesLoaded();
        initLangEnv();
        injectStyles();
        setupMenuCommands();
        setupInitTrans();
        setupTurboEvents();
        // 页面隐藏时立即持久化词条收集数据，避免防抖窗口内关页丢失记录
        window.addEventListener('pagehide', () => MissedTermsManager.flush());
    }

    function initLangEnv() {
        document.documentElement.lang = CONFIG.LANG;
        const observer = new MutationObserver(() => {
            if (document.documentElement.lang === 'en') {
                document.documentElement.lang = CONFIG.LANG;
            }
        });
        observer.observe(document.documentElement, { attributeFilter: ['lang'] });
    }

    function injectStyles() {
        GM_addStyle(`
            .translate-button {
                display: inline-block;
                color: var(--fgColor-accent, #0969da);
                font-size: small;
                cursor: pointer;
                margin-top: 5px;
                user-select: none;
            }
            .translate-button:hover { text-decoration: underline; }
            .translation-result {
                margin-top: 10px;
                padding: 8px 12px;
                border: 1px solid var(--borderColor-default, #d0d7de);
                border-radius: 6px;
                background: var(--bgColor-muted, #f6f8fa);
                white-space: pre-wrap;
                line-height: 1.5;
            }
        `);
    }

    function setupInitTrans() {
        function doInitTrans() {
            updatePageConfig('首次加载');
            if (State.pageConfig) {
                safe(traverseNode, '首次遍历')(document.body);
                transTitle();
                transDesc(getDescSelector());
            }
            setupObserver();
        }

        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            doInitTrans();
        } else {
            window.addEventListener('DOMContentLoaded', doInitTrans, { once: true });
        }
    }

    // ==================== 启动 ====================
    boot();
})();
