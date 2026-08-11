import { useEffect, useRef, useState } from 'react'
import type { GeoJSONSource, Map } from 'maplibre-gl'
import { venues } from '../../lib/content'
import { buildArc, emptyLineCollection, lineFeature, pointFeature } from '../../lib/geo'
import { useMapState } from '../../hooks/useMapState'
import styles from './FlyLines.module.css'

const SEGMENT_MS = 1100

function source(map: Map, id: string): GeoJSONSource | undefined {
  return map.getSource(id) as GeoJSONSource | undefined
}

function setTrail(map: Map, coords: [number, number][]) {
  source(map, 'fly-trail')?.setData(
    coords.length ? { type: 'FeatureCollection', features: [lineFeature(coords)] } : emptyLineCollection(),
  )
}

function setDot(map: Map, coord: [number, number]) {
  source(map, 'fly-dot')?.setData(pointFeature(coord))
}

function animateSegment(
  map: Map,
  from: [number, number],
  to: [number, number],
  duration: number,
  done: () => void,
) {
  const pts = buildArc(from, to)
  const t0 = performance.now()
  let raf = 0
  const step = (now: number) => {
    const t = Math.min(1, (now - t0) / duration)
    const idx = Math.min(pts.length - 1, Math.max(0, Math.floor(t * (pts.length - 1))))
    const slice = pts.slice(0, idx + 1)
    setTrail(map, slice)
    setDot(map, slice[slice.length - 1])
    if (t < 1) {
      raf = requestAnimationFrame(step)
    } else {
      done()
    }
  }
  raf = requestAnimationFrame(step)
  return () => cancelAnimationFrame(raf)
}

function FlyLines() {
  const { map, mapReady, periodKey } = useMapState()
  const cancelRef = useRef<(() => void) | null>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    cancelRef.current?.()
    if (!map || !mapReady || !visible) return

    const playFull = () => {
      setTrail(map, [])
      let i = 0
      const next = () => {
        if (i >= venues.length - 1) {
          setDot(map, [venues[venues.length - 1].coords.lng, venues[venues.length - 1].coords.lat])
          return
        }
        const a = [venues[i].coords.lng, venues[i].coords.lat] as [number, number]
        const b = [venues[i + 1].coords.lng, venues[i + 1].coords.lat] as [number, number]
        i += 1
        cancelRef.current = animateSegment(map, a, b, SEGMENT_MS, next)
      }
      next()
    }

    // 进页自动播一遍完整迁移
    playFull()
    return () => cancelRef.current?.()
  }, [map, mapReady, visible])

  // 时期变化 → 播放对应单段
  const prevPeriod = useRef<string | null>(null)
  useEffect(() => {
    if (!map || !mapReady || !periodKey || !visible) return
    if (prevPeriod.current === periodKey) return
    prevPeriod.current = periodKey
    const idx = venues.findIndex((v) => v.periodKey === periodKey)
    if (idx <= 0) {
      setTrail(map, [])
      setDot(map, [venues[0].coords.lng, venues[0].coords.lat])
      return
    }
    cancelRef.current?.()
    setTrail(map, [])
    const a = [venues[idx - 1].coords.lng, venues[idx - 1].coords.lat] as [number, number]
    const b = [venues[idx].coords.lng, venues[idx].coords.lat] as [number, number]
    cancelRef.current = animateSegment(map, a, b, SEGMENT_MS, () => undefined)
    return () => cancelRef.current?.()
  }, [periodKey, map, mapReady, visible])

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setVisible((v) => !v)}
      aria-pressed={visible}
    >
      {visible ? '隐藏飞线' : '重播飞线'}
    </button>
  )
}

export default FlyLines
