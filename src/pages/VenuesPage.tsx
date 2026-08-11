import { venues } from '../lib/content'
import VenueCard from '../components/venue/VenueCard'
import styles from './VenuesPage.module.css'

function VenuesPage() {
  return (
    <div className="container">
      <header className={styles.head}>
        <h1 className={styles.title}>展馆介绍</h1>
        <p className={styles.desc}>新四军军部驻地变迁 · 八个展馆的红色印记</p>
      </header>
      <div className={styles.grid}>
        {venues.map((v) => (
          <VenueCard key={v.id} venue={v} />
        ))}
      </div>
    </div>
  )
}

export default VenuesPage
