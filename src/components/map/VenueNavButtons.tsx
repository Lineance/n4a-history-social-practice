import { venues } from '../../lib/content'
import { useMapState } from '../../hooks/useMapState'
import styles from './VenueNavButtons.module.css'

function VenueNavButtons() {
  const { periodKey, setPeriod } = useMapState()

  const idx = periodKey ? venues.findIndex((v) => v.periodKey === periodKey) : -1
  const last = venues.length - 1

  const goPrev = () => {
    if (idx <= 0) return
    setPeriod(venues[idx - 1].periodKey)
  }
  const goNext = () => {
    if (idx >= last) return
    setPeriod(venues[idx + 1].periodKey)
  }

  const prevLabel = idx > 0 ? `上一个地点：${venues[idx - 1].shortName}` : '上一个地点'
  const nextLabel = idx < last ? `下一个地点：${venues[idx + 1].shortName}` : '下一个地点'

  return (
    <div className={styles.buttons}>
      <button
        type="button"
        className={styles.btn}
        onClick={goPrev}
        disabled={idx <= 0}
        aria-label={prevLabel}
      >
        ← 上一个地点
      </button>
      <button
        type="button"
        className={styles.btn}
        onClick={goNext}
        disabled={idx >= last}
        aria-label={nextLabel}
      >
        下一个地点 →
      </button>
    </div>
  )
}

export default VenueNavButtons
