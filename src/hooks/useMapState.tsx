import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Map } from 'maplibre-gl'
import type { PeriodKey } from '../types/content'

export interface HoverState {
  id: string
  x: number
  y: number
}

interface MapState {
  periodKey: PeriodKey | null
  setPeriod: (k: PeriodKey | null) => void
  hovered: HoverState | null
  setHovered: (h: HoverState | null) => void
  map: Map | null
  mapReady: boolean
  setMap: (m: Map | null) => void
  setMapReady: (v: boolean) => void
}

const Ctx = createContext<MapState | null>(null)

export function MapProvider({
  children,
  initialPeriod,
}: {
  children: ReactNode
  initialPeriod?: PeriodKey | null
}) {
  const [periodKey, setPeriod] = useState<PeriodKey | null>(initialPeriod ?? null)
  const [hovered, setHovered] = useState<HoverState | null>(null)
  const [map, setMap] = useState<Map | null>(null)
  const [mapReady, setMapReady] = useState(false)

  return (
    <Ctx.Provider
      value={{ periodKey, setPeriod, hovered, setHovered, map, mapReady, setMap, setMapReady }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useMapState(): MapState {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useMapState 必须在 MapProvider 内使用')
  return ctx
}
