import Lightbox, { type Slide } from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

export interface LightboxProps {
  open: boolean
  onClose: () => void
  slides: Slide[]
  index: number
  setIndex: (i: number) => void
}

function GalleryLightbox({ open, onClose, slides, index, setIndex }: LightboxProps) {
  return (
    <Lightbox
      open={open}
      close={onClose}
      slides={slides}
      index={index}
      on={{ view: ({ index: current }) => setIndex(current) }}
    />
  )
}

export default GalleryLightbox
