import { useEffect, useRef, useState } from 'react'
import type { GeoJSONSource, Map } from 'maplibre-gl'
import { venues } from '../../lib/content'
import { buildArc, emptyLineCollection, lineFeature, pointFeature } from '../../lib/geo'
import { useMapState } from '../../hooks/useMapState'
import styles from './FlyLines.module.css'

const SEGMENT_MS = 1100

/** 飞线只走地图上打点的场馆（梅园等 onMap:false 不参与） */
const MAP_VENUES = venues.filter((v) => v.onMap !== false)

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
  const prevPeriod = useRef<string | null>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    cancelRef.current?.()
    // 已有选定时期（如从 ?period= hash 进入）时不播全流程，避免与单段播放冲突
    if (!map || !mapReady || !visible || periodKey) return

    const playFull = () => {
      setTrail(map, [])
      let i = 0
      const next = () => {
        if (i >= MAP_VENUES.length - 1) {
          setDot(map, [MAP_VENUES[MAP_VENUES.length - 1].coords.lng, MAP_VENUES[MAP_VENUES.length - 1].coords.lat])
          return
        }
        const a = [MAP_VENUES[i].coords.lng, MAP_VENUES[i].coords.lat] as [number, number]
        const b = [MAP_VENUES[i + 1].coords.lng, MAP_VENUES[i + 1].coords.lat] as [number, number]
        i += 1
        cancelRef.current = animateSegment(map, a, b, SEGMENT_MS, next)
      }
      next()
    }

    playFull()
    return () => cancelRef.current?.()
  }, [map, mapReady, visible, periodKey])

  // 重新显示时允许重放单段
  useEffect(() => {
    if (visible) prevPeriod.current = null
  }, [visible])

  // 时期变化 → 播放对应单段
  useEffect(() => {
    if (!map || !mapReady || !periodKey || !visible) return
    if (prevPeriod.current === periodKey) return
    prevPeriod.current = periodKey
    const idx = MAP_VENUES.findIndex((v) => v.periodKey === periodKey)
    if (idx < 0) {
      setTrail(map, [])
      return
    }
    if (idx === 0) {
      setTrail(map, [])
      setDot(map, [MAP_VENUES[0].coords.lng, MAP_VENUES[0].coords.lat])
      return
    }
    cancelRef.current?.()
    setTrail(map, [])
    const a = [MAP_VENUES[idx - 1].coords.lng, MAP_VENUES[idx - 1].coords.lat] as [number, number]
    const b = [MAP_VENUES[idx].coords.lng, MAP_VENUES[idx].coords.lat] as [number, number]
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
