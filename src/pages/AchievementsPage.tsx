import { achievements } from '../lib/content'
import MediaCard from '../components/achievements/MediaCard'
import styles from './AchievementsPage.module.css'

function AchievementsPage() {
  return (
    <div className="container">
      <header className={styles.head}>
        <h1 className={styles.title}>成果</h1>
        <p className={styles.desc}>铁军寻脉实践团 · 项目成果展示</p>
      </header>

      <div className={styles.list}>
        {achievements.map((s) => (
          <section key={s.title} className={styles.card}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>{s.title}</h2>
              <p className={styles.cardDesc}>{s.desc}</p>
            </div>
            {s.links.length > 0 ? (
              <div className={styles.grid}>
                {s.links.map((link) => (
                  <MediaCard key={link.url} item={link} />
                ))}
              </div>
            ) : (
              !s.ready && <div className={styles.placeholder}>内容整理中…</div>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}

export default AchievementsPage
