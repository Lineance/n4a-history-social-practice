export type PeriodKey =
  | 'hankou'
  | 'nanchang'
  | 'yansi'
  | 'yunling'
  | 'yancheng'
  | 'tingchigang'
  | 'huanghuatang'
  | 'meiyuan'

export const PERIOD_KEYS: PeriodKey[] = [
  'hankou',
  'nanchang',
  'yansi',
  'yunling',
  'yancheng',
  'tingchigang',
  'huanghuatang',
  'meiyuan',
]

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
  isFieldVisited: boolean
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
