import styles from './AchievementsPage.module.css'

const SECTIONS = [
  { title: '实践概况', desc: '铁军寻脉实践团 · 东南大学吴健雄学院暑期社会实践', ready: true },
  { title: '调研报告', desc: '社会实践调研报告（整理中）', ready: false },
  { title: '立项答辩', desc: '立项答辩 PPT', ready: false },
  { title: '实践记录', desc: '调研过程图文 / 视频', ready: false },
  { title: '团队成员', desc: '团队分工与成员介绍', ready: false },
]

function AchievementsPage() {
  return (
    <div className="container">
      <header className={styles.head}>
        <h1 className={styles.title}>成果</h1>
        <p className={styles.desc}>铁军寻脉实践团 · 项目成果展示</p>
      </header>

      <div className={styles.list}>
        {SECTIONS.map((s) => (
          <section key={s.title} className={styles.card}>
            <h2 className={styles.cardTitle}>{s.title}</h2>
            <p className={styles.cardDesc}>{s.desc}</p>
            {!s.ready && <div className={styles.placeholder}>内容整理中…</div>}
          </section>
        ))}
      </div>
    </div>
  )
}

export default AchievementsPage
