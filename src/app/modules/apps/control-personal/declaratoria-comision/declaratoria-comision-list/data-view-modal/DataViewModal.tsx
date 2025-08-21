import React from 'react'
import {Modal} from 'react-bootstrap'
import useDateFormatter from 'src/app/hooks/useDateFormatter'
import {ListLoading} from 'src/app/modules/components/loading/ListLoading'
import { DeclaratoriaComision } from '../core/_models'

interface DataViewModalProps {
  isOpen: boolean
  onClose: () => void
  declaratoria: DeclaratoriaComision
}

const DataViewModal: React.FC<DataViewModalProps> = ({isOpen, onClose, declaratoria}) => {
  const {formatLongDate} = useDateFormatter()

  const formatDateRange = (inicio: string | undefined, fin: string | undefined) => {
    if (!inicio || !fin) return 'No especificado'
    const fechaInicio = formatLongDate(inicio)
    const fechaFin = formatLongDate(fin)
    return `${fechaInicio} - ${fechaFin}`
  }

  const getTipoViaticoText = (tipo: any) => {
    if (typeof tipo === 'boolean') {
      return tipo ? 'Con viático' : 'Sin viático'
    }
    if (typeof tipo === 'string') {
      return tipo === 'con_viatico' ? 'Con viático' : 'Sin viático'
    }
    return 'No especificado'
  }

  const getEstadoBadge = (estado: string | undefined) => {
    const badges = {
      GENERADO: 'badge-light-warning',
      EMITIDO: 'badge-light-success',
      ANULADO: 'badge-light-danger',
    }
    const badgeClass = badges[estado as keyof typeof badges] || 'badge-light-secondary'

    return <span className={`badge ${badgeClass} fs-7`}>{estado || 'No definido'}</span>
  }

  return (
    <Modal show={isOpen} onHide={onClose} size='xl' centered scrollable>
      <Modal.Header closeButton className='border-0 pb-0'>
        <Modal.Title className='fs-2 fw-bold text-gray-900'>
          <i className='ki-duotone ki-document text-primary fs-1 me-3'>
            <span className='path1'></span>
            <span className='path2'></span>
          </i>
          Detalles de la Declaratoria
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className='px-9 py-5'>
        {declaratoria ? (
          <>
            <div className='d-flex justify-content-between align-items-center mb-9 p-6 bg-gray-100 rounded'>
              <div>
                <h3 className='text-gray-900 fw-bold mb-2'>Declaratoria de Comisión</h3>
                {declaratoria.correlativo && (
                  <div className='text-muted fs-6'>
                    <strong>Correlativo:</strong> {declaratoria.correlativo}
                  </div>
                )}
              </div>
              <div className='d-flex align-items-center'>
                {declaratoria.estado && getEstadoBadge(declaratoria.estado)}
              </div>
            </div>

            <div className='row g-7'>
              {/* Información del Solicitante */}
              <div className='col-12'>
                <div className='card '>
                  <div className='card-header border-0 pt-6'>
                    <div className='card-title'>
                      <i className='ki-duotone ki-profile-user text-primary fs-2x me-3'>
                        <span className='path1'></span>
                        <span className='path2'></span>
                        <span className='path3'></span>
                        <span className='path4'></span>
                      </i>
                      <h3 className='fw-bold text-gray-500 m-0'>Información del Solicitante</h3>
                    </div>
                  </div>
                  <div className='card-body pt-0'>
                    <div className='row g-6'>
                      <div className='col-lg-8'>
                        <div className='d-flex flex-column'>
                          <label className='fs-7 text-muted fw-bold text-uppercase mb-2'>
                            Nombre Completo
                          </label>
                          <span className='fw-semibold text-gray-800 fs-5'>
                            {declaratoria.nombre_generador || 'No especificado'}
                          </span>
                        </div>
                      </div>
                      <div className='col-lg-4'>
                        <div className='d-flex flex-column'>
                          <label className='fs-7 text-muted fw-bold text-uppercase mb-2'>
                            CÉDULA DE IDENTIDAD.
                          </label>
                          <span className='fw-semibold text-gray-800 fs-5'>
                            {declaratoria.ci || 'No especificado'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fechas y Documentación */}
              <div className='col-lg-6'>
                <div className='card  h-100'>
                  <div className='card-header border-0 pt-6'>
                    <div className='card-title'>
                      <i className='ki-duotone ki-calendar text-success fs-2x me-3'>
                        <span className='path1'></span>
                        <span className='path2'></span>
                      </i>
                      <h3 className='fw-bold text-gray-900 m-0'>Fechas y Documentación</h3>
                    </div>
                  </div>
                  <div className='card-body pt-0'>
                    <div className='d-flex flex-column gap-6'>
                      <div className='d-flex flex-column'>
                        <label className='fs-7 text-muted fw-bold text-uppercase mb-2'>
                          Fecha de Elaboración
                        </label>
                        <span className='fw-semibold text-gray-800 fs-6'>
                          {formatLongDate(declaratoria.fecha_elaboracion!)}
                        </span>
                      </div>
                      <div className='d-flex flex-column'>
                        <label className='fs-7 text-muted fw-bold text-uppercase mb-2'>
                          Hoja de Ruta N°
                        </label>
                        <span className='fw-semibold text-gray-800 fs-6'>
                          {declaratoria.rrhh_hoja_ruta_numero || 'No especificado'}
                        </span>
                      </div>
                      <div className='d-flex flex-column'>
                        <label className='fs-7 text-muted fw-bold text-uppercase mb-2'>
                          Fecha Hoja de Ruta
                        </label>
                        <span className='fw-semibold text-gray-800 fs-6'>
                          {formatLongDate(declaratoria.rrhh_hoja_ruta_fecha!)}
                        </span>
                      </div>
                      {declaratoria.nota_interna && (
                        <div className='d-flex flex-column'>
                          <label className='fs-7 text-muted fw-bold text-uppercase mb-2'>
                            Nota Interna
                          </label>
                          <span className='fw-semibold text-gray-800 fs-6'>
                            {declaratoria.nota_interna}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalles de la Comisión */}
              <div className='col-lg-6'>
                <div className='card  h-100'>
                  <div className='card-header border-0 pt-6'>
                    <div className='card-title'>
                      <i className='ki-duotone ki-briefcase text-warning fs-2x me-3'>
                        <span className='path1'></span>
                        <span className='path2'></span>
                      </i>
                      <h3 className='fw-bold text-gray-900 m-0'>Detalles de la Comisión</h3>
                    </div>
                  </div>
                  <div className='card-body pt-0'>
                    <div className='d-flex flex-column gap-6'>
                      <div className='d-flex flex-column'>
                        <label className='fs-7 text-muted fw-bold text-uppercase mb-2'>
                          Período de Comisión
                        </label>
                        <span className='fw-semibold text-gray-800 fs-6'>
                          {formatDateRange(declaratoria.fecha_inicio, declaratoria.fecha_fin)}
                        </span>
                      </div>
                      <div className='d-flex flex-column'>
                        <label className='fs-7 text-muted fw-bold text-uppercase mb-2'>
                          Destino
                        </label>
                        <span className='fw-semibold text-gray-800 fs-6'>
                          {declaratoria.destino || 'No especificado'}
                        </span>
                      </div>
                      <div className='d-flex flex-column'>
                        <label className='fs-7 text-muted fw-bold text-uppercase mb-2'>
                          Unidad Solicitante
                        </label>
                        <span className='fw-semibold text-gray-800 fs-6'>
                          {declaratoria.descripcion_cua || 'No especificado'}
                        </span>
                      </div>
                      <div className='d-flex flex-column'>
                        <label className='fs-7 text-muted fw-bold text-uppercase mb-2'>
                          Tipo de Viático
                        </label>
                        <div className='d-flex align-items-center'>
                          <span
                            className={`badge ${
                              declaratoria.tipo_viatico === 'con_viatico' ||
                              declaratoria.tipo_viatico === true
                                ? 'badge-light-success'
                                : 'badge-light-secondary'
                            } fs-7 fw-bold px-3 py-2`}
                          >
                            {getTipoViaticoText(declaratoria.tipo_viatico)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Motivo de la Comisión */}
              <div className='col-12'>
                <div className='card'>
                  <div className='card-header border-0 pt-6'>
                    <div className='card-title'>
                      <i className='ki-duotone ki-notepad text-info fs-2x me-3'>
                        <span className='path1'></span>
                        <span className='path2'></span>
                        <span className='path3'></span>
                        <span className='path4'></span>
                        <span className='path5'></span>
                      </i>
                      <h3 className='fw-bold text-gray-900 m-0'>Motivo de la Comisión</h3>
                    </div>
                  </div>
                  <div className='card-body pt-0'>
                    <div className='bg-light-gray-200 p-6 rounded border border-gray-300'>
                      <p className='text-gray-800 mb-0 fs-6 lh-lg fw-semibold'>
                        {declaratoria.motivo || 'No especificado'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del Sistema */}
              {(declaratoria.created_at || declaratoria.updated_at) && (
                <div className='col-12'>
                  <div className='card '>
                    <div className='card-header border-0 pt-6'>
                      <div className='card-title'>
                        <i className='ki-duotone ki-information text-gray-500 fs-2x me-3'>
                          <span className='path1'></span>
                          <span className='path2'></span>
                          <span className='path3'></span>
                        </i>
                        <h3 className='fw-bold text-gray-900 m-0'>Información del Sistema</h3>
                      </div>
                    </div>
                    <div className='card-body pt-0'>
                      <div className='row g-6'>
                        {declaratoria.created_at && (
                          <div className='col-md-6'>
                            <div className='d-flex flex-column'>
                              <label className='fs-7 text-muted fw-bold text-uppercase mb-2'>
                                Fecha de Creación
                              </label>
                              <span className='fw-semibold text-gray-800 fs-6'>
                                {formatLongDate(declaratoria.created_at)}
                              </span>
                            </div>
                          </div>
                        )}
                        {declaratoria.updated_at && (
                          <div className='col-md-6'>
                            <div className='d-flex flex-column'>
                              <label className='fs-7 text-muted fw-bold text-uppercase mb-2'>
                                Última Modificación
                              </label>
                              <span className='fw-semibold text-gray-800 fs-6'>
                                {formatLongDate(declaratoria.updated_at)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <ListLoading />
        )}

        {/* Header con estado */}
      </Modal.Body>

      <Modal.Footer className='border-0 pt-0'>
        <button type='button' className='btn btn-light-primary fw-bold' onClick={onClose}>
          <i className='ki-duotone ki-cross fs-2 me-2'>
            <span className='path1'></span>
            <span className='path2'></span>
          </i>
          Cerrar
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default DataViewModal
