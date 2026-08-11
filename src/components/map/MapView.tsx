import { useEffect, useRef } from 'react'
import {
  Map as MapLibreMap,
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

  // 场馆标记
  map.addSource('venues', { type: 'geojson', data: venuesFeatureCollection(venues) })
  map.addLayer({
    id: 'venues-circle',
    type: 'circle',
    source: 'venues',
    paint: {
      'circle-color': VENUE_COLOR,
      'circle-radius': 7,
      'circle-opacity': 0.85,
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
  const { periodKey, map, setMap, setMapReady, setHovered, setPeriod } = useMapState()

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (!tiandituTk && import.meta.env.DEV) {
      console.warn('[MapView] 未配置天地图 tk，底图不可用（本地用 .env.local，生产用 GitHub Secret TIANDITU_TK）')
    }
    const mapInstance = new MapLibreMap({
      container: el,
      style: buildTiandituStyle(tiandituTk),
      center: [104, 35],
      zoom: 4.5,
      attributionControl: { compact: true },
    })
    setMap(mapInstance)

    mapInstance.on('load', () => {
      addSourcesAndLayers(mapInstance)
      setMapReady(true)

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
        6,
      ])
      map.setPaintProperty('venues-circle', 'circle-color', [
        'case',
        ['==', ['get', 'periodKey'], periodKey],
        VENUE_ACTIVE,
        VENUE_COLOR,
      ])
      map.setPaintProperty('venues-circle', 'circle-opacity', [
        'case',
        ['==', ['get', 'periodKey'], periodKey],
        1,
        0.4,
      ])
    }
  }, [periodKey, map])

  return <div ref={containerRef} className={styles.container} />
}

export default MapView
