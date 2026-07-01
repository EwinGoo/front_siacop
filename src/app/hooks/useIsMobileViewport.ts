import {useEffect, useState} from 'react'

const useIsMobileViewport = (breakpoint = 992) => {
  const getMatches = () => (typeof window !== 'undefined' ? window.innerWidth < breakpoint : false)
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(getMatches)

  useEffect(() => {
    const handleResize = () => setIsMobileViewport(getMatches())

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])

  return isMobileViewport
}

export default useIsMobileViewport
