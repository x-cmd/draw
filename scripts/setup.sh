#!/usr/bin/env bash
# draw 一键自部署(第一阶段:仅渲染服务,短链未启用):curl -fsSL .../scripts/setup.sh | bash
#
# 前置:Cloudflare 账号;本机需 git / node>=18 / npm / curl。
# 流程:克隆仓库 → wrangler 登录 → 部署到 workers.dev → 冒烟测试。
# 短链(POST)需要 GitHub 数据仓 + PAT,第一阶段不配置;启用方法见结束提示。
# 交互全部走 /dev/tty,curl 管道下照常提问;提示打到 stderr,答案从 stdout 返回。
# 兼容 macOS bash 3.2(不用 mapfile/关联数组)。
set -euo pipefail

# 仓库地址(也可用环境变量 REPO_URL 覆盖)
REPO_URL="${REPO_URL:-https://github.com/x-cmd-hub/draw}"

say()   { printf '\033[1;36m==>\033[0m %s\n' "$*"; }
warn()  { printf '\033[1;33m !\033[0m %s\n' "$*"; }
die()   { printf '\033[1;31mx 失败:\033[0m %s\n' "$*" >&2; exit 1; }

# prompt <问题> [默认值] → 答案走 stdout
prompt() {
  local q="$1" d="${2:-}" a=""
  if [ -n "$d" ]; then printf '\033[1m%s\033[0m(回车=%s): ' "$q" "$d" >&2
  else printf '\033[1m%s\033[0m: ' "$q" >&2; fi
  IFS= read -r a < /dev/tty || true
  printf '%s' "${a:-$d}"
}

printf '\033[1m\033[36mdraw 自部署(Cloudflare Workers,第一阶段:仅渲染)\033[0m\n\n'

# --- 1. 依赖检查 ---
for c in git node npm curl; do
  command -v "$c" >/dev/null 2>&1 || die "缺少 $c,请先安装(Node 需 >= 18)"
done
NODE_MAJOR="$(node -p 'parseInt(process.versions.node.split(".")[0], 10)')"
[ "$NODE_MAJOR" -ge 18 ] || die "需要 Node >= 18,当前 $(node -v)"

# --- 2. 获取代码(在仓库内运行则跳过克隆)---
if [ -f src/index.ts ] && [ -f wrangler.jsonc ]; then
  APP_DIR="$PWD"
  say "在仓库目录内运行,跳过克隆"
else
  APP_DIR="$PWD/draw"
  [ -d "$APP_DIR" ] && die "./draw 目录已存在,请先删除或换个目录再跑"
  say "克隆 $REPO_URL"
  git clone --depth 1 "$REPO_URL" "$APP_DIR" || die "克隆失败,检查 REPO_URL($REPO_URL)"
fi
cd "$APP_DIR"
say "安装依赖(npm install)"
npm install --no-audit --no-fund

# --- 3. Cloudflare 登录 ---
if ! npx wrangler whoami >/dev/null 2>&1; then
  say "需要登录 Cloudflare(将打开浏览器)"
  npx wrangler login || die "wrangler 登录失败"
fi
npx wrangler whoami >/dev/null 2>&1 || die "wrangler 未登录"

# --- 4. Worker 名称 ---
NAME="$(prompt 'Worker 名称' 'draw')"

# --- 5. 写入部署配置(改用户本地副本,不动上游仓库)---
# 第一阶段不配置短链存储:不留 DATA_REPO,POST 建短链会返回"未配置"提示(GET 渲染不受影响)
say '写入 wrangler.jsonc(name,去 routes/vars → workers.dev 入口)'
node - "$NAME" <<'EOF'
const fs = require('fs');
const [name] = process.argv.slice(2);
let src = fs.readFileSync('wrangler.jsonc', 'utf8');
src = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, ''); // jsonc → json(本仓库无行尾注释)
const cfg = JSON.parse(src);
cfg.name = name;
delete cfg.routes;  // workers.dev 根路径入口;要绑自有域名可在 dashboard 加回 route
delete cfg.vars;    // 去掉上游的 DATA_REPO/DATA_BRANCH(短链未启用)
fs.writeFileSync('wrangler.jsonc', JSON.stringify(cfg, null, 2) + '\n');
EOF

# --- 6. 部署 ---
say '部署到 Cloudflare(首次可能要几十秒)'
DEPLOY_OUT="$(npx wrangler deploy 2>&1)" || {
  if printf '%s' "$DEPLOY_OUT" | grep -qi 'ratelimit'; then
    warn '当前计划不支持 rate limit binding,移除限流配置后重试(POST 将不限流)'
    node -e "const fs=require('fs');const c=JSON.parse(fs.readFileSync('wrangler.jsonc','utf8'));delete c.ratelimits;fs.writeFileSync('wrangler.jsonc',JSON.stringify(c,null,2)+'\n')"
    DEPLOY_OUT="$(npx wrangler deploy 2>&1)" || { printf '%s\n' "$DEPLOY_OUT" >&2; die 'wrangler deploy 失败'; }
  else
    printf '%s\n' "$DEPLOY_OUT" >&2
    die 'wrangler deploy 失败'
  fi
}
URL="$(printf '%s\n' "$DEPLOY_OUT" | grep -oE 'https://[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+\.workers\.dev' | head -1)"
[ -n "$URL" ] || die "部署完成但未能解析 workers.dev 地址,输出:\n$DEPLOY_OUT"

# --- 7. 冒烟测试 ---
say "冒烟测试 $URL/?type=pie&labels=A,B&values=2,3"
sleep 3
if curl -fsSL "$URL/?type=pie&labels=A,B&values=2,3" | head -c 300 | grep -q '<svg'; then
  say '渲染正常 ✓'
else
  warn '渲染返回异常(可能是刚部署的传播延迟,稍等一分钟再试)'
fi

printf '\n\033[1m部署完成!\033[0m\n'
printf '  演示页   %s\n' "$URL"
printf '  图表     %s/?type=pie&labels=A,B&values=2,3\n' "$URL"
printf '  更新     cd %s && git pull && npx wrangler deploy\n' "$APP_DIR"
printf '  自有域名 dashboard → Workers → %s → Settings → Domains & Routes\n' "$NAME"
printf '  (路径前缀自动适配:/draw 子路径与根路径均可,无需改代码)\n'
printf '  短链     第一阶段未启用(POST 会返回未配置提示)。启用:建公开仓 → 本地 wrangler.jsonc\n'
printf '           vars 设 DATA_REPO=owner/name → npx wrangler secret put GITHUB_TOKEN(fine-grained PAT\n'
printf '           仅授该仓 Contents 写)→ npx wrangler deploy\n'
