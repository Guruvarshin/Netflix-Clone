import { useEffect } from 'react'
import { useLocation } from 'react-router'

const ScrollToTop = ({ behavior = 'smooth' }) => {
  const { pathname, search } = useLocation()

  useEffect(() => {
    // Always jump to top on any route change
    window.scrollTo({ top: 0, left: 0, behavior })
  }, [pathname, search, behavior])

  return null
}

export default ScrollToTop
