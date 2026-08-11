import { useMemo, useState } from 'react'
import { testimonialTexts } from '../../lib/content'
import styles from './DanmakuLayer.module.css'

const ITEM_COUNT = 6
const TOP_POSITIONS = ['8%', '18%', '30%', '42%', '55%', '68%']
const DELAYS = [0, 2.5, 5, 7.5, 10, 12.5]

function DanmakuLayer() {
  const [on, setOn] = useState(false)

  const items = useMemo(() => {
    if (testimonialTexts.length === 0) return []
    return Array.from({ length: ITEM_COUNT }, (_, i) => ({
      text: testimonialTexts[i % testimonialTexts.length],
      top: TOP_POSITIONS[i % TOP_POSITIONS.length],
      delay: DELAYS[i % DELAYS.length],
      duration: 13 + (i % 3) * 2,
    }))
  }, [])

  if (!on) {
    return (
      <button type="button" className={styles.toggle} onClick={() => setOn(true)}>
        弹幕
      </button>
    )
  }

  return (
    <>
      <button type="button" className={styles.toggle} onClick={() => setOn(false)}>
        关闭弹幕
      </button>
      <div className={styles.layer} aria-hidden>
        {items.map((it, i) => (
          <span
            key={i}
            className={styles.item}
            style={{
              top: it.top,
              animationDelay: `${it.delay}s`,
              animationDuration: `${it.duration}s`,
            }}
          >
            {it.text}
          </span>
        ))}
      </div>
    </>
  )
}

export default DanmakuLayer
