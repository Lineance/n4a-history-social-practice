import type { Feature, FeatureCollection } from 'geojson'
import type { Venue } from '../types/content'

/** 两点间生成向上拱起的贝塞尔弧线点列（用于飞线轨迹） */
export function buildArc(p0: [number, number], p1: [number, number], steps = 64): [number, number][] {
  const [x0, y0] = p0
  const [x1, y1] = p1
  const mx = (x0 + x1) / 2
  const my = (y0 + y1) / 2
  const dx = x1 - x0
  const dy = y1 - y0
  const dist = Math.hypot(dx, dy) || 1
  const lift = Math.max(0.5, dist * 0.16)
  const px = -dy / dist
  const py = dx / dist
  const cx = mx + px * lift
  const cy = my + py * lift

  const pts: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const a = (1 - t) * (1 - t)
    const b = 2 * (1 - t) * t
    const c = t * t
    pts.push([a * x0 + b * cx + c * x1, a * y0 + b * cy + c * y1])
  }
  return pts
}

/** 多段弧线首尾相接，合成一条完整路线点列（每段去掉重复的起点） */
export function buildRoute(segments: [number, number][][]): [number, number][] {
  const pts: [number, number][] = []
  segments.forEach((arc, i) => {
    if (i === 0) pts.push(...arc)
    else pts.push(...arc.slice(1))
  })
  return pts
}

export function venuePoint(v: Venue): Feature {
  return {
    type: 'Feature',
    properties: {
      id: v.id,
      periodKey: v.periodKey,
      visitStatus: v.visitStatus,
      name: v.name,
      shortName: v.shortName,
    },
    geometry: { type: 'Point', coordinates: [v.coords.lng, v.coords.lat] },
  }
}

export function venuesFeatureCollection(venues: Venue[]): FeatureCollection {
  return { type: 'FeatureCollection', features: venues.map(venuePoint) }
}

export function lineFeature(coords: [number, number][]): Feature {
  return { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } }
}

export function pointFeature(coords: [number, number]): Feature {
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Point', coordinates: coords },
  }
}

export function emptyLineCollection(): FeatureCollection {
  return { type: 'FeatureCollection', features: [] }
}
