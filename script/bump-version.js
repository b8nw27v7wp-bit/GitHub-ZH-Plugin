/**
 * bump-version.js — 统一递增版本号并同步到元数据 / 配置 / README 徽章
 * 用法: node script/bump-version.js [patch|minor|major]   （默认 patch）
 *       例如: node script/bump-version.js minor   →  1.3.0 → 1.4.0
 */
const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..');
const USER_JS = path.join(BASE, 'github-zh.user.js');
const README = path.join(BASE, 'README.md');

const level = (process.argv[2] || 'patch').toLowerCase();
if (!['patch', 'minor', 'major'].includes(level)) {
    console.error('用法: node script/bump-version.js [patch|minor|major]');
    process.exit(1);
}

const main = fs.readFileSync(USER_JS, 'utf8');
const vm = main.match(/\/\/ @version\s+(\d+)\.(\d+)\.(\d+)/);
if (!vm) { console.error('未找到 @version'); process.exit(1); }

let [major, minor, patch] = vm.slice(1).map(Number);
if (level === 'major') { major++; minor = 0; patch = 0; }
else if (level === 'minor') { minor++; patch = 0; }
else { patch++; }
const version = `${major}.${minor}.${patch}`;

// 1. 更新 @version（保留原缩进格式）
const newMain = main
    .replace(/\/\/ @version\s+(?:\d+\.\d+\.\d+)/, m => m.replace(/\d+\.\d+\.\d+/, version))
    .replace(/VERSION:\s*'\d+\.\d+\.\d+'/, `VERSION: '${version}'`);

try { new Function(newMain.replace(/\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '')); } catch (e) {
    console.error('改版后语法错误，已中止写入: ' + e.message);
    process.exit(1);
}
fs.writeFileSync(USER_JS, newMain);

// 2. 更新 README 徽章
if (fs.existsSync(README)) {
    let readme = fs.readFileSync(README, 'utf8');
    readme = readme.replace(/!\[version\]\(https:\/\/img\.shields\.io\/badge\/version-[\d.]+-blue\)/,
        `![version](https://img.shields.io/badge/version-${version}-blue)`);
    fs.writeFileSync(README, readme);
}

console.log(`版本 ${vm[0].replace('@version', '').trim()} → ${version} (${level})`);
console.log('已同步: github-zh.user.js (@version / CONFIG.VERSION) + README 徽章');