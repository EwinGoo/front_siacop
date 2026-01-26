import Swal from 'sweetalert2'
import { Vacacion } from '../../../vacaciones/core/_models'

interface VacacionModalConfig {
  vacacion: Vacacion
  formatToBolivianDate: (date: string, options?: any) => string
}

export interface VacacionActionResponse {
  confirmed: boolean
  action?: 'view' | 'reception' | 'approve' | 'observe'
  observacion?: string
}

export class VacacionModalService {
  private static getStatusColor(estado: string) {
    const colors: Record<string, {background: string; color: string}> = {
      APROBADO: {background: '#e8f5e9', color: '#2e7d32'},
      RECEPCIONADO: {background: '#fff3e0', color: '#f57c00'},
      OBSERVADO: {background: '#ffebee', color: '#c62828'},
      GENERADO: {background: '#e3f2fd', color: '#1565c0'},
    }
    return colors[estado] || {background: '#f5f5f5', color: '#424242'}
  }

  private static getVacacionHtmlContent(
    v: Vacacion,
    formatToBolivianDate: (date: string, options?: any) => string
  ): string {
    return `
      <div class="bg-light p-4 rounded mb-4 text-start">
        <h6 class="text-gray-700 mb-3 fw-semibold">
          <i class="bi bi-person-badge me-2"></i>Información General
        </h6>
        <div class="row mb-2">
          <div class="col-5 fw-bold">ID Solicitud:</div>
          <div class="col-7">${v.id_vacacion_solicitado}</div>
        </div>
        <div class="row mb-2">
          <div class="col-5 fw-bold">Nro. Trámite:</div>
          <div class="col-7">${v.numero_tramite || '<span class="text-muted">Pendiente</span>'}</div>
        </div>
        <div class="row mb-2">
          <div class="col-5 fw-bold">Tipo:</div>
          <div class="col-7"><span class="badge bg-primary">${v.tipo_solicitud}</span></div>
        </div>
      </div>

      <div class="bg-primary bg-opacity-10 p-4 rounded mb-4 text-start">
        <h6 class="text-primary mb-3 fw-semibold">
          <i class="bi bi-calendar-check me-2"></i>Periodo de Vacación
        </h6>
        <div class="row mb-2">
          <div class="col-5 fw-bold">Días Solicitados:</div>
          <div class="col-7"><strong>${v.dias_solicitado} día(s)</strong></div>
        </div>
        <div class="row mb-2">
          <div class="col-5 fw-bold">Desde:</div>
          <div class="col-7">${formatToBolivianDate(v.fecha_vacacion_inicio, {dateStyle: 'long'})}</div>
        </div>
        <div class="row mb-2">
          <div class="col-5 fw-bold">Hasta:</div>
          <div class="col-7">${formatToBolivianDate(v.fecha_vacacion_fin, {dateStyle: 'long'})}</div>
        </div>
        <div class="row mb-2">
          <div class="col-5 fw-bold">Fecha Solicitud:</div>
          <div class="col-7">${formatToBolivianDate(v.fecha_solicitud, {dateStyle: 'medium'})}</div>
        </div>
      </div>

      <div class="bg-info bg-opacity-10 p-4 rounded text-start">
        <div class="row align-items-center">
          <div class="col-4 fw-bold">Estado Actual:</div>
          <div class="col-8">
            <span class="badge fs-7" style="background: ${this.getStatusColor(v.estado_vacacion).background}; color: ${this.getStatusColor(v.estado_vacacion).color};">
              <i class="bi bi-circle-fill me-1" style="font-size: 8px;"></i>
              ${v.estado_vacacion}
            </span>
          </div>
        </div>
      </div>
    `
  }

  static async showVacacionModal(config: VacacionModalConfig): Promise<VacacionActionResponse> {
    const {vacacion, formatToBolivianDate} = config

    const swalConfig: any = {
      title: `<i class="bi bi-file-earmark-text me-2"></i>Detalle de Vacación`,
      html: this.getVacacionHtmlContent(vacacion, formatToBolivianDate),
      width: '550px',
      showCloseButton: true,
      customClass: {
        popup: 'animated fadeIn',
        title: 'text-dark fw-bold border-bottom pb-3',
      },
    }

    switch (vacacion.estado_vacacion) {
      case 'GENERADO':
        return this.handleGeneradoState(swalConfig)
      case 'RECEPCIONADO':
        return this.handleRecepcionadoState(swalConfig, vacacion)
      case 'APROBADO':
      case 'OBSERVADO':
        return this.handleStaticState(swalConfig)
      default:
        return {confirmed: false}
    }
  }

  private static handleGeneradoState(config: any): Promise<VacacionActionResponse> {
    Object.assign(config, {
      icon: 'question',
      confirmButtonText: '<i class="bi bi-check2-square me-2"></i>Recepcionar',
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#198754',
    })

    return Swal.fire(config).then((result) => ({
      confirmed: result.isConfirmed,
      action: result.isConfirmed ? 'reception' : undefined
    }))
  }

  private static handleRecepcionadoState(config: any, v: Vacacion): Promise<VacacionActionResponse> {
    Object.assign(config, {
      icon: 'info',
      showDenyButton: true,
      confirmButtonText: '<i class="bi bi-check-all me-2"></i>Aprobar',
      denyButtonText: '<i class="bi bi-exclamation-triangle me-2"></i>Observar',
      confirmButtonColor: '#198754',
      denyButtonColor: '#dc3545',
    })

    return Swal.fire(config).then(async (result) => {
      if (result.isConfirmed) return {confirmed: true, action: 'approve'}
      if (result.isDenied) return this.handleObservacionModal(v)
      return {confirmed: false}
    })
  }

  private static async handleObservacionModal(v: Vacacion): Promise<VacacionActionResponse> {
    const {value: obs} = await Swal.fire({
      title: 'Registrar Observación',
      input: 'textarea',
      inputPlaceholder: 'Escriba el motivo de la observación...',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      confirmButtonColor: '#dc3545',
      preConfirm: (val) => (!val ? Swal.showValidationMessage('Requerido') : val)
    })
    return obs ? {confirmed: true, action: 'observe', observacion: obs} : {confirmed: false}
  }

  private static handleStaticState(config: any): Promise<VacacionActionResponse> {
    Object.assign(config, { confirmButtonText: 'Cerrar', confirmButtonColor: '#6c757d' })
    return Swal.fire(config).then(() => ({confirmed: false, action: 'view'}))
  }
}