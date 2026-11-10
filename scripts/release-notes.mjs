// 生成 release notes:带代码构成图(tokei)和这一版的改动清单。
//
//   node scripts/release-notes.mjs v0.3.1 > release-notes.md
//
// 两张图:
//   1. 这一版的增量 —— 上一个 tag 到 HEAD 之间改动的文件,按语言分代码/注释/空行
//   2. 整个仓库的构成 —— 当前 tag 的全貌
// 两张图都由 /draw/tokei 渲染(输入就是 tokei --output json 的输出)。
import { execFileSync, execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://x-cmd.com/draw';
const EXCLUDE = ['node_modules', 'dist', '.wrangler', '.git', 'coverage'];

const run = (cmd, args) => execFileSync(cmd, args, { cwd: ROOT, encoding: 'utf-8', maxBuffer: 1 << 26 });
const git = (...args) => run('git', args).trim();

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'));
const version = process.argv[2] || pkg.version;

/** 上一个 tag(没有就 null) */
const prevTag = (() => {
  try {
    return git('describe', '--tags', '--abbrev=0', 'HEAD~1');
  } catch {
    return null;
  }
})();

/** 这一版改动的文件(还在的、算代码的) */
const changedFiles = (() => {
  if (!prevTag) return [];
  const out = git('diff', '--name-only', `${prevTag}..HEAD`);
  return out
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s && existsSync(join(ROOT, s)))
    // 锁文件、CI 配置不算「这一版写的代码」
    .filter((s) => /^(src|test|scripts|docs)\//.test(s) || s.endsWith('.md'));
})();

/** tokei 的统计 → 每门语言三项合计(整份输出给 URL 太长,只留要的) */
const tokeiTotals = (paths) => {
  if (!paths.length) return {};
  let raw;
  try {
    // 路径要放在 --exclude 前面:exclude 是变参选项,会把手边的路径一起吞掉
    raw = run('tokei', ['--output', 'json', ...paths, '--exclude', ...EXCLUDE]);
  } catch (e) {
    console.error('tokei 跑不动:', e.message.split('\n')[0]);
    return {};
  }
  const parsed = JSON.parse(raw);
  const out = {};
  for (const [lang, v] of Object.entries(parsed)) {
    if (lang === 'Total' || !v || typeof v !== 'object') continue;
    const code = Math.round(v.code ?? 0);
    const comments = Math.round(v.comments ?? 0);
    const blanks = Math.round(v.blanks ?? 0);
    if (code + comments + blanks === 0) continue;
    out[lang] = { code, comments, blanks };
  }
  return out;
};

const chart = (totals, title, w = 760, h = 440) => {
  if (!Object.keys(totals).length) return null;
  const d = encodeURIComponent(JSON.stringify(totals));
  return `${BASE}/tokei?d=${d}&title=${encodeURIComponent(title)}&w=${w}&h=${h}`;
};

const total = tokeiTotals(['src', 'test', 'scripts']);
const increment = tokeiTotals(changedFiles);

const lines = [];
lines.push(`# draw ${version}`);
lines.push('');
if (increment && Object.keys(increment).length) {
  const files = changedFiles.length;
  lines.push(
    `This release touches ${files} file${files === 1 ? '' : 's'}. ` +
    `Here is the code in them — code, comments and blanks per language:`,
    '',
  );
  const url = chart(increment, `${version} · the files it touches`);
  if (url) {
    lines.push('```text', url, '```', '', `![Code composition of the files this release touches](${url})`, '');
  }
}
lines.push('## The codebase today', '');
lines.push('Every file in `src/`, `test/` and `scripts/`, by language:', '');
const totalUrl = chart(total, `${version} · the whole repo`);
if (totalUrl) {
  lines.push('```text', totalUrl, '```', '', `![Code composition of the whole repo](${totalUrl})`, '');
}

lines.push('## What changed', '');
try {
  const log = git('log', '--pretty=- %s (%h)', prevTag ? `${prevTag}..HEAD` : 'HEAD');
  lines.push(log);
} catch {
  lines.push('- (no commits found)');
}
lines.push('');

process.stdout.write(lines.join('\n'));
