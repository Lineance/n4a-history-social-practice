import { Link } from 'react-router-dom'
import type { Venue } from '../../types/content'
import { timeline } from '../../lib/content'
import VisitBadge from './VisitBadge'
import styles from './VenueCard.module.css'

function VenueCard({ venue }: { venue: Venue }) {
  const period = timeline.find((t) => t.key === venue.periodKey)

  return (
    <Link to={`/venues/${venue.id}`} className={styles.card}>
      <div className={styles.coverWrap}>
        <img src={venue.cover} alt={venue.name} className={styles.cover} loading="lazy" />
        <VisitBadge status={venue.visitStatus} className={styles.seal} />
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{venue.name}</h3>
        <p className={styles.meta}>
          {venue.city} · {venue.dates.from} ~ {venue.dates.to}
        </p>
        {period && (
          <p className={styles.period}>
            {period.title} · <span className={styles.subtitle}>{period.subtitle}</span>
          </p>
        )}
        <p className={styles.snippet}>{venue.intro.split('\n')[0]}</p>
        <div className={styles.footer}>
          <div className={styles.tags}>
            {venue.spiritTags.slice(0, 3).map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
          <span className={styles.more}>查看详情 →</span>
        </div>
      </div>
    </Link>
  )
}

export default VenueCard
