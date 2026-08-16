import type { VisitStatus } from '../../types/content'
import styles from './VisitBadge.module.css'

const LABEL: Record<VisitStatus, string> = {
  offline: '线下实践',
  online: '线上实践',
  upcoming: '敬请期待',
}

function VisitBadge({
  status,
  compact = false,
  className,
}: {
  status: VisitStatus
  compact?: boolean
  className?: string
}) {
  const cls = [styles.badge, styles[status], compact ? styles.compact : '', className ?? '']
    .filter(Boolean)
    .join(' ')
  return <span className={cls}>{LABEL[status]}</span>
}

export default VisitBadge
