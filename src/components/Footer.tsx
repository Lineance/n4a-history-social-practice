import { venues } from '../lib/content'
import styles from './Footer.module.css'

function Footer() {
  const sites = venues.filter((v) => v.website)
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <p className={styles.title}>铁军寻脉实践团</p>
          <p className={styles.sub}>东南大学吴健雄学院 · 暑期社会实践</p>
        </div>
        {sites.length > 0 && (
          <div>
            <p className={styles.heading}>场馆官网</p>
            <ul className={styles.links}>
              {sites.map((v) => (
                <li key={v.id}>
                  <a href={v.website} target="_blank" rel="noreferrer">
                    {v.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <p className={styles.copy}>© 2026 铁军寻脉实践团 · 仅供学习与展示使用</p>
    </footer>
  )
}

export default Footer
