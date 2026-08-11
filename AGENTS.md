# AGENTS.md

> 本文件供在本仓库工作的 agentic 编程代理使用。请先阅读，遵循其中的命令与约定。

## 项目概述

"铁军精神·驻地变迁"——新四军军部驻地变迁主题展示网站（暑期社会实践项目）。
- 形态：纯静态站（Vite + React 18 + TypeScript），部署 GitHub Pages，无后端
- 地图：MapLibre GL + OpenFreeMap 矢量瓦片（真实地图，可缩放至街道级）
- 留言板：Giscus（需 GitHub 仓库 + Discussions，未配置前用占位）
- 设计方向：**"红色文献·铁军档案"**，详见 `website/设计方向.md`，涉及页面视觉/动效时必读
- 前端设计技能：仓库根 `SKILL.md`（frontend-design），写前端 UI 时遵循其美学准则
- MVP 范围：仅桌面版（无响应式）；首页仅 Hero 开场；集锦页仅照片墙；弹幕用预置留言
- 配套规划文档：`website/方案.md`、`需求文档.md`、`数据模型.md`、`技术方案.md`、`模块文档/`

## 目录结构

```
SKILL.md              前端设计技能（必读）
todo.md               内容/数据待办清单（含"花心思找官方照片"等团队备注，勿擅自执行）
立项答辩/             申报表/PPT/logo 等源素材
资料调研/             调研原始文字材料（内容来源，只读参考）
website/
  content/            内容数据（Markdown + frontmatter，改动即网站内容）
    venues/   timeline/   events/   visits/    testimonials.md
  public/             静态资源：images/venues/<id>/（WebP）、favicon 系列、brand/duihui.png
  src/data/geo/       provinces.json（四省省界）、china.json
  各 *.md             规划文档（方案/需求/数据模型/技术方案/设计方向）
  模块文档/           逐模块实现细节
```

## 命令

> 项目已脚手架（Vite + React + TS），使用 **pnpm**。所有命令在 `website/` 目录执行。

```bash
pnpm install              # 安装依赖（react-router-dom, framer-motion, yaml, maplibre-gl, yet-another-react-lightbox, @fontsource/*, vitest）
pnpm dev                  # 开发服务器（默认 http://localhost:5173）
pnpm build                # 生产构建：tsc -b && vite build
pnpm preview              # 预览构建产物
pnpm lint                 # oxlint
pnpm typecheck            # 类型检查：tsc -b
```

### 测试（Vitest 已配置）

- `pnpm test` — 全量测试
- 运行单个测试文件：`npx vitest run src/lib/content.test.ts`
- 监听模式：`npx vitest src/lib/content.test.ts`
- 只跑某个用例（-t 过滤）：`npx vitest run src/lib/content.test.ts -t "venues"`
- 现有测试覆盖 `src/lib/content.ts`（frontmatter 解析抛错 + 数据完整性校验）

## 内容编辑规范（content/ 是数据，不是代码）

- 所有展示内容在 `website/content/**/*.md`，**禁止硬编码进组件**
- 每个 `.md` = frontmatter（YAML）+ 正文；字段 schema 严格按 `website/数据模型.md`
- 文件命名统一 `01-` 编号前缀（如 `01-hankou.md`），与 `displayOrder` 一致；一馆一文件
- `events/*.md` 正文按 `## 日期 · 标题` 分区，每个二级标题 = 一个事件
- 坐标 `coords` 须为**街道级核实值**（高德/OSM 检索），未核实的在 `todo.md` 标注
- 图片一律 WebP、单张 ≤300KB、宽 ≤1600px，放置 `public/images/venues/<id>/`
- 场馆 frontmatter 的 `cover`（卡片主图）与 `images`（图集）都指向已存在的文件
- 修改内容后用 `npm run typecheck`（解析层有 schema 断言）验证

## 代码风格

### 通用格式化
- 2 空格缩进；单引号；行尾分号（Prettier 默认）
- 组件 props 用解构并标注类型（`interface Props` / `type Props`）
- 文件不超过约 400 行为宜，超出考虑拆分组件/hook
- 优先 `@fontsource` 自托管字体，不引外部 CDN 字体

