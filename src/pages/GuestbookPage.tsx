import { giscus } from '../config'
import GiscusEmbed from '../components/guestbook/GiscusEmbed'
import styles from './GuestbookPage.module.css'

function GuestbookPage() {
  const ready = Boolean(giscus.repo)

  return (
    <div className="container">
      <header className={styles.head}>
        <h1 className={styles.title}>留言板</h1>
        <p className={styles.desc}>欢迎留下你对铁军精神的感悟。</p>
      </header>

      <div className={styles.body}>
        {ready ? (
          <GiscusEmbed />
        ) : (
          <div className={styles.placeholder}>
            <p className={styles.phTitle}>留言功能筹备中</p>
            <p>团队正在配置评论区（GitHub Discussions），敬请期待。</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GuestbookPage
