import {useState, useCallback} from 'react'

export const useApiFieldErrors = () => {
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({})

  const getFieldError = useCallback(
    (formikErrors: Record<string, any>, fieldName: string) => {
      return formikErrors[fieldName] || apiErrors[fieldName]
    },
    [apiErrors]
  )

  const clearFieldError = (fieldName: string) => {
    setApiErrors((prev) => {
      const copy = {...prev}
      delete copy[fieldName]
      return copy
    })
  }

  return {
    apiErrors,
    setApiErrors,
    getFieldError,
    clearFieldError,
  }
}
