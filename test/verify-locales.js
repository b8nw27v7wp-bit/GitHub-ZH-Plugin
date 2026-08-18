/**
 * verify-locales.js — locales.js 词典静态校验
 * 检查: 重复键 / 首尾空白键 / 空翻译值 / 正则替换组越界 / 括号配对 / 结构完整性
 * 运行: node test/verify-locales.js
 * 说明: 硬错误退出码 1（进 CI），软警告仅打印不影响结果
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'locales.js');
const src = fs.readFileSync(FILE, 'utf8');
const lines = src.split(/\r?\n/);

let pass = 0, fail = 0, warn = 0;
const ok = (name, cond) => { pass++; if (cond) console.log('  ✓ ' + name); else { fail++; console.error('  ✗ ' + name); } };
const warnOut = (name) => { warn++; console.warn('  ⚠ ' + name); };

console.log('[结构]');
let LOCALES;
try {
    LOCALES = new Function(src + '; return LOCALES;')();
    ok('locales.js 语法 + 可加载', true);
} catch (e) {
    ok('locales.js 语法 + 可加载: ' + e.message, false);
    process.exit(1);
}

// ---------- 括号配对 ----------
{
    let depth = 0;
    for (const t of lines) {
        for (const ch of t) {
            if (ch === '{') depth++;
            else if (ch === '}') depth--;
        }
        if (depth < 0) break;
    }
    ok('大括号配对平衡', depth === 0);
}

console.log('\n[目录结构]');
ok('含 conf', !!LOCALES.conf);
ok('conf.rePagePath / rePagePathRepo / rePagePathOrg 均为正则',
    LOCALES.conf.rePagePath instanceof RegExp &&
    LOCALES.conf.rePagePathRepo instanceof RegExp &&
    LOCALES.conf.rePagePathOrg instanceof RegExp);
ok('ignoreMutationSelectors / ignoreSelectors / characterDataPages 存在',
    !!LOCALES.conf.ignoreMutationSelectors && !!LOCALES.conf.ignoreSelectors &&
    Array.isArray(LOCALES.conf.characterDataPages));
ok('含 public 词典', !!LOCALES.public?.static && Array.isArray(LOCALES.public?.regexp));

// ---------- 逐 static 块静态校验 ----------
console.log('\n[词条扫描]');
function findStaticBlocks() {
    const blocks = [];
    let braceDepth = 0, inStatic = false, staticStart = -1, staticDepth = -1, page = '';
    for (let i = 0; i < lines.length; i++) {
        const t = lines[i];
        const open = (t.match(/{/g) || []).length;
        const close = (t.match(/}/g) || []).length;
        const pageMatch = t.match(/^    ([A-Za-z'"][^:{]*?):\s*\{?\s*$/);
        if (pageMatch) page = pageMatch[1].replace(/^['"]|['"]$/g, '');
        if (!inStatic) {
            if (/static\s*:\s*\{/.test(t)) {
                inStatic = true; staticStart = i; staticDepth = braceDepth;
            }
        } else if (braceDepth === staticDepth && !/static\s*:\s*\{/.test(t) && /^\s*\}?,?\s*$/.test(t)) {
            inStatic = false;
            blocks.push({ page, start: staticStart, end: i });
        }
        braceDepth += open - close;
    }
    return blocks;
}

const blocks = findStaticBlocks();
let blankKeys = 0, dupKeys = 0, emptyValues = 0, badRefs = 0, totalEntries = 0, totalPages = 0;

// 允许空翻译值的白名单（有意为之，如 'on': ''）
const EMPTY_ALLOW = new Set(['on']);

// 统计正则中的捕获组数量（忽略 (?:...) 非捕获组与 (?=...) 等）
function countGroups(patternRe) {
    const s = patternRe.source;
    let n = 0;
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '\\') { i++; continue; }
        if (s[i] === '(' && s[i + 1] !== '?') n++;
    }
    return n;
}

// 解析替换串中的 $n 引用并校验是否越界
function checkRefs(label, patternRe, replacement) {
    if (typeof replacement !== 'string') { badRefs++; ok(`${label}: 替换值非字符串`, false); return; }
    const refs = replacement.match(/\$(\d+)/g) || [];
    const groups = countGroups(patternRe);
    for (const ref of refs) {
        const n = parseInt(ref.slice(1), 10);
        if (n > groups) {
            badRefs++;
            ok(`${label}: 替换串近照引用 $${n} 但正则只有 ${groups} 组`, false);
        }
    }
}

for (const b of blocks) {
    const seen = {};
    for (let i = b.start + 1; i < b.end; i++) {
        const t = lines[i];
        const m = t.match(/^\s*'((?:[^'\\]|\\.)*)':\s*'((?:[^'\\]|\\.)*)'\s*,?\s*$/);
        // 静态词条
        if (m) {
            const key = m[1], val = m[2];
            totalEntries++;
            if (key !== key.trim()) { blankKeys++; warnOut(`${b.page}: 键含首尾空白 ${JSON.stringify(key)}`); }
            if (val.trim() === '' && !EMPTY_ALLOW.has(key)) { emptyValues++; warnOut(`${b.page}: 空翻译值 '${key}'`); }
            if (seen[key] !== undefined) {
                if (seen[key] === m[2]) {
                    dupKeys++;
                    ok(`${b.page}: 重复键 '${key}'（前值 ${seen[key]} 与后值 ${m[2]} 一致，可删）`, false);
                } else {
                    dupKeys++;
                    ok(`${b.page}: 重复键 '${key}'（前值 ${seen[key]} ≠ 后值 ${m[2]}）`, false);
                }
            }
            seen[key] = m[2];
            continue;
        }
        // 正则规则行: [new RegExp('...'), '...']
        const rm = t.match(/\[new RegExp\('((?:[^'\\]|\\.)*)',\s*'([^']*)'\)\s*,\s*'((?:[^'\\]|\\.)*)'\]\s*,?\s*$/);
        if (rm) {
            try {
                const re = new RegExp(rm[1]);
                checkRefs(`${b.page}: ${rm[1]}`, re, rm[3]);
            } catch (e) {
                ok(`${b.page}: 正则无法编译 '${rm[1]}' (${e.message})`, false);
            }
        }
        // 标题 static 块内的键也复用上面的静态匹配（缩进为 8 空格，正则已按首部空白匹配）
    }
    if (Object.keys(seen).length > 0) totalPages++;
}

ok('所有 static 块无重复键', dupKeys === 0);

console.log('\n[统计]');
console.log(`  页面/static 块数: ${totalPages}，词条总数: ${totalEntries}`);

console.log(`\n${'='.repeat(50)}`);
console.log(`结果: ${pass} 通过, ${fail} 失败, ${warn} 软警告`);
if (fail > 0) process.exit(1);
if (warn > 0) {
    console.log('存在软警告（不影响构建，建议排查上方 ⚠ 项）');
    process.exit(1);
}
process.exit(0);