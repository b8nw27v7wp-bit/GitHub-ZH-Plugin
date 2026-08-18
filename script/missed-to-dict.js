/**
 * missed-to-dict.js — 把「未命中词条收集」导出的 JSON 转成 locales.js 词条草稿
 * 用法:
 *   node script/missed-to-dict.js 导出文件.json [--page 页面类型]
 * 说明:
 *   - 自动去重：跳过词典中已收录/已被正则覆盖的词条
 *   - 只输出有英文字母的候选项，不含纯数字/纯中文/超长文本
 *   - 按命中次数降序输出，翻译值留 CHANGE_ME 占位符供填写
 */
const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..');
const argFile = process.argv[2];
const onlyPage = process.argv.includes('--page') ? process.argv[process.argv.indexOf('--page') + 1] : null;

if (!argFile) {
    console.error('用法: node script/missed-to-dict.js <missed-terms.json> [--page 页面类型]');
    process.exit(1);
}

const LOCALES = new Function(fs.readFileSync(path.join(BASE, 'locales.js'), 'utf8') + '; return LOCALES;')();
const raw = fs.readFileSync(argFile, 'utf8').replace(/^\uFEFF/, ''); // 兼容 BOM
const data = JSON.parse(raw);

/** 粗略推断页面类型（旧版导出无 pageType 字段时的兜底） */
function guessPageType(pathname) {
    if (!pathname) return 'repository';
    if (/^\/settings/.test(pathname)) return 'settings';
    if (/\/issues\b/.test(pathname)) return 'repository/issues';
    if (/\/pull(s)?\b/.test(pathname)) return 'repository/pulls';
    if (pathname === '/') return 'dashboard';
    return 'repository';
}

/** 检查词条是否已被该页词典覆盖 */
function alreadyCovered(text, pageType) {
    const page = LOCALES[pageType] || {};
    const cleaned = text.replace(/\xa0|[\s]+/g, ' ');
    if ((LOCALES.public.static || {})[cleaned] !== undefined) return true;
    if ((page.static || {})[cleaned] !== undefined) return true;
    const rules = [...(page.regexp || []), ...(LOCALES.public.regexp || [])];
    return rules.some(([re]) => cleaned.replace(re, '') !== cleaned || re.test(cleaned));
}

const grouped = {};   // pageType -> Map<text, {count, paths:Set}>
for (const [pathname, items] of Object.entries(data || {})) {
    for (const [text, meta] of Object.entries(items || {})) {
        const m = (meta && typeof meta === 'object') ? meta : {};
        const count = m.count || 1;
        const pageType = m.pageType || guessPageType(pathname);

        if (!text || text.length > 60 || text.length < 2) continue;
        if (/^[0-9\s\W]*$/.test(text)) continue;               // 纯数字/符号
        if (/^[\u4e00-\u9fa5\s]+$/.test(text)) continue;       // 纯中文
        if (!/[a-zA-Z]/.test(text)) continue;                  // 无英文字母
        if (onlyPage && pageType !== onlyPage) continue;
        if (alreadyCovered(text, pageType)) continue;

        if (!grouped[pageType]) grouped[pageType] = new Map();
        if (!grouped[pageType].has(text)) grouped[pageType].set(text, { count: 0, paths: new Set() });
        const rec = grouped[pageType].get(text);
        rec.count += count;
        rec.paths.add(pathname);
    }
}

const types = Object.keys(grouped).sort();
if (types.length === 0) {
    console.log('没有可输出的候选项（都已收录或不符合格式）');
    process.exit(0);
}

let total = 0;
console.log(`// 来自未命中词条收集的翻译草稿（${argFile}）`);
console.log(`// 用法：把下方条目粘到 locales.js 对应页面类型的 static 块，填写 CHANGE_ME 后提交`);
console.log('');
console.log('const SUGGESTIONS = {');
for (const type of types) {
    const entries = [...grouped[type].entries()].sort((a, b) => b[1].count - a[1].count);
    total += entries.length;
    console.log(`    // ${type}  (${entries.length} 条)`);
    for (const [text, rec] of entries) {
        const pathsHint = [...rec.paths].slice(0, 3).join(', ');
        console.log(`    '${text}': 'CHANGE_ME', // 命中 ${rec.count} 次 | ${pathsHint}`);
    }
    console.log('');
}
console.log('};');
console.log(`// 合计 ${total} 条候选（去重后），若某条目不想收录直接删掉即可`);