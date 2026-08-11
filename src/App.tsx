import { lazy, Suspense, type ReactNode } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageFallback from './components/PageFallback'
import styles from './App.module.css'

const HomePage = lazy(() => import('./pages/HomePage'))
const MapPage = lazy(() => import('./pages/MapPage'))
const VenueDetailPage = lazy(() => import('./pages/VenueDetailPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const GuestbookPage = lazy(() => import('./pages/GuestbookPage'))
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageFallback />}>{children}</Suspense>
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className={styles.page}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Lazy><HomePage /></Lazy>} />
          <Route path="/map" element={<Lazy><MapPage /></Lazy>} />
          <Route path="/venues/:id" element={<Lazy><VenueDetailPage /></Lazy>} />
          <Route path="/gallery" element={<Lazy><GalleryPage /></Lazy>} />
          <Route path="/guestbook" element={<Lazy><GuestbookPage /></Lazy>} />
          <Route path="/achievements" element={<Lazy><AchievementsPage /></Lazy>} />
          <Route path="*" element={<Lazy><NotFound /></Lazy>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  return (
    <HashRouter>
      <Navbar />
      <main className="page-main">
        <AnimatedRoutes />
      </main>
      <Footer />
    </HashRouter>
  )
}

export default App
