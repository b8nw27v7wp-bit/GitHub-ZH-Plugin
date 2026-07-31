// ==UserScript==
// @name         GitHub 中文化
// @namespace    https://github.com/your-username/github-zh
// @version      1.0.0
// @description  GitHub 界面中文化插件 — 轻量、实时、智能
// @author       YourName
// @license      MIT
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @match        https://www.githubstatus.com/*
// @require      https://raw.githubusercontent.com/your-username/github-zh/main/locales.js
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 配置 ====================
    const CONFIG = {
        LANG: 'zh-CN',
        DEV: false,
        OBSERVER_CONFIG: {
            childList: true,
            subtree: true,
            characterData: true,
            attributeFilter: ['value', 'placeholder', 'aria-label', 'data-confirm'],
        },
        // 深色主题下的样式变量
        STYLES: `
            :root { --gzh-primary: #58a6ff; --gzh-bg: #f6f8fa; --gzh-border: #d0d7de; }
            @media (prefers-color-scheme: dark) {
                :root { --gzh-primary: #58a6ff; --gzh-bg: #161b22; --gzh-border: #30363d; }
            }
        `,
    };

    // ==================== 状态管理 ====================
    const State = {
        pageConfig: null,
        currentURL: location.href,
        observer: null,
        initDone: false,
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
            console.error('[GitHub 中文化] 词典文件未加载');
            throw new Error('locales.js 未加载');
        }
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

        // 首页
        if (pathname === '/') {
            return document.body?.classList.contains('logged-in') ? 'dashboard' : 'dashboard';
        }

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

        // 通用页面
        const pathMatch = pathname.match(LOCALES.conf.rePagePath);
        if (pathMatch) return pathMatch[1] || pathMatch.slice(-1)[0];

        return null;
    }

    // ==================== 页面配置构建 ====================
    function buildPageConfig(pageType) {
        const zh = LOCALES[CONFIG.LANG] || LOCALES.zh || {};
        const publicZh = LOCALES.public || {};
        const pageZh = zh[pageType] || {};

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
            // 静态翻译词典（页面特有 + 公共）
            staticDict: {
                ...(publicZh.static || {}),
                ...(pageZh.static || {}),
            },
            // 正则翻译规则
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
            characterData: LOCALES.conf.characterDataPages.includes(pageType),
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
    function transText(text) {
        if (!text || /^[0-9\s]*$/.test(text) || /^[\u4e00-\u9fa5]+$/.test(text) || !/[a-zA-Z,.]/.test(text)) {
            return false;
        }

        const trimmed = text.trim();
        const cleaned = trimmed.replace(/\xa0|[\s]+/g, ' ');

        const cfg = State.pageConfig;
        if (!cfg) return false;

        // 静态匹配
        const staticResult = cfg.staticDict[cleaned];
        if (typeof staticResult === 'string' && staticResult !== cleaned) {
            return text.replace(trimmed, staticResult);
        }

        // 正则匹配
        for (const [pattern, replacement] of cfg.regexpRules) {
            const result = cleaned.replace(pattern, replacement);
            if (result !== cleaned) {
                return text.replace(trimmed, result);
            }
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
        transAttrs(node, 'data');
    }

    function handleElementNode(node) {
        const tag = node.tagName;

        // 时间元素
        if (tag === 'RELATIVE-TIME') {
            if (node.shadowRoot) {
                const text = node.shadowRoot.textContent;
                const result = text?.replace(/^on/, '');
                if (result && result !== text) node.shadowRoot.textContent = result;
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
            const result = transText(text);
            if (result) target[attr] = result;
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

    // ==================== MutationObserver ====================
    function setupObserver() {
        if (State.observer) State.observer.disconnect();

        State.observer = new MutationObserver(
            safe(mutations => {
                // 检测 URL 变化
                if (location.href !== State.currentURL) {
                    State.currentURL = location.href;
                    updatePageConfig('URL变化');
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

    // ==================== Turbo 事件 ====================
    function setupTurboEvents() {
        document.addEventListener('turbo:load', safe(() => {
            if (!State.pageConfig) return;
            transTitle();
        }, 'turbo:load'));
    }

    // ==================== 初始化 ====================
    function init() {
        checkLocalesLoaded();
        initLangEnv();
        injectStyles();
        setupInitTrans();
        setupTurboEvents();
        State.initDone = true;
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
        GM_addStyle(CONFIG.STYLES);
    }

    function setupInitTrans() {
        function doInitTrans() {
            updatePageConfig('首次加载');
            if (State.pageConfig) {
                safe(traverseNode, '首次遍历')(document.body);
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
    init();
})();
