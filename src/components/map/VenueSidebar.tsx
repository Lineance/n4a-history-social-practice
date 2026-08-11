import { Link } from 'react-router-dom'
import { timeline, venues } from '../../lib/content'
import { useMapState } from '../../hooks/useMapState'
import styles from './VenueSidebar.module.css'

function VenueSidebar() {
  const { periodKey, setPeriod, setHovered } = useMapState()
  const period = timeline.find((t) => t.key === periodKey)
  const venue = period ? venues.find((v) => v.id === period.venueIds[0]) : undefined

  return (
    <aside className={styles.sidebar}>
      <div className={styles.summary}>
        {period && venue ? (
          <>
            {venue.cover && (
              <img src={venue.cover} alt={venue.name} className={styles.summaryCover} loading="lazy" />
            )}
            <h3 className={styles.periodTitle}>
              {period.title} · <span className={styles.subtitle}>{period.subtitle}</span>
            </h3>
            <p className={styles.summaryText}>{period.summary}</p>
            <p className={styles.spirit}>精神：{period.spiritNote}</p>
          </>
        ) : (
          <>
            <h3 className={styles.periodTitle}>华中四省 · 铁军足迹</h3>
            <p className={styles.summaryText}>从时间轴或地图标记选择一个时期，查看对应场馆详情。</p>
          </>
        )}
      </div>

      <ul className={styles.list}>
        {venues.map((v) => (
          <li key={v.id}>
            <button
              type="button"
              className={styles.item}
              onClick={() => {
                setPeriod(v.periodKey)
                setHovered(null)
              }}
            >
              <span className={styles.itemName}>
                {v.shortName}
                {v.isFieldVisited && <span className={styles.badge}>实地</span>}
              </span>
              <span className={styles.itemMeta}>{v.city}</span>
              <Link
                to={`/venues/${v.id}`}
                className={styles.itemLink}
                onClick={(e) => e.stopPropagation()}
              >
                详情 →
              </Link>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default VenueSidebar