### TypeScript
- `strict` 模式开启；禁止 `any`（明确需要时 `unknown` + 收窄）
- 内容 schema 接口集中在 `src/types/content.ts`，解析函数在 `src/lib/content.ts`
- 解析 frontmatter 用 `yaml`（浏览器安全、无 buffer 依赖），加载用 `import.meta.glob(..., { eager: true })`
- 接口/类型命名：`Venue`、`TimelinePeriod`、`HistoricalEvent`、`VisitRecord`（见数据模型）
- 可空字段用 `?`（如 `website?: string`），不用 `| null` 泛滥

### React
- 只用函数组件 + Hooks；**禁止类组件**
- 路由用 React Router v6（部署用 HashRouter）
- 路由级懒加载：`React.lazy` + `Suspense`；页面过渡用 Framer Motion `AnimatePresence`
- 全局状态用 React Context（如地图 `periodKey`），不引状态库
- `useEffect` 必须带清理（地图实例、事件监听、rAF、定时器）
- 列表渲染需稳定 `key`（用内容 id，不用数组下标）

### 样式（CSS Modules）
- 每个组件一个 `*.module.css`；主题变量集中在 `styles/theme.css` 的 `:root`
- 禁止内联样式（动态计算值除外）；不使用 Tailwind
- 色板/字体/质感遵循 `website/设计方向.md`（红色文献风格：纸张纹理、印章、思源宋/楷/黑）
- 关键动效用 Framer Motion；纯 CSS 动画用 `@keyframes` 集中于 module 文件内

### 命名
- 组件/类型：PascalCase（`VenueCard.tsx`、`TimelinePeriod`）
- 文件/函数/变量：camelCase；内容 id 一律小写（`hankou`）
- 目录：`components/map/`、`pages/`、`lib/`、`types/`、`hooks/`
- 事件相关 `HistoricalEvent`；地图相关组件归 `components/map/`

### 导入顺序
1. 外部包（`react`、`react-router-dom`、`maplibre-gl`…）
2. 相对路径模块（组件、lib、types）
3. 样式 `*.module.css`
组间空行分隔；类型导入用 `import type`。

### 错误处理
- 内容解析：字段缺失/类型错误**在解析层抛错**（开发期暴露），不得静默吞掉
- 异步（Giscus/地图瓦片）：加载中给 fallback 占位；失败给可读提示，不白屏
- 地图实例：组件卸载时清理（`map.remove()`、取消 rAF 循环）
- 无效路由参数（如不存在的场馆 id）：跳回首页或展示 404 兜底

### 地图（MapLibre）
- 原生 `maplibre-gl`（ref + useEffect），不用 react 封装库
- 瓦片：OpenFreeMap `https://tiles.openfreemap.org/styles/positron`，再叠加主题配色
- 四省强调层用 `src/data/geo/provinces.json`；标记/飞线用 GeoJSON source + 图层
- 交互：悬停卡用 `map.project()` 定位浮层；时间轴联动用 `map.flyTo`
- 地图页懒加载；瓦片加载中给占位背景

### 性能与可访问性
- 图片一律懒加载（`loading="lazy"`）且已压缩（WebP ≤300KB）
- 页面文字：正文用思源黑体保证可读；标题对比度符合红色主题视觉
- 交互元素有 `aria-label`/键盘可达（按钮、时间轴节点、灯箱）

## 文档与提交

- 规划文档改动需保持四份主文档（方案/需求/数据模型/技术方案）+ 模块文档一致
- 涉及页面视觉/动效的实现，先对照 `website/设计方向.md` 与仓库根 `SKILL.md` 再动手
- 提交信息规范：`feat:` / `fix:` / `chore:` / `docs:` 前缀
- 大文件（`ppt初稿.pptx`、14MB 队旗源 SVG 等）不入 git；建议加 `.gitignore`（含 `node_modules/`、`dist/`、`*.pptx`、`立项答辩/` 大文件）
- `todo.md` 中团队手写备注（如"找官方照片"）是团队待办，**未经明确指示不要替团队执行**
- 立项答辩 / 资料调研 目录为源素材，只读参考，不随意改动
