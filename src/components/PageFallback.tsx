import styles from './PageFallback.module.css'

function PageFallback() {
  return (
    <div className={styles.fallback} role="status">
      <span className={styles.dots}>
        <i />
        <i />
        <i />
      </span>
      <p>载入中…</p>
    </div>
  )
}

export default PageFallback
