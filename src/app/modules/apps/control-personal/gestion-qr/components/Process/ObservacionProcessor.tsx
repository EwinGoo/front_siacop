import React from 'react'
import Swal from 'sweetalert2'

export class ObservacionProcessorService {
  static async showObservacionProgress(codigo: string, observacion: string): Promise<void> {
    await Swal.fire({
      title: '<i class="bi bi-exclamation-triangle me-2"></i>Registrando Observación',
      html: `
        <div class="text-center">
          <div class="spinner-border text-warning mb-3" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Procesando...</span>
          </div>
          <p class="text-muted mb-3">
            <strong>Código:</strong> ${codigo}
          </p>
          <p class="text-muted">
            <i class="bi bi-pencil-square me-1"></i>
            Guardando observación en el sistema...
          </p>
        </div>
      `,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: {
        title: 'text-warning fw-bold'
      }
    })
  }

  static async showObservacionSuccess(codigo: string, observacion: string): Promise<void> {
    await Swal.fire({
      icon: 'success',
      title: '<i class="bi bi-check-circle me-2"></i>Observación Registrada',
      html: `
        <div class="text-center">
          <div class="alert alert-warning mb-4">
            <h6 class="alert-heading mb-3">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Comisión Observada
            </h6>
            <hr>
            <div class="row text-start mb-3">
              <div class="col-3 fw-bold">Código:</div>
              <div class="col-9">${codigo}</div>
            </div>
            <div class="row text-start">
              <div class="col-3 fw-bold">Observación:</div>
              <div class="col-9">
                <div class="bg-light p-2 rounded text-start">
                  <small>"${observacion}"</small>
                </div>
              </div>
            </div>
          </div>
          <p class="text-muted mb-0">
            <i class="bi bi-bell me-1"></i>
            El empleado será notificado sobre la observación registrada.
          </p>
        </div>
      `,
      confirmButtonText: '<i class="bi bi-arrow-right me-2"></i>Continuar',
      timer: 4000,
      timerProgressBar: true,
      customClass: {
        confirmButton: 'btn btn-success',
        title: 'text-success fw-bold'
      }
    })
  }
}