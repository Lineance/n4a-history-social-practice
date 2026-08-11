import { useState } from 'react'
import { allMessageTexts } from '../../lib/localMessages'
import styles from './DanmakuLayer.module.css'

const ITEM_COUNT = 6
const TOP_POSITIONS = ['8%', '18%', '30%', '42%', '55%', '68%']
const DELAYS = [0, 2.5, 5, 7.5, 10, 12.5]

function DanmakuLayer() {
  const [on, setOn] = useState(false)

  if (!on) {
    return (
      <button type="button" className={styles.toggle} onClick={() => setOn(true)}>
        弹幕
      </button>
    )
  }

  // 开启时读取最新文案（预置 + 本地留言），新留言也会进入弹幕
  const texts = allMessageTexts()
  const items = texts.length
    ? Array.from({ length: ITEM_COUNT }, (_, i) => ({
        text: texts[i % texts.length],
        top: TOP_POSITIONS[i % TOP_POSITIONS.length],
        delay: DELAYS[i % DELAYS.length],
        duration: 13 + (i % 3) * 2,
      }))
    : []

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
