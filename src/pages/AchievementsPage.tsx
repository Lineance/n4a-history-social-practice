import { achievements } from '../lib/content'
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
            <h2 className={styles.cardTitle}>{s.title}</h2>
            <p className={styles.cardDesc}>{s.desc}</p>
            {s.links.length > 0 && (
              <ul className={styles.links}>
                {s.links.map((link) => (
                  <li key={link.url}>
                    <a className={styles.link} href={link.url} target="_blank" rel="noreferrer">
                      <span className={styles.linkTitle}>{link.title}</span>
                      {link.source && <span className={styles.linkSource}>{link.source}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {!s.ready && <div className={styles.placeholder}>内容整理中…</div>}
          </section>
        ))}
      </div>
    </div>
  )
}

export default AchievementsPage
