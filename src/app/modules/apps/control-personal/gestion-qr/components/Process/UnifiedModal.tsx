import Swal from 'sweetalert2'
import {ComisionActionResponse, estadoStyles, UnifiedData} from '../../types'
import {DataAdapter} from '../../services/dataAdapter'
import {DeviceDetector} from 'src/app/utils/DeviceDetectop'

interface UnifiedModalConfig {
  data: UnifiedData
  formatToBolivianDate: (date: string, options?: any) => string
}

export class UnifiedModalService {
  private static getStatusColor(estado: string) {
    const colors: Record<string, {background: string; color: string}> = {
      APROBADO: {background: '#e8f5e9', color: '#2e7d32'},
      RECEPCIONADO: {background: '#fff3e0', color: '#f57c00'},
      OBSERVADO: {background: '#ffebee', color: '#c62828'},
      GENERADO: {background: '#e3f2fd', color: '#1565c0'},
      ENVIADO: {background: '#e3f2fd', color: '#1565c0'},
    }
    return colors[estado] || {background: '#f5f5f5', color: '#424242'}
  }

  private static getUnifiedHtmlContent(
    data: UnifiedData,
    formatToBolivianDate: (date: string, options?: any) => string
  ): string {
    const displayInfo = DataAdapter.getDisplayInfo(data)
    const color = estadoStyles[data.estado] || 'light'
    const isMobile = DeviceDetector.isMobile()
    const tipePersonalStyle = isMobile ? 'padding: 0 0 0 10px' : ''

    return `
      <div class="bg-light p-4 rounded mb-4">
        <h6 class="text-gray-700 mb-3 fw-semibold">
          <i class="bi bi-person-badge me-2"></i>Información del Empleado
        </h6>
        <div class="row mb-2 text-start">
          <div class="col-3 fw-bold">Nombre</div>
          <div class="col-9">: ${data.nombre_generador}</div>
        </div>
        ${
          data.ci
            ? `
        <div class="row mb-2 text-start">
          <div class="col-3 fw-bold">CI</div>
          <div class="col-9">: ${data.ci}</div>
        </div>
        `
            : ''
        }
        ${
          data.nombre_cargo
            ? `
        <div class="row mb-2 text-start">
          <div class="col-3 fw-bold">Cargo</div>
          <div class="col-9">: ${data.nombre_cargo}</div>
        </div>
        `
            : ''
        }
        ${
          data.tipo_personal
            ? `
        <div class="row mb-2 text-start">
          <div class="col-3 fw-bold" style='${tipePersonalStyle}'>Tipo Personal</div>
          <div class="col-9">: ${data.tipo_personal}</div>
        </div>
        `
            : ''
        }
        ${
          data.unidad
            ? `
        <div class="row mb-2 text-start">
          <div class="col-3 fw-bold">Unidad:</div>
          <div class="col-9">: ${data.unidad}</div>
        </div>
        `
            : ''
        }
      </div>

      <div class="bg-${displayInfo.color} bg-opacity-10 p-4 rounded mb-4">
        <h6 class="text-${displayInfo.color} mb-3 fw-semibold">
          <i class="${displayInfo.icono} me-2"></i>Detalles de la Solicitud
        </h6>
        <div class="row mb-2 text-start">
          <div class="col-3 fw-bold">Código</div>
          <div class="col-9">: ${data.codigo}</div>
        </div>
        ${
          data.tipo_permiso_nombre
            ? `
        <div class="row mb-2 text-start">
          <div class="col-3 fw-bold">Tipo</div>
          <div class="col-9">: 
            <span class="badge badge-md bg-primary">${data.tipo_permiso_nombre}</span>
          </div>
        </div>
        `
            : ''
        }
        <div class="row mb-2 text-start">
          <div class="col-3 fw-bold">Fecha ${data.fecha_fin ? 'inicio' : ''}</div>
          <div class="col-9">: ${formatToBolivianDate(data.fecha_inicio, {dateStyle: 'full'})}</div>
        </div>
        ${
          data.fecha_fin
            ? `
        <div class="row mb-2 text-start">
          <div class="col-3 fw-bold">Fecha fin</div>
          <div class="col-9">: ${formatToBolivianDate(data.fecha_fin, {dateStyle: 'full'})}</div>
        </div>
        `
            : ''
        }
        ${
          data.turno_permiso
            ? `
        <div class="row mb-2 text-start">
          <div class="col-3 fw-bold">Turno</div>
          <div class="col-9">: 
            <span class="badge bg-secondary">${data.turno_permiso}</span>
          </div>
        </div>
        `
            : ''
        }
        ${
          data.hora
            ? `
        <div class="row mb-2 text-start">
          <div class="col-3 fw-bold">Hora</div>
          <div class="col-9">: 
            <span class="badge bg-secondary">${data.hora}</span>
          </div>
        </div>
        `
            : ''
        }
        ${
          data.recorrido_de
            ? `
        <div class="row mb-2 text-start">
          <div class="col-3 fw-bold">De</div>
          <div class="col-9">: ${data.recorrido_de}</div>
        </div>
        `
            : ''
        }
        ${
          data.recorrido_a
            ? `
        <div class="row mb-2 text-start">
          <div class="col-3 fw-bold">A</div>
          <div class="col-9">: ${data.recorrido_a}</div>
        </div>
        `
            : ''
        }
        
            
        ${
          data.descripcion
            ? `
        <div class="row mb-2 text-start">
          <div class="col-3 fw-bold">${!isMobile ? 'Descripción' : 'Desc.'}</div>
          <div class="col-9">: ${data.descripcion}</div>
        </div>`
            : ''
        }
         ${
           !isMobile && data.observacion && data.estado === 'RECEPCIONADO'
             ? ` <div class="row mb-2 text-start">
              <div class="col-3 fw-bold">Observación</div>
              <div class="col-9">: ${data.observacion}</div>
            </div>
           `
             : ''
         }
        <div class="row mb-2 text-start">
          <div class="col-3 fw-bold">Estado</div>
          <div class="col-9">: 
            <span class="badge badge-light-${color} fs-7">
                <i class="bi bi-circle-fill me-1 fs-6 text-secondary"></i>
              ${data.estado}
            </span>
          </div>
        </div>
      </div>
    `
  }

