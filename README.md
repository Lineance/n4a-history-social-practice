# 铁军精神 · 驻地变迁

新四军军部驻地变迁主题展示网站 —— 暑期社会实践项目（东南大学吴健雄学院 · 铁军寻脉实践团）。

以新四军军部从汉口到梅园的多次驻地变迁为叙事主线，通过**真实交互地图 + 时间轴 + 飞线动画**直观呈现军部"汉口→南昌→岩寺→云岭→盐城→停翅港→黄花塘→梅园"的迁移轨迹，弘扬"铁军精神"。

## 技术栈

| 项 | 选型 |
|----|------|
| 构建 | Vite + React + TypeScript |
| 路由 | React Router（HashRouter，适配 GitHub Pages） |
| 地图 | MapLibre GL + OpenFreeMap 矢量瓦片（真实地图，可缩放至街道级） |
| 动画 | Framer Motion + MapLibre 图层动画 |
| 样式 | CSS Modules（红色文献主题，无 Tailwind） |
| 内容 | Markdown + frontmatter（`content/`），yaml 解析 |
| 灯箱 | yet-another-react-lightbox |
| 留言板 | Giscus（GitHub Discussions，未配置前占位） |
| 测试 | Vitest |
| 部署 | GitHub Pages |

设计方向：**"红色文献 · 铁军档案"**（纸张质感、印章图形、思源宋/楷/黑字体），详见 `设计方向.md`。

## 目录结构

```
AGENTS.md              代理工作约定（命令/代码风格/内容规范，先读）
SKILL.md               前端设计技能
实施指南.md            给开发 agent 的具体实现步骤
content/               网站内容数据（Markdown + frontmatter）
  venues/  timeline/  events/  visits/  testimonials.md
public/                静态资源（images/venues/、favicon 系列、brand/duihui.png）
src/data/geo/          地图几何数据：provinces.json（四省省界）、china.json
src/types/ src/lib/    内容类型与解析层
模块文档/              逐模块实现细节（01-07）
方案/需求/数据模型/技术方案/设计方向.md
```

## 快速开始

```bash
pnpm install
pnpm dev          # 开发服务器 http://localhost:5173
pnpm build        # 生产构建：tsc -b && vite build
pnpm preview      # 预览构建产物
pnpm lint         # oxlint
pnpm typecheck    # tsc --noEmit
pnpm test         # Vitest（content 解析层单测）
```

## 关键文档索引

| 文档 | 内容 |
|------|------|
| `方案.md` | 总体方案、MVP 定稿、实施顺序、验收标准 |
| `需求文档.md` | 逐页面功能与交互需求 |
| `数据模型.md` | content 数据 schema、场馆/事件/时间线数据清单 |
| `技术方案.md` | 工程化细节、MapLibre 实现要点、部署 |
| `设计方向.md` | 视觉规范（红色文献 · 铁军档案） |
| `模块文档/` | 01 全局骨架 / 02 首页 / 03 地图 / 04 详情 / 05 集锦 / 06 留言弹幕 / 07 成果 |
| `实施指南.md` | 给开发 agent 的具体实现步骤（首选阅读） |

## 当前状态

- ✅ 规划文档齐备、内容数据就绪、素材处理完成、git 仓库已建
- ✅ 前端脚手架完成（里程碑 0）
- 🚧 开发进行中，见 `实施指南.md` 里程碑
- ⏳ 团队待办见 `../todo.md`（父目录）

> 本项目为团队社会实践成果展示，仅供学习与展示使用。
