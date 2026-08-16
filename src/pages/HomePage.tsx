import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { assetUrl } from '../lib/assets'
import styles from './HomePage.module.css'

const STAGGER = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.1 + i * 0.16, ease: 'easeOut' as const },
  }),
}

function HomePage() {
  const navigate = useNavigate()
  return (
    <section className={styles.hero}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.layout}>
        <motion.div
          className={styles.flag}
          custom={0}
          variants={STAGGER}
          initial="hidden"
          animate="show"
        >
          <img src={assetUrl('/brand/duihui.png')} alt="实践团队徽" className={styles.logo} />
        </motion.div>

        <div className={styles.text}>
          <motion.h1 className={styles.title} custom={1} variants={STAGGER} initial="hidden" animate="show">
            铁军精神 · 驻地变迁
          </motion.h1>
          <motion.p className={styles.subtitle} custom={2} variants={STAGGER} initial="hidden" animate="show">
            踏四省红色热土，传百载铁军薪火
          </motion.p>
          <motion.p className={styles.signature} custom={3} variants={STAGGER} initial="hidden" animate="show">
            铁军寻脉实践团 · 东南大学吴健雄学院
          </motion.p>
          <motion.button
            type="button"
            className={styles.cta}
            onClick={() => navigate('/map')}
            custom={4}
            variants={STAGGER}
            initial="hidden"
            animate="show"
          >
            进入地图 →
          </motion.button>
        </div>
      </div>
      <div className={styles.scrollHint} aria-hidden>
        ↓
      </div>
    </section>
  )
}

export default HomePage
