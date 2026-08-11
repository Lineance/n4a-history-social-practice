import { timeline } from '../../lib/content'
import { useMapState } from '../../hooks/useMapState'
import styles from './TimeSlider.module.css'

function TimeSlider() {
  const { periodKey, setPeriod } = useMapState()

  return (
    <div className={styles.slider}>
      {timeline.map((t, i) => {
        const active = t.key === periodKey
        return (
          <button
            key={t.key}
            type="button"
            className={active ? `${styles.node} ${styles.active}` : styles.node}
            onClick={() => setPeriod(t.key)}
            aria-pressed={active}
          >
            <span className={styles.dot} />
            <span className={styles.sub}>{t.subtitle}</span>
            <span className={styles.years}>
              {i + 1}. {t.dates.from}~{t.dates.to}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default TimeSlider
