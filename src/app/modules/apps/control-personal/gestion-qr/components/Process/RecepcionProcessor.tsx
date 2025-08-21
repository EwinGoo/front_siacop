import React from 'react'
import Swal from 'sweetalert2'
import { TipoPermiso } from '../../types'

export class RecepcionProcessorService {
  static async showRecepcionProgress(codigo: string): Promise<void> {
    await Swal.fire({
      title: '<i class="bi bi-hourglass-split me-2"></i>Procesando Recepción',
      html: `
        <div class="text-center">
          <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Procesando...</span>
          </div>
          <p class="text-muted mb-3">
            <strong>Código:</strong> ${codigo}
          </p>
          <p class="text-muted">
            <i class="bi bi-clock me-1"></i>
            Registrando recepción en el sistema...
          </p>
        </div>
      `,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: {
        title: 'text-primary fw-bold'
      }
    })
  }

  static async showRecepcionSuccess(
    codigo: string, 
    message: string, 
    tipoPermiso: TipoPermiso,
    fechaHora: string
  ): Promise<void> {
    const fecha = new Date(fechaHora)
    const fechaFormateada = fecha.toLocaleDateString('es-BO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    const horaFormateada = fecha.toLocaleTimeString('es-BO')

    await Swal.fire({
      icon: 'success',
      title: '<i class="bi bi-check-circle me-2"></i>¡Recepción Exitosa!',
      html: `
        <div class="text-center">
          <div class="alert alert-success mb-4">
            <h5 class="alert-heading mb-3">
              <i class="bi bi-file-earmark-check me-2"></i>
              Comisión Recepcionada
            </h5>
            <hr>
            <div class="row text-start">
              <div class="col-4 fw-bold">Código:</div>
              <div class="col-8">${codigo}</div>
            </div>
            <div class="row text-start">
              <div class="col-4 fw-bold">Tipo:</div>
              <div class="col-8">
                <span class="badge ${tipoPermiso === 'hora' ? 'bg-info' : 'bg-primary'}">
                  <i class="bi bi-${tipoPermiso === 'hora' ? 'clock' : 'calendar-day'} me-1"></i>
                  ${tipoPermiso === 'hora' ? 'Por Horas' : 'Por Día'}
                </span>
              </div>
            </div>
            <div class="row text-start">
              <div class="col-4 fw-bold">Fecha:</div>
              <div class="col-8">${fechaFormateada}</div>
            </div>
            <div class="row text-start">
              <div class="col-4 fw-bold">Hora:</div>
              <div class="col-8">${horaFormateada}</div>
            </div>
          </div>
          <p class="text-muted mb-0">
            ${message || 'La comisión ha sido recepcionada exitosamente en el sistema'}
          </p>
        </div>
      `,
      confirmButtonText: '<i class="bi bi-arrow-right me-2"></i>Continuar',
      timer: 5000,
      timerProgressBar: true,
      customClass: {
        confirmButton: 'btn btn-success',
        title: 'text-success fw-bold'
      }
    })
  }

  static async showRecepcionError(error: any): Promise<void> {
    let errorTitle = 'Error en la Recepción'
    let errorMessage = 'Ocurrió un error al procesar la solicitud'
    let errorIcon: 'error' | 'warning' = 'error'

    if (error.response?.status === 404) {
      errorTitle = 'Comisión No Encontrada'
      errorMessage = 'La boleta de comisión no fue encontrada en el sistema'
      errorIcon = 'warning'
    } else if (error.response?.data?.validation_errors) {
      errorTitle = 'Error de Validación'
      errorMessage = Object.values(error.response.data.validation_errors).join('<br>')
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }

    await Swal.fire({
      icon: errorIcon,
      title: `<i class="bi bi-exclamation-triangle me-2"></i>${errorTitle}`,
      html: `
        <div class="alert alert-danger">
          <h6 class="alert-heading">
            <i class="bi bi-x-circle me-2"></i>
            Detalles del Error
          </h6>
          <hr>
          <p class="mb-0">${errorMessage}</p>
        </div>
        <small class="text-muted">
          <i class="bi bi-info-circle me-1"></i>
          Si el problema persiste, contacte al administrador del sistema.
        </small>
      `,
      confirmButtonText: '<i class="bi bi-arrow-clockwise me-2"></i>Entendido',
      confirmButtonColor: '#dc3545',
      customClass: {
        confirmButton: 'btn btn-danger',
        title: 'text-danger fw-bold'
      }
    })
  }
}