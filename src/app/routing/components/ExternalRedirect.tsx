import { useEffect } from 'react'

export const ExternalRedirect = ({ url }: { url: string }) => {
  useEffect(() => {
    window.location.href = url
  }, [url])

  return null
}