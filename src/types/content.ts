export type PeriodKey =
  | 'hankou'
  | 'nanchang'
  | 'yansi'
  | 'macun'
  | 'tutang'
  | 'yunling'
  | 'yancheng'
  | 'tingchigang'
  | 'huanghuatang'
  | 'qiangeliou'
  | 'huaiyin'
  | 'linyi'
  | 'meiyuan'

export const PERIOD_KEYS: PeriodKey[] = [
  'hankou',
  'nanchang',
  'yansi',
  'macun',
  'tutang',
  'yunling',
  'yancheng',
  'tingchigang',
  'huanghuatang',
  'qiangeliou',
  'huaiyin',
  'linyi',
  'meiyuan',
]

/** 实践状态：线下 / 线上 / 旧址无馆 / 后续实践 */
export type VisitStatus = 'offline' | 'online' | 'noVenue' | 'pending'

export const VISIT_STATUSES: VisitStatus[] = ['offline', 'online', 'noVenue', 'pending']

export interface Coords {
  lat: number
  lng: number
}

export interface DateRange {
  from: string
  to: string
}

export type ImageSource = 'field' | 'official' | 'public'

export interface VenueImage {
  src: string
  caption?: string
  source: ImageSource
}

export interface Venue {
  id: string
  cover: string
  name: string
  shortName: string
  city: string
  coords: Coords
  periodKey: PeriodKey
  dates: DateRange
  address: string
  spiritTags: string[]
  website?: string
  visitStatus: VisitStatus
  /** 是否在地图上打点（梅园等政治延续阶段可为 false） */
  onMap?: boolean
  displayOrder: number
  images: VenueImage[]
  intro: string
}

export interface TimelinePeriod {
  key: PeriodKey
  title: string
  subtitle: string
  dates: DateRange
  venueIds: string[]
  summary: string
  spiritNote: string
  accentColor?: string
}

export interface HistoricalEvent {
  id: string
  venueId: string
  date: string
  title: string
  content: string
}

export interface VisitRecord {
  id: string
  venueId: string
  date: string
  location: string
  images: string[]
  notes: string
}

export type AchievementPlatform = 'wechat' | 'xiaohongshu' | 'bilibili' | 'douyin'

export const ACHIEVEMENT_PLATFORMS: AchievementPlatform[] = [
  'wechat',
  'xiaohongshu',
  'bilibili',
  'douyin',
]

export interface AchievementLink {
  title: string
  url: string
  platform: AchievementPlatform
  image?: string
  /** 视频第二平台（抖音）链接；空字符串表示待发布 */
  douyin?: string
}

export interface AchievementSection {
  title: string
  desc: string
  ready: boolean
  links: AchievementLink[]
}
