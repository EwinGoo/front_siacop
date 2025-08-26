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
            ${text || 'La comisión ha sido recepcionada exitosamente'}
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
    inputLabel: 'Código de la solicitud',
    inputPlaceholder: 'Ingrese el código...',
    showCancelButton: true,
    confirmButtonText: '<i class="las la-search fs-5 me-2"></i> Buscar',
    cancelButtonText: '<i class="bi bi-x fs-5 me-2"></i>Cancelar',
    reverseButtons: true,
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-danger',
    },
    didOpen: () => {
      const input = Swal.getInput() as HTMLInputElement
      if (input) {
        // Forzar mayúsculas en tiempo real
        const handleInput = (e: Event) => {
          const target = e.target as HTMLInputElement
          const cursorPosition = target.selectionStart
          target.value = target.value.toUpperCase()
          target.setSelectionRange(cursorPosition, cursorPosition)
        }

        input.addEventListener('input', handleInput)
        input.addEventListener('paste', (e) => {
          setTimeout(() => handleInput(e), 0)
        })

        // Establecer foco y mostrar placeholder
        input.focus()
      }
    },
    inputValidator: (value) => {
      if (!value) {
        return 'Debe ingresar un código'
      }
      // if (!/^\d+$/.test(value)) {
      //   return 'El código debe ser un número entero positivo'
      // }
      if (!/^[CP]\d+$/.test(value)) {
        return 'El código debe empezar con C o P seguido de números (ej: C23, P456)'
      }
      if (value.length < 2 || value.length > 11) {
        return 'El código debe tener entre 2 y 11 caracteres (ej: C1 hasta P1234567890)'
      }

      if (!/^[A-Za-z0-9]+$/.test(value)) {
        return 'El código debe ser alfanumérico (solo letras y números, ej: ABC123, X1Y2Z3)'
      }
    },
  })
  return codigo ? codigo : undefined
}
