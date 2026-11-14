---
x-title: 终端图 —— 一段命令行会话,画成苹果风格窗口
x-desc: 'x-cmd/draw 终端图(`/draw/tty`):一行命令 + 它的输出,画成 macOS 风格终端窗口(红黄绿灯 + 标题栏),ANSI 转义还原成颜色。参数:`cmd=`(内置小 shell 会真的跑它)、`out=`(直接给带 ANSI 的输出)、`cols=`/`rows=`、`title=`、`theme=`。'
x-sidebar: 终端图
x-keywords: 终端图, 终端截图, terminal, tty, ANSI, draw, svg, README 截图, 命令行
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 终端图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 03-terminal'
---

# 终端图 —— 一段命令行会话,画成苹果风格窗口

README 里贴「终端截图」的老问题:截图是位图、换主题就重拍、还不能改。
`/draw/tty` 把**一段命令行会话画成 SVG**:圆角窗口顶上红黄绿三个灯 +
标题栏,下面一行命令(带 `$` 提示符和光标),再下面是输出 —— 输出里的
**ANSI 转义序列还原成颜色**(粗体、暗色、256 色、真彩色都认)。

命令给了 `out=` 就用你给的输出;没给,**内置的小 shell 会真的把命令跑一遍**:
`help` 看说明、`echo` 回声、`clear` 清屏(静态图里就是一句提示)、
`draw <图种> --labels A,B --values 1,2` 把图画成 Unicode 字符图。
不认识的命令也有老规矩:`command not found: xxx` —— 当画面用完全可以。

## 参数

| 参数 | 意思 | 默认 |
|---|---|---|
| `cmd=` | 命令行(窗口里那一行) | — |
| `out=` | 输出(可带 ANSI 转义);给了就跳过内置 shell | 内置 shell 跑 `cmd=` |
| `cols=` | 窗口宽(字符列数,20–200) | 72 |
| `rows=` | 窗口高(行数,1–200;装不下就截断) | 24 |
| `title=` | 标题栏文字 | 命令本身 |
| `theme=` | `dark` / `light` | dark |

## 例子

### shell 里画图

```text
https://x-cmd.com/draw/tty?cmd=draw%20bar%20--labels%20Mon%2CTue%2CWed%2CThu%20--values%2012%2C30%2C18%2C25&cols=58
```

[![终端 · shell 里画图](https://x-cmd.com/draw/tty?cmd=draw%20bar%20--labels%20Mon%2CTue%2CWed%2CThu%20--values%2012%2C30%2C18%2C25&cols=58)](https://x-cmd.com/draw/explore/tty?cmd=draw%20bar%20--labels%20Mon%2CTue%2CWed%2CThu%20--values%2012%2C30%2C18%2C25&cols=58)

内置小 shell 认 `bar hbar pie line area gauge` 六种图种 —— 同一张图,
URL 里换 `--labels`/`--values` 就换内容。

### 小 shell 的自白

```text
https://x-cmd.com/draw/tty?cmd=help&cols=58
```

[![终端 · help](https://x-cmd.com/draw/tty?cmd=help&cols=58)](https://x-cmd.com/draw/explore/tty?cmd=help&cols=58)

### 自己的输出 + ANSI + 标题栏

`out=` 直接放原始输出(记得 URL-encode:换行 `%0A`、ESC `%1B`),
ANSI 序列会还原成颜色 —— 这是贴 CI 日志、测试输出的正路:

```text
https://x-cmd.com/draw/tty?cmd=python3%20-m%20pytest&out=%1B%5B1mcollected%203%20items%1B%5B0m%0A%0Atest_api.py%20%1B%5B32m...%1B%5B0m%20%1B%5B32mPASSED%1B%5B0m%0Atest_web.py%20%1B%5B32m..%1B%5B0m%20%1B%5B32mPASSED%1B%5B0m%0Atest_db.py%20%1B%5B31mF%1B%5B0m%20%1B%5B31mFAILED%1B%5B0m%0A%0A%1B%5B31m1%20failed%2C%202%20passed%20in%200.42s%1B%5B0m&title=ci%20%C2%B7%20pytest&cols=64&rows=12
```

[![终端 · CI 输出](https://x-cmd.com/draw/tty?cmd=python3%20-m%20pytest&out=%1B%5B1mcollected%203%20items%1B%5B0m%0A%0Atest_api.py%20%1B%5B32m...%1B%5B0m%20%1B%5B32mPASSED%1B%5B0m%0Atest_web.py%20%1B%5B32m..%1B%5B0m%20%1B%5B32mPASSED%1B%5B0m%0Atest_db.py%20%1B%5B31mF%1B%5B0m%20%1B%5B31mFAILED%1B%5B0m%0A%0A%1B%5B31m1%20failed%2C%202%20passed%20in%200.42s%1B%5B0m&title=ci%20%C2%B7%20pytest&cols=64&rows=12)](https://x-cmd.com/draw/explore/tty?cmd=python3%20-m%20pytest&out=%1B%5B1mcollected%203%20items%1B%5B0m%0A%0Atest_api.py%20%1B%5B32m...%1B%5B0m%20%1B%5B32mPASSED%1B%5B0m%0Atest_web.py%20%1B%5B32m..%1B%5B0m%20%1B%5B32mPASSED%1B%5B0m%0Atest_db.py%20%1B%5B31mF%1B%5B0m%20%1B%5B31mFAILED%1B%5B0m%0A%0A%1B%5B31m1%20failed%2C%202%20passed%20in%200.42s%1B%5B0m&title=ci%20%C2%B7%20pytest&cols=64&rows=12)

`title=` 改标题栏(不写就用命令本身),`rows=12` 把窗口收到 12 行。

## 限制

- **内置小 shell 只会那几件事**:`help` / `echo` / `clear` / `draw …`。
  想要真实输出,用 `out=` 把命令的真实打印贴进来。
- **`rows=` 会截断。** 输出超过行数就从下面切掉 —— 截图要完整,就把
  `rows=` 放大或把输出剪短。
- **东亚宽字符按两格列宽算**,断行尽量落在空格上(断不开就硬断),
  中文输出也对得齐。
- **`out=` 一定要 encode。** `%` 本身写 `%25`,换行 `%0A`,ESC `%1B`;
  不编码的裸控制字符过不了 URL。

## 跟别的图种的区别

别的图种画**数据**,终端图画**会话** —— 它不是统计图,是一段命令的证据。
配套的还有交互页 [/draw/explore/tty](https://x-cmd.com/draw/explore/tty):
左边是这个窗口,右边能改命令和输出,调好再复制图片 URL。

图库里还有更多:[/draw/demo/info](https://x-cmd.com/draw/demo/info)。
