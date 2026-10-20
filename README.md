# AI_MultiLab 课题组网站

东南大学机械工程学院王建立教授课题组——智能赋能多物理场分析与检测实验室（AI_MultiLab）的官方网站。默认中文，右上角可切换英文。

- 结构参照 [zhultrafast.org](http://www.zhultrafast.org/)：蓝色导航条，首页有研究方向轮播、课题组简介、负责人和滚动新闻，另加相册。
- 用 [Hugo](https://gohugo.io/) 生成静态网页，托管在 GitHub Pages。
- 内容在网页上的“管理”后台（[Sveltia CMS](https://sveltiacms.app/)）里修改，保存后约 1~2 分钟自动上线。
- 网址：<https://flyingstarme.github.io/AI_MultiLab/>；代码仓库：<https://github.com/flyingstarme/AI_MultiLab>（王建立老师的 GitHub 账号）。

## 一、日常更新（给老师和同学）

1. 打开网站，点页脚右下角的 **“管理”**（即 `网站地址/admin/`）。
2. 输入账号和密码登录（账号由维护的同学开通，见第四节）。第一次登录会多一步“确认登录”，点确认即可；同一台电脑以后不用再登录。
3. 在左侧选择栏目：

| 想做的事 | 栏目 | 操作 |
|---|---|---|
| 发新闻 | 新闻 | 新建 → 填标题、日期、正文（图片可直接拖进正文）→ 保存 |
| 传活动照片 | 相册 | 新建 → 填相册名称、日期 → 在“照片”里一次多选上传 → 保存 |
| 加论文 | 论文 | 新建 → 填年份、方向、引用信息、链接 → 保存 |
| 加项目 | 科研项目 | 新建 → 保存 |
| 新同学入组 | 团队成员 | 新建 → 状态选“在读”，填身份、年级、研究方向、照片 |
| 学生毕业 | 团队成员 | 打开此人 → 状态改“已毕业”，填毕业年份、去向、论文题目 |
| 加合作老师 | 团队成员 | 新建 → 状态选“合作者”，填单位与职称、研究方向、个人主页，可传照片 |
| 改实验室名称、简介、邮箱、微信、地址 | 页面与设置 → 站点设置 | 修改 → 保存 |
| 换首页轮播图 | 页面与设置 → 首页轮播图 | 修改 → 保存（横向图片，宽高比约 11:4） |
| 改负责人介绍、实验平台、加入我们 | 页面与设置 | 修改 → 保存 |

每一条内容都有中文、英文两栏：左右切换语言分别填写。照片、日期、论文引用这类中英文共用的内容只需填一次。

上传的照片会在浏览器里自动压缩成 WebP，不用事先处理。保存后等 1~2 分钟刷新网站；如果没变化，按 Ctrl+F5 强制刷新。

## 二、目录结构（给维护的同学）

```
content/            网站内容（Markdown，每篇一个文件夹，图片和文字放在一起）
                    中文是 index.md，英文是同一文件夹里的 index.en.md
  _index.md           首页：轮播图列表、滚动新闻条数
  pi/                 PI Information
  members/            团队成员（_index.md 是在读成员页，alumni/ 毕业生页，collaborators/ 合作者页；
                      每人一个文件夹，状态 current/alumni/collaborator 决定显示在哪一页）
  research/           Research（三个方向，各一个文件夹）
  publications/       Publications 的论文条目（每篇一个 .md，只有字段，没有正文）
  projects/           代表性科研项目（研究成果的第二个子页面）
  facilities/         Facilities
  news/               News（每条新闻一个文件夹）
  album/              Photo Album（每个相册一个文件夹）
  join/               Join Us
data/site.yaml      课题组名称、简介、邮箱、微信、地址（带 _en 的是英文）
i18n/               页面上固定文字的中英文（菜单以外的按钮、标题等）
tools/              维护工具（make-account.html：生成后台账号；不会发布到网站上）
assets/             样式（css/main.css）、脚本（js/main.js）、logo、首页轮播图
layouts/            页面模板
static/admin/       管理后台（index.html 是账号密码登录页；accounts.json 存加密后的账号；
                    config.yml 是后台的栏目配置；sveltia-cms.js 是后台程序）
hugo.toml           网站配置（中英文菜单及子菜单、是否显示“待补充”标记 showTodo、页脚访客统计 visitCounter）
.github/workflows/  推送后自动构建并发布
```

几点约定：

- 正文里同一段的几张图片会并排显示，点击可以放大；单独一行的斜体文字（`*图：……*`）显示为图注。
- 站点禁止正文里写原始 HTML。上标、下标请直接用 Unicode 字符，如 m²、10⁻⁸、Bi₂Te₃。
- 页脚的访客统计用的是“不蒜子”（busuanzi.ibruce.info，免费、国内可访问），从 2026-10-20 开始计数；不需要时把 `hugo.toml` 里的 `visitCounter` 改成 `false`。
- 首页轮播会一直自动轮动，鼠标停在图片上时暂停。
- 缺内容的地方用 `{{< todo "说明" >}}` 标出，页面上会显示黄色虚线框。内容补齐、正式上线前，把 `hugo.toml` 里的 `showTodo` 改成 `false`，这些框就都不显示了。

## 三、本地预览

需要 Hugo extended 0.168.0 或更新版本（单个可执行文件，不需要 Node 或 Go）：

```bash
hugo server
```

然后打开 <http://localhost:1313>。管理后台本地版：用 Chrome 或 Edge 打开 <http://localhost:1313/admin/>，点 **Work with Local Repository**，选本目录（必须是 git 仓库），改动会直接写到本地文件里。

## 四、修改代码后怎么上线（给维护的同学）

老师在后台保存的内容会直接提交到 GitHub，所以**改代码前一定先拉取**，免得互相覆盖：

```bash
git pull --rebase origin main      # 先拉取老师在后台的最新修改
# ……修改代码，本地 hugo server 预览确认……
git add -A && git commit -m "说明这次改了什么"
git push origin main               # Username 填 flyingstarme，Password 粘贴令牌（不是 GitHub 登录密码）
```

推送后在 <https://github.com/flyingstarme/AI_MultiLab/actions> 能看到构建进度，绿色对勾即已发布。

## 五、上线与账号（已完成，记录备查）

网站仓库是王建立老师 GitHub 账号 `flyingstarme` 下的公开仓库 `AI_MultiLab`，网址 <https://flyingstarme.github.io/AI_MultiLab/>。

1. 仓库 Settings → Pages → Build and deployment → Source 选 **GitHub Actions**（只有仓库主人能改）。
2. 把本目录推送到仓库的 `main` 分支。之后每次推送（包括在后台保存），Actions 都会自动构建并发布，约 1~2 分钟。网址由 Actions 自动填写，`hugo.toml` 里的 `baseURL` 不用改。
3. 后台账号（账号 + 密码登录）需要一个只能改本仓库的 GitHub 令牌，由仓库主人生成：
   - GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token；
   - Repository access 选 Only select repositories → `AI_MultiLab`；
   - Permissions → Repository permissions：**Contents** 选 Read and write；如果这个令牌还要用来在电脑上推送代码，再把 **Workflows** 也选 Read and write；
   - 有效期 1 年，到期前重新生成。
4. 用浏览器打开 `tools/make-account.html`，填账号、密码和令牌，点“生成”，把结果加进 `static/admin/accounts.json` 的 `accounts` 里，提交推送。
   - 原理：令牌用该账号的密码加密后存在网站上，登录时在浏览器里用密码解开再交给后台，全程不经过任何服务器。所以密码要设得长一些，并且不要把令牌原文发到群里。
   - 改密码、令牌到期：重新生成一次，替换 accounts.json 里这个账号的那一行。人员离开：删掉那一行，并在 GitHub 上删除其令牌。
5. 现状（2026-10-20）：Pages 已改为 GitHub Actions；后台账号只有 `wonder`（王建立老师），密码由老师本人掌握。
   这个令牌同时用于推送代码（Contents + Workflows 读写），到期后后台会登不进去、代码也推不上去，要请老师重新生成。
   令牌原文曾在微信里发过、密码也较短，建议找时间让老师重新生成令牌、换 12 位以上的密码，再按第 4 步重做 wonder 这一行。

## 六、升级

- **Hugo**：修改 `.github/workflows/deploy.yml` 里的 `HUGO_VERSION`，以及对应的 `HUGO_SHA256`（取自官方发布页的 checksums 文件）。
- **管理后台**：从 npm 包 `@sveltia/cms` 的 `dist/sveltia-cms.js` 取新版本，替换 `static/admin/sveltia-cms.js`，再在本地 `/admin/` 试一下。

## 致谢

- 网站结构参考了浙江大学朱海明课题组网站（zhultrafast.org）和 FLIP 课题组网站（zhujj09.github.io/flip-site）。本站代码为独立编写，没有复制它们的代码或内容。
- 管理后台使用 Sveltia CMS（MIT 许可，许可文本见 `static/admin/sveltia-cms.LICENSE.txt`）。
