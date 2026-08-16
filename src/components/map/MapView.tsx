import { useEffect, useRef, useState } from 'react'
import {
  Map as MapLibreMap,
  type ErrorEvent,
  type MapMouseEvent,
  type StyleSpecification,
} from 'maplibre-gl'
import type { FeatureCollection } from 'geojson'
import 'maplibre-gl/dist/maplibre-gl.css'
import { venues, timeline } from '../../lib/content'
import provinces from '../../data/geo/provinces.json'
import { emptyLineCollection, venuesFeatureCollection } from '../../lib/geo'
import { tiandituTk } from '../../config'
import { useMapState } from '../../hooks/useMapState'
import styles from './MapView.module.css'

const TIANDITU_HOSTS = ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7']

/** 天地图 WMTS 底图（矢量 + 注记），本地 style 定义，不依赖外部 style JSON */
function buildTiandituStyle(tk: string): StyleSpecification {
  const wmts = (layer: string) =>
    TIANDITU_HOSTS.map(
      (h) =>
        `https://${h}.tianditu.gov.cn/${layer}_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${layer}&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${tk}`,
    )
  return {
    version: 8,
    sources: {
      'tianditu-base': {
        type: 'raster',
        tiles: wmts('vec'),
        tileSize: 256,
        attribution: '天地图',
      },
      'tianditu-label': {
        type: 'raster',
        tiles: wmts('cva'),
        tileSize: 256,
        attribution: '天地图',
      },
    },
    layers: [
      { id: 'bg', type: 'background', paint: { 'background-color': '#efe9dc' } },
      { id: 'tianditu-base', type: 'raster', source: 'tianditu-base', minzoom: 0, maxzoom: 18 },
      { id: 'tianditu-label', type: 'raster', source: 'tianditu-label', minzoom: 2, maxzoom: 18 },
    ],
  }
}

const VENUE_COLOR = '#b03a2e'
const VENUE_ACTIVE = '#c9a227'
const UPCOMING_COLOR = '#9a9488'

interface TileErrorEvent extends ErrorEvent {
  sourceId?: string
}

function addSourcesAndLayers(map: MapLibreMap) {
  // 四省省界强调
  map.addSource('provinces', { type: 'geojson', data: provinces as unknown as FeatureCollection })
  map.addLayer({
    id: 'provinces-fill',
    type: 'fill',
    source: 'provinces',
    paint: { 'fill-color': '#b03a2e', 'fill-opacity': 0.12 },
  })
  map.addLayer({
    id: 'provinces-line',
    type: 'line',
    source: 'provinces',
    paint: { 'line-color': '#7b241c', 'line-opacity': 0.5, 'line-width': 1.5 },
  })

  // 场馆标记（未实践区域用灰色描边样式）
  const onMapVenues = venues.filter((v) => v.onMap !== false)
  map.addSource('venues', { type: 'geojson', data: venuesFeatureCollection(onMapVenues) })
  map.addLayer({
    id: 'venues-circle',
    type: 'circle',
    source: 'venues',
    paint: {
      'circle-color': ['match', ['get', 'visitStatus'], ['noVenue', 'pending'], UPCOMING_COLOR, VENUE_COLOR],
      'circle-radius': 7,
      'circle-opacity': ['match', ['get', 'visitStatus'], ['noVenue', 'pending'], 0.6, 0.85],
      'circle-stroke-width': 2,
      'circle-stroke-color': '#f7f1e3',
    },
  })

  // 飞线动画图层（轨迹 + 光点）
  map.addSource('fly-trail', { type: 'geojson', data: emptyLineCollection() })
  map.addLayer({
    id: 'fly-trail',
    type: 'line',
    source: 'fly-trail',
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': '#c9a227',
      'line-width': 2.5,
      'line-opacity': 0.85,
    },
  })
  map.addSource('fly-dot', {
    type: 'geojson',
    data: { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [0, 0] } },
  })
  map.addLayer({
    id: 'fly-dot',
    type: 'circle',
    source: 'fly-dot',
    paint: {
      'circle-color': '#7b241c',
      'circle-radius': 6,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#f7f1e3',
    },
  })
}

