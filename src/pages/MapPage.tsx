import { PERIOD_KEYS, type PeriodKey } from '../types/content'
import { MapProvider } from '../hooks/useMapState'
import MapView from '../components/map/MapView'
import InfoCard from '../components/map/InfoCard'
import TimeSlider from '../components/map/TimeSlider'
import VenueSidebar from '../components/map/VenueSidebar'
import FlyLines from '../components/map/FlyLines'
import DanmakuLayer from '../components/map/DanmakuLayer'
import VenueNavButtons from '../components/map/VenueNavButtons'
import styles from './MapPage.module.css'

/** 从 hash 中解析 ?period= 参数（HashRouter 下比 useSearchParams 更可靠） */
export function readPeriodFromHash(): PeriodKey | null {
  if (typeof window === 'undefined') return null
  const m = window.location.hash.match(/[?&]period=([a-z]+)/)
  const raw = m?.[1]
  return raw && PERIOD_KEYS.includes(raw as PeriodKey) ? (raw as PeriodKey) : null
}

function MapLayout() {
  return (
    <div className={styles.page}>
      <div className={styles.mapArea}>
        <MapView />
        <FlyLines />
        <InfoCard />
        <DanmakuLayer />
        <VenueNavButtons />
      </div>
      <VenueSidebar />
      <TimeSlider />
    </div>
  )
}

function MapPage() {
  return (
    <MapProvider initialPeriod={readPeriodFromHash()}>
      <MapLayout />
    </MapProvider>
  )
}

export default MapPage
