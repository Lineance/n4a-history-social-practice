import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

const NAV_ITEMS = [
  { to: '/', label: '首页' },
  { to: '/map', label: '交互地图' },
  { to: '/venues', label: '展馆介绍' },
  { to: '/gallery', label: '调研集锦' },
  { to: '/guestbook', label: '留言板' },
  { to: '/achievements', label: '成果展示' },
]

function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand}>
          <img src="/brand/duihui.png" alt="队徽" className={styles.logo} />
          <span className={styles.brandText}>铁军精神 · 驻地变迁</span>
        </NavLink>
        <nav className={styles.links}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
