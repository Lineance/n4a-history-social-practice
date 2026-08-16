import type { AchievementLink, AchievementPlatform } from '../../types/content'
import styles from './MediaCard.module.css'

const PLATFORM_LABEL: Record<AchievementPlatform, string> = {
  wechat: '微信公众号',
  xiaohongshu: '小红书',
  bilibili: '哔哩哔哩',
  douyin: '抖音',
}

/** 视频卡：platform 为 bilibili 且声明了 douyin 字段（可为空串） */
function isVideoCard(item: AchievementLink): boolean {
  return item.platform === 'bilibili' && item.douyin !== undefined
}

function openUrl(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

function MediaCard({ item }: { item: AchievementLink }) {
  const platformLabel = PLATFORM_LABEL[item.platform]
  const video = isVideoCard(item)

  const jump = () => openUrl(item.url)

  return (
    <article
      className={styles.card}
      role="link"
      tabIndex={0}
      aria-label={item.title}
      onClick={jump}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          jump()
        }
      }}
    >
      <div className={styles.coverWrap}>
        {item.image ? (
          <img src={item.image} alt={item.title} className={styles.cover} loading="lazy" />
        ) : (
          <div className={styles.placeholder} aria-hidden>
            <span className={styles.placeholderMark}>{platformLabel}</span>
          </div>
        )}
      </div>

      <h3 className={styles.title}>{item.title}</h3>

      {video ? (
        <div className={styles.actions}>
          <a
            className={`${styles.action} ${styles.actionPrimary}`}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            B站播放
          </a>
          {item.douyin ? (
            <a
              className={`${styles.action} ${styles.actionSecondary}`}
              href={item.douyin}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              抖音
            </a>
          ) : (
            <span className={`${styles.action} ${styles.actionSecondary} ${styles.actionDisabled}`} aria-disabled="true">
              抖音 · 敬请期待
            </span>
          )}
        </div>
      ) : (
        <div className={styles.footer}>
          <span className={styles.more}>查看全文 →</span>
        </div>
      )}
    </article>
  )
}

export default MediaCard
