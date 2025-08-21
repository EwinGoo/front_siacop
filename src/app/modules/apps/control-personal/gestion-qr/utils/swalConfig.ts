import Swal from 'sweetalert2'

export const showIngresoManualModal = async (): Promise<string | null> => {
  const { value: codigo } = await Swal.fire({
    title: '<i class="bi bi-keyboard me-2"></i>Ingreso Manual de Código',
    html: `
      <div class="text-start">
        <label for="codigoInput" class="form-label fw-bold">Código de la comisión</label>
        <input 
          type="text" 
          id="codigoInput"
          class="form-control form-control-lg"
          placeholder="Ej: 12345"
          style="font-size: 1.2rem; text-align: center; letter-spacing: 2px;"
        />
        <small class="text-muted mt-2 d-block">
          <i class="bi bi-info-circle me-1"></i>
          Ingrese el código numérico de la comisión
        </small>
      </div>
    `,
    input: 'text',
    inputLabel: '',
    inputPlaceholder: '',
    showCancelButton: true,
    confirmButtonText: '<i class="bi bi-search me-2"></i>Buscar Comisión',
    cancelButtonText: '<i class="bi bi-x-circle me-2"></i>Cancelar',
    reverseButtons: true,
    width: '500px',
    customClass: {
      confirmButton: 'btn btn-primary btn-lg',
      cancelButton: 'btn btn-secondary',
      title: 'text-primary fw-bold',
      input: 'd-none' // Ocultar el input por defecto de Swal
    },
    didOpen: () => {
      // Enfocar el input personalizado
      const customInput = document.getElementById('codigoInput') as HTMLInputElement
      if (customInput) {
        customInput.focus()
        // Permitir envío con Enter
        customInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            Swal.clickConfirm()
          }
        })
      }
    },
    preConfirm: () => {
      const customInput = document.getElementById('codigoInput') as HTMLInputElement
      const value = customInput?.value || ''
      
      if (!value) {
        Swal.showValidationMessage('Debe ingresar un código')
        return false
      }
      if (!/^\d+$/.test(value)) {
        Swal.showValidationMessage('El código debe ser un número entero positivo')
        return false
      }
      if (value.length < 1 || value.length > 10) {
        Swal.showValidationMessage('El código debe tener entre 1 y 10 dígitos')
        return false
      }
      return value
    }
  })

  return codigo || null
}

export const showErrorModal = async (title: string, message: string) => {
  return await Swal.fire({
    icon: 'error',
    title: `<i class="bi bi-exclamation-triangle me-2"></i>${title}`,
    html: `
      <div class="alert alert-danger">
        <p class="mb-0">${message}</p>
      </div>
    `,
    confirmButtonText: '<i class="bi bi-arrow-clockwise me-2"></i>Entendido',
    confirmButtonColor: '#dc3545',
    customClass: {
      confirmButton: 'btn btn-danger',
      title: 'text-danger fw-bold'
    }
  })
}

export const showSuccessModal = async (title: string, message: string) => {
  return await Swal.fire({
    icon: 'success',
    title: `<i class="bi bi-check-circle me-2"></i>${title}`,
    html: `
      <div class="alert alert-success">
        <p class="mb-0">${message}</p>
      </div>
    `,
    confirmButtonText: '<i class="bi bi-arrow-right me-2"></i>Continuar',
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      confirmButton: 'btn btn-success',
      title: 'text-success fw-bold'
    }
  })
}