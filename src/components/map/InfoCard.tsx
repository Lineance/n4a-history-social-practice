import { Link } from 'react-router-dom'
import { getVenue } from '../../lib/content'
import VisitBadge from '../venue/VisitBadge'
import { useMapState } from '../../hooks/useMapState'
import styles from './InfoCard.module.css'

const CARD_W = 300

function InfoCard() {
  const { hovered } = useMapState()
  if (!hovered) return null
  const venue = getVenue(hovered.id)
  if (!venue) return null

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440
  const flipX = hovered.x > vw - CARD_W - 40
  const left = flipX ? hovered.x - CARD_W - 18 : hovered.x + 18
  const flipY = hovered.y > 380
  const top = flipY ? hovered.y - 180 : hovered.y + 6

  return (
    <div className={styles.card} style={{ left, top, width: CARD_W }}>
      <img src={venue.cover} alt={venue.name} className={styles.cover} loading="lazy" />
      <div className={styles.body}>
        <h3 className={styles.name}>
          {venue.name}
          <VisitBadge status={venue.visitStatus} compact />
        </h3>
        <p className={styles.meta}>
          {venue.city} · {venue.dates.from} ~ {venue.dates.to}
        </p>
        <div className={styles.tags}>
          {venue.spiritTags.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <Link to={`/venues/${venue.id}`} className={styles.more}>
          查看详情 →
        </Link>
      </div>
    </div>
  )
}

export default InfoCard
