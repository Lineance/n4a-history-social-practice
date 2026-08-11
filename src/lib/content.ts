import { parse as parseYaml } from 'yaml'
import type {
  HistoricalEvent,
  PeriodKey,
  TimelinePeriod,
  Venue,
  VenueImage,
  VisitRecord,
} from '../types/content'
import { PERIOD_KEYS } from '../types/content'

/* ------------------------------------------------------------------ */
/* 加载 content/ 下的 Markdown（构建期打包，见 技术方案.md §4.1）        */
/* ------------------------------------------------------------------ */

const venueFiles = import.meta.glob<string>('/content/venues/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})
const timelineFiles = import.meta.glob<string>('/content/timeline/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})
const eventFiles = import.meta.glob<string>('/content/events/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})
const visitFiles = import.meta.glob<string>('/content/visits/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})
const testimonialFile = import.meta.glob<string>('/content/testimonials.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

/* ------------------------------------------------------------------ */
/* frontmatter 解析（yaml 包，浏览器安全，无 buffer 依赖）               */
/* ------------------------------------------------------------------ */

function parseFrontmatter(raw: string, file: string): { data: Record<string, unknown>; content: string } {
  const m = raw.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n?---[ \t]*\r?\n?/)
  if (!m) {
    throw new Error(`${file}: 缺少 YAML frontmatter（文件应以 --- 开头）`)
  }
  const parsed = parseYaml(m[1])
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`${file}: frontmatter 应为 YAML 映射对象`)
  }
  return { data: parsed as Record<string, unknown>, content: raw.slice(m[0].length) }
}

/* ------------------------------------------------------------------ */
/* frontmatter 校验辅助（字段缺失/类型错误在解析层抛错）                 */
/* ------------------------------------------------------------------ */

function requireString(v: unknown, field: string, file: string): string {
  if (typeof v !== 'string' || v.trim().length === 0) {
    throw new Error(`${file}: 字段 ${field} 缺失或非字符串`)
  }
  return v
}

function requireNumber(v: unknown, field: string, file: string): number {
  if (typeof v !== 'number' || Number.isNaN(v)) {
    throw new Error(`${file}: 字段 ${field} 缺失或非数字`)
  }
  return v
}

function requireBoolean(v: unknown, field: string, file: string): boolean {
  if (typeof v !== 'boolean') {
    throw new Error(`${file}: 字段 ${field} 缺失或非布尔`)
  }
  return v
}

function requireStringArray(v: unknown, field: string, file: string): string[] {
  if (!Array.isArray(v) || v.some((x) => typeof x !== 'string')) {
    throw new Error(`${file}: 字段 ${field} 缺失或非字符串数组`)
  }
  return v as string[]
}

function optionalString(v: unknown, file: string): string | undefined {
  if (v === undefined) return undefined
  if (typeof v !== 'string') {
    throw new Error(`${file}: 可选字符串字段类型错误`)
  }
  return v.length > 0 ? v : undefined
}

function requirePeriodKey(v: unknown, file: string): PeriodKey {
  const key = requireString(v, 'periodKey', file)
  if (!PERIOD_KEYS.includes(key as PeriodKey)) {
    throw new Error(`${file}: 非法 periodKey "${key}"`)
  }
  return key as PeriodKey
}

/* ------------------------------------------------------------------ */
/* 各类型解析                                                          */
/* ------------------------------------------------------------------ */

export function parseVenue(raw: string, file: string): Venue {
  const { data, content } = parseFrontmatter(raw, file)
  const images: VenueImage[] = Array.isArray(data.images)
    ? (data.images as Record<string, unknown>[]).map((im, i) => ({
        src: requireString(im.src, `images[${i}].src`, file),
        caption: optionalString(im.caption, file),
        source: requireString(im.source, `images[${i}].source`, file) as VenueImage['source'],
      }))
    : []
  const coords = data.coords as Record<string, unknown> | undefined
  const dates = data.dates as Record<string, unknown> | undefined
  return {
    id: requireString(data.id, 'id', file),
    cover: requireString(data.cover, 'cover', file),
    name: requireString(data.name, 'name', file),
    shortName: requireString(data.shortName, 'shortName', file),
    city: requireString(data.city, 'city', file),
    coords: {
      lat: requireNumber(coords?.lat, 'coords.lat', file),
      lng: requireNumber(coords?.lng, 'coords.lng', file),
    },
    periodKey: requirePeriodKey(data.periodKey, file),
    dates: {
      from: requireString(dates?.from, 'dates.from', file),
      to: requireString(dates?.to, 'dates.to', file),
    },
    address: requireString(data.address, 'address', file),
    spiritTags: requireStringArray(data.spiritTags, 'spiritTags', file),
    website: optionalString(data.website, file),
    isFieldVisited: requireBoolean(data.isFieldVisited, 'isFieldVisited', file),
    displayOrder: requireNumber(data.displayOrder, 'displayOrder', file),
    images,
    intro: content.trim(),
  }
}

export function parseTimelinePeriod(raw: string, file: string): TimelinePeriod {
  const { data } = parseFrontmatter(raw, file)
  const dates = data.dates as Record<string, unknown> | undefined
  return {
    key: requirePeriodKey(data.key, file),
    title: requireString(data.title, 'title', file),
    subtitle: requireString(data.subtitle, 'subtitle', file),
    dates: {
      from: requireString(dates?.from, 'dates.from', file),
      to: requireString(dates?.to, 'dates.to', file),
    },
    venueIds: requireStringArray(data.venueIds, 'venueIds', file),
    summary: requireString(data.summary, 'summary', file),
    spiritNote: requireString(data.spiritNote, 'spiritNote', file),
    accentColor: optionalString(data.accentColor, file),
  }
}

export function parseEvents(raw: string, file: string): HistoricalEvent[] {
  const { data, content } = parseFrontmatter(raw, file)
  const venueId = requireString(data.venueId, 'venueId', file)
  const sections = content.split(/^## /m).filter((s) => s.trim().length > 0)
  if (sections.length === 0) throw new Error(`${file}: 无事件小节`)
  return sections.map((section, i) => {
    const lines = section.split('\n')
    const header = lines[0].trim()
    const sep = header.indexOf(' · ')
    if (sep < 0) {
      throw new Error(`${file}: 事件标题格式错误，应为 "## 日期 · 标题"，得到 "${header}"`)
    }
    return {
      id: `${venueId}-${i + 1}`,
      venueId,
      date: header.slice(0, sep).trim(),
      title: header.slice(sep + 3).trim(),
      content: lines.slice(1).join('\n').trim(),
    }
  })
}

export function parseVisit(raw: string, file: string): VisitRecord {
  const { data, content } = parseFrontmatter(raw, file)
  return {
    id: requireString(data.id, 'id', file),
    venueId: requireString(data.venueId, 'venueId', file),
    date: requireString(data.date, 'date', file),
    location: requireString(data.location, 'location', file),
    images: requireStringArray(data.images, 'images', file),
    notes: content.trim(),
  }
}

/* ------------------------------------------------------------------ */
/* 导出数据（应用层只读使用）                                          */
/* ------------------------------------------------------------------ */

export const venues: Venue[] = Object.entries(venueFiles)
  .map(([path, raw]) => parseVenue(raw, path))
  .sort((a, b) => a.displayOrder - b.displayOrder)

export const timeline: TimelinePeriod[] = Object.entries(timelineFiles)
  .map(([path, raw]) => parseTimelinePeriod(raw, path))
  .sort((a, b) => fileNumOf(a.key) - fileNumOf(b.key))

function fileNumOf(key: string): number {
  const idx = PERIOD_KEYS.indexOf(key as PeriodKey)
  return idx >= 0 ? idx + 1 : 99
}

export const eventsByVenue: Record<string, HistoricalEvent[]> = Object.fromEntries(
  Object.entries(eventFiles).map(([path, raw]) => {
    const evs = parseEvents(raw, path)
    const venueId = evs[0]?.venueId
    if (!venueId) throw new Error(`${path}: 无事件`)
    return [venueId, evs]
  }),
)

export const visits: VisitRecord[] = Object.entries(visitFiles)
  .map(([path, raw]) => parseVisit(raw, path))
  .sort((a, b) => a.date.localeCompare(b.date))

export const testimonialTexts: string[] = (() => {
  const first = Object.values(testimonialFile)[0]
  if (!first) return []
  const { data } = parseFrontmatter(first, '/content/testimonials.md')
  return requireStringArray(data.texts, 'texts', '/content/testimonials.md')
})()

/* ------------------------------------------------------------------ */
/* 便捷访问器                                                          */
/* ------------------------------------------------------------------ */

export function getVenue(id: string): Venue | undefined {
  return venues.find((v) => v.id === id)
}

export function getEvents(venueId: string): HistoricalEvent[] {
  return eventsByVenue[venueId] ?? []
}
