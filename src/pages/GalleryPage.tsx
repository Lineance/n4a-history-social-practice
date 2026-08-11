import { useState } from 'react'
import { getVenue, visits } from '../lib/content'
import GalleryLightbox from '../components/common/Lightbox'
import styles from './GalleryPage.module.css'

function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const photos = visits.flatMap((v) => {
    const venue = getVenue(v.venueId)
    return v.images.map((src) => ({ src, label: venue?.name ?? '' }))
  })

  return (
    <div className="container">
      <header className={styles.head}>
        <h1 className={styles.title}>调研集锦</h1>
        <p className={styles.desc}>踏四省红色热土，实地走访新四军军部旧址，用镜头记录铁军足迹。</p>
      </header>

      <div className={styles.wall}>
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            className={styles.item}
            onClick={() => setLightboxIndex(i)}
            aria-label={p.label}
          >
            <img src={p.src} alt={p.label} loading="lazy" />
          </button>
        ))}
      </div>

      <GalleryLightbox
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        slides={photos.map((p) => ({ src: p.src, alt: p.label }))}
        index={lightboxIndex ?? 0}
        setIndex={(i) => setLightboxIndex(i)}
      />
    </div>
  )
}

export default GalleryPage
