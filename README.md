# 铁军精神 · 驻地变迁

新四军军部驻地变迁主题展示网站 —— 暑期社会实践项目（东南大学吴健雄学院 · 铁军寻脉实践团）。

以新四军军部从汉口到梅园的多次驻地变迁为叙事主线，通过**真实交互地图 + 时间轴 + 飞线动画**直观呈现军部"汉口→南昌→岩寺→云岭→盐城→停翅港→黄花塘→梅园"的迁移轨迹，弘扬"铁军精神"。

## 技术栈

| 项 | 选型 |
|----|------|
| 构建 | Vite + React 18 + TypeScript |
| 路由 | React Router v6（HashRouter，适配 GitHub Pages） |
| 地图 | MapLibre GL + OpenFreeMap 矢量瓦片（真实地图，可缩放至街道级） |
| 动画 | Framer Motion + MapLibre 图层动画 |
| 样式 | CSS Modules（红色文献主题，无 Tailwind） |
| 内容 | Markdown + frontmatter（`content/`），gray-matter 解析 |
| 灯箱 | yet-another-react-lightbox |
| 留言板 | Giscus（GitHub Discussions，未配置前占位） |
| 部署 | GitHub Pages |

设计方向：**"红色文献 · 铁军档案"**（纸张质感、印章图形、思源宋/楷/黑字体），详见 `website/设计方向.md`。

## 目录结构

```
AGENTS.md              代理工作约定（命令/代码风格/内容规范，先读）
SKILL.md               前端设计技能
todo.md                内容/数据待办清单
立项答辩/              申报表、PPT、logo 等源素材（只读）
资料调研/              调研原始文字材料（内容来源，只读）
website/
  content/             网站内容数据（Markdown + frontmatter）
    venues/  timeline/  events/  visits/  testimonials.md
  public/              静态资源
    images/venues/<id>/   场馆图集（WebP）
    favicon.ico / favicon-*.png / apple-touch-icon.png
    brand/duihui.png      队徽（品牌图形）
  src/data/geo/        地图几何数据：provinces.json（四省省界）、china.json
  模块文档/            逐模块实现细节（01-07）
  方案/需求/数据模型/技术方案/设计方向.md
```

## 快速开始

> 项目尚未脚手架。以下命令在 `website/` 目录执行。

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install react-router-dom framer-motion gray-matter maplibre-gl yet-another-react-lightbox
npm install @fontsource/noto-serif-sc @fontsource/noto-sans-sc @fontsource/noto-kai-sc
npm run dev        # 开发服务器 http://localhost:5173
npm run build      # 生产构建：tsc -b && vite build
npm run lint       # ESLint
npm run typecheck  # 类型检查：tsc --noEmit
```

## 关键文档索引

| 文档 | 内容 |
|------|------|
| `website/方案.md` | 总体方案、MVP 定稿、实施顺序、验收标准 |
| `website/需求文档.md` | 逐页面功能与交互需求 |
| `website/数据模型.md` | content 数据 schema、场馆/事件/时间线数据清单 |
| `website/技术方案.md` | 工程化细节、MapLibre 实现要点、部署 |
| `website/设计方向.md` | 视觉规范（红色文献 · 铁军档案） |
| `website/模块文档/` | 01 全局骨架 / 02 首页 / 03 地图 / 04 详情 / 05 集锦 / 06 留言弹幕 / 07 成果 |
| `website/实施指南.md` | **给下一个 agent 的具体实现步骤**（首选阅读） |
| `AGENTS.md` | 代理工作约定（命令/风格/规范） |

## 当前状态

- ✅ 规划文档齐备（方案/需求/数据模型/技术方案/设计方向 + 7 份模块文档）
- ✅ 内容数据就绪：8 场馆（含卡片主图 cover、核实坐标）、8 时期、8 事件、4 调研记录、弹幕预置
- ✅ 素材处理：29 张实地照片已压缩为 WebP；favicon 系列 + 队徽；四省省界 GeoJSON
- ⏳ 待办见 `todo.md`（未实地 4 馆图集、Giscus 仓库、停翅港坐标等）
- 🚧 网站本体未实现，见 `website/实施指南.md`

> 本项目为团队社会实践成果展示，仅供学习与展示使用。
