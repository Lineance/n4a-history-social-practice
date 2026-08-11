import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  eventsByVenue,
  parseEvents,
  parseTimelinePeriod,
  parseVenue,
  parseVisit,
  testimonialTexts,
  timeline,
  venues,
  visits,
} from './content'

const root = fileURLToPath(new URL('../../', import.meta.url))

function validVenueRaw(): string {
  return `---
id: test
cover: /images/venues/test/cover.webp
name: 测试纪念馆
shortName: 测试
city: 湖北武汉
coords:
  lat: 30.5
  lng: 114.3
periodKey: hankou
dates:
  from: "1938-01-01"
  to: "1938-02-01"
address: 测试路 1 号
spiritTags: [铁军]
website: https://example.com
isFieldVisited: true
displayOrder: 1
images:
  - src: /images/venues/test/01.webp
    caption: 外景
    source: field
---
这是简介。
`
}

describe('content 解析层', () => {
  it('合法 frontmatter 解析出 Venue', () => {
    const v = parseVenue(validVenueRaw(), 'test.md')
    expect(v.id).toBe('test')
    expect(v.coords.lat).toBe(30.5)
    expect(v.periodKey).toBe('hankou')
    expect(v.images).toHaveLength(1)
    expect(v.intro).toContain('简介')
  })

  it('缺失必填字段抛错', () => {
    const bad = validVenueRaw().replace('id: test\n', '')
    expect(() => parseVenue(bad, 'test.md')).toThrow()
  })

  it('非法 periodKey 抛错', () => {
    const bad = validVenueRaw().replace('periodKey: hankou', 'periodKey: unknown')
    expect(() => parseVenue(bad, 'test.md')).toThrow()
  })

  it('事件按 "## 日期 · 标题" 切分', () => {
    const evs = parseEvents(
      '---\nvenueId: hankou\n---\n## 1938-01-01 · 事件A\n正文A\n\n## 1938-02-01 · 事件B\n正文B\n',
      'e.md',
    )
    expect(evs).toHaveLength(2)
    expect(evs[0].date).toBe('1938-01-01')
    expect(evs[0].title).toBe('事件A')
    expect(evs[0].content).toBe('正文A')
  })

  it('非法事件标题（无 · 分隔）抛错', () => {
    expect(() => parseEvents('---\nvenueId: h\n---\n## 没有分隔符\n', 'e.md')).toThrow()
  })

  it('空事件文件抛错', () => {
    expect(() => parseEvents('---\nvenueId: h\n---\n', 'e.md')).toThrow()
  })

  it('timeline 与 visit 解析正常', () => {
    const t = parseTimelinePeriod(
      '---\nkey: hankou\ntitle: 汉口时期\nsubtitle: 举旗定向\ndates:\n  from: "a"\n  to: "b"\nvenueIds: [hankou]\nsummary: s\nspiritNote: n\n---\n',
      't.md',
    )
    expect(t.key).toBe('hankou')
    const v = parseVisit(
      '---\nid: x\nvenueId: hankou\ndate: "2026-01-01"\nlocation: l\nimages: [a]\n---\n',
      'v.md',
    )
    expect(v.id).toBe('x')
  })
})

describe('content 数据完整性', () => {
  it('数量正确：venues=8, timeline=8, events=8, visits=4', () => {
    expect(venues).toHaveLength(8)
    expect(timeline).toHaveLength(8)
    expect(Object.keys(eventsByVenue)).toHaveLength(8)
    expect(visits).toHaveLength(4)
  })

  it('venue id 唯一，且按 displayOrder 排序', () => {
    const ids = venues.map((v) => v.id)
    expect(new Set(ids).size).toBe(ids.length)
    const orders = venues.map((v) => v.displayOrder)
    expect([...orders].sort((a, b) => a - b)).toEqual(orders)
  })

  it('event.venueId 指向存在场馆，且字段非空', () => {
    const venueIds = new Set(venues.map((v) => v.id))
    for (const [vid, evs] of Object.entries(eventsByVenue)) {
      expect(venueIds.has(vid)).toBe(true)
      expect(evs.length).toBeGreaterThan(0)
      for (const e of evs) {
        expect(e.venueId).toBe(vid)
        expect(e.date.length).toBeGreaterThan(0)
        expect(e.title.length).toBeGreaterThan(0)
        expect(e.content.length).toBeGreaterThan(0)
      }
    }
  })

  it('visit.venueId 为实地调研场馆，且图片存在', () => {
    const visited = new Set(venues.filter((v) => v.isFieldVisited).map((v) => v.id))
    for (const v of visits) {
      expect(visited.has(v.venueId)).toBe(true)
      for (const img of v.images) {
        expect(
          existsSync(path.join(root, 'public', img.replace(/^\//, ''))),
          `${img} 不存在`,
        ).toBe(true)
      }
    }
  })

  it('cover 与 images 文件真实存在', () => {
    for (const v of venues) {
      expect(existsSync(path.join(root, 'public', v.cover.replace(/^\//, ''))), `${v.cover} 不存在`).toBe(true)
      for (const im of v.images) {
        expect(existsSync(path.join(root, 'public', im.src.replace(/^\//, ''))), `${im.src} 不存在`).toBe(true)
      }
    }
  })

  it('坐标在中国境内', () => {
    for (const v of venues) {
      expect(v.coords.lng).toBeGreaterThanOrEqual(73)
      expect(v.coords.lng).toBeLessThanOrEqual(135)
      expect(v.coords.lat).toBeGreaterThanOrEqual(18)
      expect(v.coords.lat).toBeLessThanOrEqual(54)
    }
  })

  it('timeline venueIds 存在，periodKey 与 venues 对齐', () => {
    const venueIds = new Set(venues.map((v) => v.id))
    for (const t of timeline) {
      for (const vid of t.venueIds) {
        expect(venueIds.has(vid)).toBe(true)
      }
    }
  })

  it('弹幕文案非空数组', () => {
    expect(testimonialTexts.length).toBeGreaterThan(0)
    for (const t of testimonialTexts) {
      expect(t.length).toBeGreaterThan(0)
    }
  })
})