function MapView() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [tileError, setTileError] = useState(false)
  const { periodKey, map, setMap, setMapReady, setHovered, setPeriod } = useMapState()

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (!tiandituTk && import.meta.env.DEV) {
      console.warn('[MapView] 未配置天地图 tk，底图不可用（本地用 .env.local，生产用 GitHub Secret TIANDITU_TK）')
    }
    if (!tiandituTk) setTileError(true)
    const mapInstance = new MapLibreMap({
      container: el,
      style: buildTiandituStyle(tiandituTk),
      center: [104, 35],
      zoom: 4.5,
      attributionControl: { compact: true },
    })
    setMap(mapInstance)

    const onError = (e: ErrorEvent) => {
      const sourceId = (e as TileErrorEvent).sourceId
      if (sourceId === 'tianditu-base' || sourceId === 'tianditu-label') setTileError(true)
    }
    mapInstance.on('error', onError)

    mapInstance.on('load', () => {
      addSourcesAndLayers(mapInstance)
      setMapReady(true)

      // 初始视野：居中框住全部地图上的场馆（梅园除外）
      const onMapVenues = venues.filter((v) => v.onMap !== false)
      const lngs = onMapVenues.map((v) => v.coords.lng)
      const lats = onMapVenues.map((v) => v.coords.lat)
      mapInstance.fitBounds(
        [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ],
        { padding: 60, maxZoom: 9 },
      )

      const onMove = (e: MapMouseEvent) => {
        const feats = mapInstance.queryRenderedFeatures(e.point, { layers: ['venues-circle'] })
        const id = feats[0]?.properties?.id as string | undefined
        if (id) {
          setHovered({ id, x: e.point.x, y: e.point.y })
          mapInstance.getCanvas().style.cursor = 'pointer'
        } else {
          setHovered(null)
          mapInstance.getCanvas().style.cursor = ''
        }
      }
      const onClick = (e: MapMouseEvent) => {
        const feats = mapInstance.queryRenderedFeatures(e.point, { layers: ['venues-circle'] })
        const id = feats[0]?.properties?.id as string | undefined
        const v = id ? venues.find((x) => x.id === id) : undefined
        if (v) setPeriod(v.periodKey)
      }
      mapInstance.on('mousemove', onMove)
      mapInstance.on('click', onClick)
    })

    return () => {
      mapInstance.remove()
      setMap(null)
      setMapReady(false)
      setTileError(false)
    }
  }, [setMap, setMapReady, setHovered, setPeriod])

  // 时期变化 → 飞行定位 + 高亮标记
  useEffect(() => {
    if (!map || !periodKey) return
    const period = timeline.find((t) => t.key === periodKey)
    const vid = period?.venueIds[0]
    const venue = vid ? venues.find((v) => v.id === vid) : undefined
    if (!venue) return

    map.flyTo({ center: [venue.coords.lng, venue.coords.lat], zoom: 11, duration: 1600 })

    if (map.getLayer('venues-circle')) {
      map.setPaintProperty('venues-circle', 'circle-radius', [
        'case',
        ['==', ['get', 'periodKey'], periodKey],
        13,
        ['match', ['get', 'visitStatus'], ['noVenue', 'pending'], true, false],
        7,
        6,
      ])
      map.setPaintProperty('venues-circle', 'circle-color', [
        'case',
        ['==', ['get', 'periodKey'], periodKey],
        VENUE_ACTIVE,
        ['match', ['get', 'visitStatus'], ['noVenue', 'pending'], true, false],
        UPCOMING_COLOR,
        VENUE_COLOR,
      ])
      map.setPaintProperty('venues-circle', 'circle-opacity', [
        'case',
        ['==', ['get', 'periodKey'], periodKey],
        1,
        ['match', ['get', 'visitStatus'], ['noVenue', 'pending'], true, false],
        0.6,
        0.4,
      ])
    }
  }, [periodKey, map])

  return (
    <>
      <div ref={containerRef} className={styles.container} />
      {tileError && (
        <div className={styles.tileHint} role="status">
          地图底图加载失败：{tiandituTk ? '请检查网络或天地图 key 是否有效' : '未配置天地图 key（VITE_TIANDITU_TK）'}
        </div>
      )}
    </>
  )
}

export default MapView
