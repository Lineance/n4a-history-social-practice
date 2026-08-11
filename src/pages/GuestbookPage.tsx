import { giscus } from '../config'
import MessageWall from '../components/guestbook/MessageWall'
import GiscusEmbed from '../components/guestbook/GiscusEmbed'
import styles from './GuestbookPage.module.css'

function GuestbookPage() {
  const giscusReady = Boolean(giscus.repo)

  return (
    <div className="container">
      <header className={styles.head}>
        <h1 className={styles.title}>留言板</h1>
        <p className={styles.desc}>欢迎留下你对铁军精神的感悟。</p>
      </header>

      <div className={styles.body}>
        <MessageWall />

        {giscusReady && (
          <section className={styles.giscus}>
            <h2 className={styles.sectionTitle}>GitHub 评论区</h2>
            <GiscusEmbed />
          </section>
        )}
      </div>
    </div>
  )
}

export default GuestbookPage
