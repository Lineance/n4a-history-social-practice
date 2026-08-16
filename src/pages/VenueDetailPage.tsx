import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getEvents, getVenue, timeline } from '../lib/content'
import VisitBadge from '../components/venue/VisitBadge'
import GalleryLightbox from '../components/common/Lightbox'
import styles from './VenueDetailPage.module.css'

function renderParagraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p, i) => <p key={i}>{p}</p>)
}

function VenueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const venue = id ? getVenue(id) : undefined
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!venue) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
        <h1>场馆不存在</h1>
        <p>
          <Link to="/map">返回地图</Link>
        </p>
      </div>
    )
  }

  const events = getEvents(venue.id)
  const period = timeline.find((t) => t.key === venue.periodKey)
  const gallery = venue.images

  return (
    <div className="container">
      <Link to="/map" className={styles.back}>
        ← 返回地图
      </Link>

      <header className={styles.header}>
        <img src={venue.cover} alt={venue.name} className={styles.cover} />
        <div className={styles.headerBody}>
          <div className={styles.titleRow}>
            <h1 className={styles.name}>{venue.name}</h1>
            <VisitBadge status={venue.visitStatus} />
          </div>
          <p className={styles.meta}>
            {venue.city} · {venue.dates.from} ~ {venue.dates.to}
          </p>
          {period && (
            <p className={styles.period}>
              {period.title} · <span className={styles.subtitle}>{period.subtitle}</span>
            </p>
          )}
          <p className={styles.address}>{venue.address}</p>
          {venue.website && (
            <a className={styles.website} href={venue.website} target="_blank" rel="noreferrer">
              访问官网 ↗
            </a>
          )}
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>场馆简介</h2>
        <div className={styles.body}>{renderParagraphs(venue.intro)}</div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>历史事件</h2>
        {events.length === 0 ? (
          <p className={styles.empty}>暂无事件记录。</p>
        ) : (
          <div className={styles.events}>
            {events.map((e) => (
              <div key={e.id} className={styles.event}>
                <div className={styles.eventDate}>{e.date}</div>
                <div className={styles.eventBody}>
                  <h3 className={styles.eventTitle}>{e.title}</h3>
                  {renderParagraphs(e.content)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>铁军精神体现</h2>
        <div className={styles.spiritBox}>
          {period && <p className={styles.spiritNote}>“{period.spiritNote}”</p>}
          <div className={styles.tags}>
            {venue.spiritTags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>照片图集</h2>
          <div className={styles.gallery}>
            {gallery.map((img, i) => (
              <button
                key={img.src}
                type="button"
                className={styles.thumb}
                onClick={() => setLightboxIndex(i)}
                aria-label={img.caption ?? venue.name}
              >
                <img src={img.src} alt={img.caption ?? venue.name} loading="lazy" />
              </button>
            ))}
          </div>
        </section>
      )}

      <GalleryLightbox
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        slides={gallery.map((img) => ({ src: img.src, alt: img.caption }))}
        index={lightboxIndex ?? 0}
        setIndex={(i) => setLightboxIndex(i)}
      />
    </div>
  )
}

export default VenueDetailPage
