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
  cancelButtonText = '<i class="bi bi-x me-2"></i>Cancelar',
  confirmButtonColor = '#3085d6',
  cancelButtonColor = '#d33',
}: SwalConfirmOptions) => {
  return await Swal.fire({
    title,
    text,
    html,
    icon,
    showCancelButton: true,
    confirmButtonText: '<i class="bi bi-check me-2"></i>' + confirmButtonText,
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

export const showSuccessModal = async (title: string, text: string, codigo: any): Promise<void> => {
  await Swal.fire({
    icon: 'success',
    title,
    text,
    html: `
        <div style="text-align: center;">
          <p style="font-size: 16px; color: #495057; margin-bottom: 10px;">
            ${text|| 'La comisión ha sido recepcionada exitosamente'}
          </p>
          <p style="font-size: 14px; color: #6c757d;">
            <strong>Código:</strong> ${codigo}
          </p>
        </div>
    `,
    confirmButtonText: '<i class="bi bi-check me-2"></i>Entendido',
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      confirmButton: 'btn btn-success',
    },
  })
}

export const showErrorModal = async (title: string, text: string): Promise<void> => {
  await Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: '<i class="bi bi-check me-2"></i>Entendido',
    customClass: {
      confirmButton: 'btn btn-success',
    },
  })
}

export const showIngresoManualModal = async () => {
  const {value: codigo} = await Swal.fire({
    title: 'Ingreso Manual de Código',
    input: 'text',
    inputLabel: 'Código de la comisión',
    inputPlaceholder: 'Ingrese el código...',
    showCancelButton: true,
    confirmButtonText: '<i class="las la-search fs-5 me-2"></i> Buscar',
    cancelButtonText: '<i class="bi bi-x fs-5 me-2"></i>Cancelar',
    reverseButtons: true,
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-danger',
    },
    inputValidator: (value) => {
      if (!value) {
        return 'Debe ingresar un código'
      }
      if (!/^\d+$/.test(value)) {
        return 'El código debe ser un número entero positivo'
      }
    },
  })
  return codigo ? parseInt(codigo, 10) : undefined
}
