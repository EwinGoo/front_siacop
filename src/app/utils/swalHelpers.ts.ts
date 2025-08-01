import Swal from 'sweetalert2'

interface SwalOptions {
  title: string
  text: string
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question'
  confirmButtonText?: string
  confirmButtonColor?: string
}

interface SwalConfirmOptions {
  title: string
  text?: string
  html?: string
  icon?: 'question' | 'warning'
  confirmButtonText?: string
  cancelButtonText?: string
  confirmButtonColor?: string
  cancelButtonColor?: string
}

export const showAlert = ({
  title,
  text,
  icon = 'info',
  confirmButtonText = 'Entendido',
  confirmButtonColor = '#3085d6',
}: SwalOptions) => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonColor,
    confirmButtonText,
    customClass: {
      confirmButton: 'btn btn-primary',
    },
  })
}

export const showConfirmDialog = async ({
  title,
  text,
  html,
  icon = 'question',
  confirmButtonText = 'Sí',
  cancelButtonText = 'Cancelar',
  confirmButtonColor = '#3085d6',
  cancelButtonColor = '#d33',
}: SwalConfirmOptions) => {
  return await Swal.fire({
    title,
    text,
    html,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor,
    cancelButtonColor,
    reverseButtons: true,
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-danger',
    },
  })
}