  // <span class="badge bange-light-pry fs-7" style="background: ${
  //           this.getStatusColor(data.estado).background
  //         }; color: ${this.getStatusColor(data.estado).color};">
  //           <i class="bi bi-circle-fill me-1" style="font-size: 8px;"></i>
  //           ${data.estado}
  //         </span>

  static async showUnifiedModal(config: UnifiedModalConfig): Promise<ComisionActionResponse> {
    const {data, formatToBolivianDate} = config
    const displayInfo = DataAdapter.getDisplayInfo(data)

    const swalConfig: any = {
      title: `<div class="text-uppercase"><h3 class="text-${displayInfo.color} fw-bold"><i class="${
        displayInfo.icono
      } me-2"></i>${displayInfo.titulo}</h3><h4>${displayInfo.subtitulo}</h4>${
        data.nro_correlativo ? `<h6>N° CORRELATIVO.: ${data.nro_correlativo}</h6>` : ''
      }</div>`,
      html: this.getUnifiedHtmlContent(data, formatToBolivianDate),
      icon: 'info',
      width: '600px',
      showCloseButton: true,
      customClass: {
        popup: 'animated fadeInDown',
        title: `text-${displayInfo.color} fw-bold`,
      },
    }

    // Usar la misma lógica de estados pero con el estado normalizado
    const estadoNormalizado = DataAdapter.getEstadoNormalizado(data)

    switch (estadoNormalizado) {
      case 'APROBADO':
        return this.handleAprobadoState(swalConfig)
      case 'GENERADO':
      case 'ENVIADO':
        return this.handleGeneradoState(swalConfig, data) // ← Ahora pasa UnifiedData
      case 'RECEPCIONADO':
        return this.handleRecepcionadoState(swalConfig, data) // ← Ahora pasa UnifiedData
      case 'OBSERVADO':
        return this.handleObservadoState(swalConfig)
      default:
        return this.handleDefaultState(swalConfig)
    }
  }

  // HANDLERS ACTUALIZADOS PARA UNIFIED DATA

  private static handleAprobadoState(config: any): Promise<ComisionActionResponse> {
    Object.assign(config, {
      icon: 'success',
      showConfirmButton: true,
      showCancelButton: false,
      confirmButtonText: '<i class="bi bi-eye me-2"></i>Visto',
      confirmButtonColor: '#198754',
      customClass: {
        ...config.customClass,
        confirmButton: 'btn btn-success',
      },
    })
    return Swal.fire(config).then((result) => ({
      confirmed: result.isConfirmed,
      action: 'view',
    }))
  }

  private static handleGeneradoState(
    config: any,
    data: UnifiedData
  ): Promise<ComisionActionResponse> {
    const documentType = data.tipo_documento === 'permiso' ? 'Permiso' : 'Comisión'

    Object.assign(config, {
      icon: 'question',
      confirmButtonText: `<i class="bi bi-check-circle me-2"></i>Recepcionar ${documentType}`,
      confirmButtonColor: '#198754',
      reverseButtons: true,
      customClass: {
        ...config.customClass,
        confirmButton: 'btn btn-success',
      },
    })

    return Swal.fire(config).then((result) => {
      if (result.isConfirmed) {
        return {confirmed: true, action: 'reception'}
      }
      return {confirmed: false}
    })
  }

