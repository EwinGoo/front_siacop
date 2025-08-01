import { toast, ToastOptions } from 'react-toastify'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastParams {
  message: string
  type?: ToastType
  options?: ToastOptions
}

export const showToast = ({
  message,
  type = 'info',
  options = {},
}: ToastParams) => {
  const defaultOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    ...options,
  }

  toast[type](message, defaultOptions)
}