  private static handleRecepcionadoState(
    config: any,
    data: UnifiedData
  ): Promise<ComisionActionResponse> {
    const documentType = data.tipo_documento === 'permiso' ? 'Permiso' : 'Comisión'
    const isMobile = DeviceDetector.isMobile()
    const type = !isMobile ? documentType : ''
    Object.assign(config, {
      icon: 'warning',
      showCancelButton: false,
      showDenyButton: true,
      confirmButtonText: `<i class="bi bi-check-circle me-2"></i>Aprobar ${type}`,
      denyButtonText: `<i class="bi bi-exclamation-triangle me-2"></i>Observar ${type}`,
      confirmButtonColor: '#198754',
      denyButtonColor: '#dc3545',
      reverseButtons: true,
      customClass: {
        ...config.customClass,
        confirmButton: 'btn btn-success',
        denyButton: 'btn btn-danger',
      },
    })

    return Swal.fire(config).then(async (result) => {
      if (result.isConfirmed) {
        return {confirmed: true, action: 'approve'}
      } else if (result.isDenied) {
        return this.handleObservacionModal(data)
      }
      return {confirmed: false}
    })
  }

  private static handleObservadoState(config: any): Promise<ComisionActionResponse> {
    Object.assign(config, {
      icon: 'success',
      showConfirmButton: true,
      showCancelButton: false,
      confirmButtonText: '<i class="bi bi-eye me-2"></i>Visto',
      confirmButtonColor: '#dc3545',
      customClass: {
        ...config.customClass,
        confirmButton: 'btn btn-danger',
      },
    })
    return Swal.fire(config).then((result) => ({
      confirmed: result.isConfirmed,
      action: 'view',
    }))
  }

  private static handleDefaultState(config: any): Promise<ComisionActionResponse> {
    Object.assign(config, {
      showConfirmButton: true,
      confirmButtonText: '<i class="bi bi-x-circle me-2"></i>Cerrar',
      confirmButtonColor: '#6c757d',
      customClass: {
        ...config.customClass,
        confirmButton: 'btn btn-secondary',
      },
    })
    return Swal.fire(config).then(() => ({confirmed: false}))
  }

  // MODAL DE OBSERVACIÓN ACTUALIZADO PARA UNIFIED DATA
  private static async handleObservacionModal(data: UnifiedData): Promise<ComisionActionResponse> {
    const displayInfo = DataAdapter.getDisplayInfo(data)
    const documentType = data.tipo_documento === 'permiso' ? 'Permiso' : 'Comisión'

    const {value: formValues} = await Swal.fire({
      title: `<i class="bi bi-exclamation-triangle me-2 text-warning"></i>Registrar Observación - ${documentType}`,
      html: `
        <div style="text-align: left;">
          <div class="alert alert-warning">
            <div class="row">
              <div class="col-12">
                <strong><i class="${
                  displayInfo.icono
                } me-2 text-warning"></i>Código ${documentType}: </strong>${data.codigo}
              </div>
               <div class="col-8 mt-md-3">
                  <strong><i class="bi bi-person me-2 text-warning"></i>Empleado: </strong>${
                    data.nombre_generador
                  }
              </div>
               <div class="col-4 mt-md-3">
                <strong><i class="bi bi-card-text me-2 text-warning"></i>CI: </strong>${data.ci}
              </div>
            </div>
            ${
              data.tipo_permiso
                ? `
                <div class="row mt-2">
                  <div class="col-12">
                    <strong><i class="bi bi-tag me-2 text-warning"></i>Tipo:</strong> ${data.tipo_permiso}
                  </div>
                </div>
                `
                : ''
            }
          </div>
          <label for="observacion" class="form-label fw-bold">Motivos de la observación:</label>
          <textarea 
            id="observacion" 
            class="form-control" 
            placeholder="Describa detalladamente los motivos de la observación..." 
            required 
            style="min-height: 120px; resize: vertical;"
            rows="4"
          ></textarea>
          <small class="text-muted mt-2 d-block">
            <i class="bi bi-info-circle me-1"></i>
            La observación será registrada en el sistema y notificada al empleado.
          </small>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '<i class="bi bi-send me-2"></i>Registrar Observación',
      cancelButtonText: '<i class="bi bi-x-circle me-2"></i>Cancelar',
      width: '650px',
      reverseButtons: true,
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary',
        title: 'text-warning fw-bold',
      },
      preConfirm: () => {
        const observacion = (document.getElementById('observacion') as HTMLTextAreaElement).value
        if (!observacion.trim()) {
          Swal.showValidationMessage('La observación es requerida')
          return false
        }
        if (observacion.trim().length < 10) {
          Swal.showValidationMessage('La observación debe tener al menos 10 caracteres')
          return false
        }
        return {observacion: observacion.trim()}
      },
    })

    if (formValues) {
      return {
        confirmed: true,
        action: 'observe',
        observacion: formValues.observacion,
      }
    }
    return {confirmed: false}
  }
}

// MANTENER COMPATIBILIDAD HACIA ATRÁS
export {UnifiedModalService as ComisionModalService}
