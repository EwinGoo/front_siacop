import {useEffect, useMemo, useState} from 'react'
import {useSearchParams} from 'react-router-dom'
import {KTCard} from 'src/_metronic/helpers'
import PDFModal from '../../comision/comision-list/pdf-modal/PDFModal'
import {SelectField} from 'src/app/modules/components/SelectField'
import {EmptyState} from '../components/EmptyState'
import {PlanillaModuleNav} from '../components/PlanillaModuleNav'
import {StatusBadge} from '../components/StatusBadge'
import {
  BonoRefrigerioDetalle,
  BonoRefrigerioResumen,
  PlanillaMensualPDFData,
  ProcesoPlanilla,
  ReporteBonoRefrigerioParams,
} from '../core/_models'
import {
  generarReporteBonoRefrigerio,
  getBonoRefrigerio,
  getDetalleBonoRefrigerio,
  getProcesosPlanilla,
} from '../core/_requests'
import {ReportModal} from './report-modal/ReportModal'

const BonoRefrigerioPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [idProceso, setIdProceso] = useState(searchParams.get('proceso') || '')
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<BonoRefrigerioResumen[]>([])
  const [detalle, setDetalle] = useState<BonoRefrigerioDetalle | null>(null)
  const [procesos, setProcesos] = useState<ProcesoPlanilla[]>([])
  const [showReportModal, setShowReportModal] = useState(false)
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [currentPDFData, setCurrentPDFData] = useState<PlanillaMensualPDFData | null>(null)

  const canLoad = useMemo(() => Number(idProceso) > 0, [idProceso])
  const procesoSeleccionado = useMemo(
    () => procesos.find((proceso) => String(proceso.id_proceso) === idProceso) || null,
    [procesos, idProceso]
  )

  const procesoOptions = useMemo(
    () => [
      {value: '', label: 'Seleccione un proceso'},
      ...procesos.map((proceso) => ({
        value: String(proceso.id_proceso),
        label: `#${proceso.id_proceso} - ${proceso.fecha_inicio || '-'} a ${proceso.fecha_fin || '-'}${proceso.estado_proceso ? ` (${proceso.estado_proceso})` : ''}`,
      })),
    ],
    [procesos]
  )

  const filterBridge = useMemo(
    () => ({
      values: {
        idProceso,
      },
      setFieldValue: (field: string, value: string) => {
        if (field === 'idProceso') {
          setIdProceso(value)
        }
      },
      setFieldTouched: () => undefined,
      touched: {},
    }),
    [idProceso]
  )

  const cargar = async () => {
    if (!canLoad) {
      setRows([])
      setDetalle(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await getBonoRefrigerio(Number(idProceso), {
        search: search || undefined,
      })
      setRows(data.data || [])
      const next = new URLSearchParams(searchParams)
      next.set('proceso', idProceso)
      search ? next.set('search', search) : next.delete('search')
      setSearchParams(next)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'No se pudo cargar bono refrigerio.')
    } finally {
      setLoading(false)
    }
  }

  const handleShowPDF = async (params: ReporteBonoRefrigerioParams) => {
    if (!canLoad) {
      return
    }

    const pdfData = await generarReporteBonoRefrigerio(Number(idProceso), params)
    setCurrentPDFData(pdfData)
    setShowPDFModal(true)
  }

  const handleClosePDFModal = () => {
    setShowPDFModal(false)
    setCurrentPDFData(null)
  }

  useEffect(() => {
    const cargarProcesos = async () => {
      try {
        const data = await getProcesosPlanilla(1, 100)
        setProcesos(data.data || [])
      } catch (err) {
        console.error('No se pudo cargar el listado de procesos.', err)
      }
    }

    void cargarProcesos()
  }, [])

  useEffect(() => {
    if (canLoad) {
      void cargar()
    }
  }, [])

  const verDetalle = async (row: BonoRefrigerioResumen) => {
    if (!canLoad || !row.id_persona) {
      return
    }

    try {
      const data = await getDetalleBonoRefrigerio(Number(idProceso), row.id_persona)
      setDetalle(data)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'No se pudo cargar el detalle de bono refrigerio.')
    }
  }

  return (
    <>
      <PlanillaModuleNav />

      <KTCard className='mb-7'>
        <div className='card-header'>
          <div className='card-title d-flex flex-column'>
            <h3 className='fw-bold m-0'>Bono refrigerio consolidado</h3>
            <span className='text-muted mt-1'>
              Calcula días pagables, excluidos y no válidos a partir del proceso mensual de asistencia.
            </span>
          </div>
        </div>
        <div className='card-body'>
          <div className='row g-4 align-items-end'>
            <div className='col-12 col-md-3'>
              <label className='form-label fw-semibold'>Proceso</label>
              <SelectField
                field={{name: 'idProceso', value: idProceso}}
                form={filterBridge}
                options={procesoOptions}
                placeholder='Seleccione un proceso'
                isFieldValid
              />
            </div>
            <div className='col-12 col-md-7'>
              <label className='form-label fw-semibold'>Buscar persona</label>
              <input
                type='text'
                className='form-control'
                placeholder='Nombre o CI'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    void cargar()
                  }
                }}
              />
            </div>
            <div className='col-12 col-md-2 d-flex gap-2'>
              <button type='button' className='btn btn-primary flex-grow-1' onClick={() => void cargar()}>
                Buscar
              </button>
            </div>
            <div className='col-12 d-flex justify-content-end'>
              <button
                type='button'
                className='btn btn-light-warning'
                onClick={() => setShowReportModal(true)}
                disabled={!canLoad}
              >
                <i className='bi bi-file-earmark-pdf me-2'></i>
                Generar reporte PDF
              </button>
            </div>
          </div>

          {error && <div className='alert alert-danger mt-6 mb-0'>{error}</div>}
        </div>
      </KTCard>

      <KTCard className='mb-7'>
        <div className='card-body'>
          {!canLoad ? (
            <EmptyState
              title='Selecciona un proceso'
              description='Elige un proceso ejecutado para calcular los días pagables de bono refrigerio.'
            />
          ) : loading ? (
            <div className='text-muted'>Cargando bono refrigerio...</div>
          ) : rows.length === 0 ? (
            <EmptyState
              title='Sin resultados de bono'
              description='No hay registros para los filtros seleccionados.'
            />
          ) : (
            <div className='table-responsive'>
              <table className='table align-middle table-row-dashed fs-6 gy-4'>
                <thead>
                  <tr className='text-start text-muted fw-bold fs-7 text-uppercase gs-0'>
                    <th>Persona</th>
                    <th>Cargo</th>
                    <th>Días pagables</th>
                    <th>Días excluidos</th>
                    <th>Días no válidos</th>
                    <th>Atraso oficial</th>
                    <th>Días sanción</th>
                    <th>Estado</th>
                    <th className='text-end'>Acción</th>
                  </tr>
                </thead>
                <tbody className='fw-semibold text-gray-700'>
                  {rows.map((row, index) => (
                    <tr key={`${row.id_persona}-${index}`}>
                      <td>
                        <div className='d-flex flex-column'>
                          <span className='fw-bold'>
                            {row.persona?.nombre_completo || `Persona ${row.id_persona}`}
                          </span>
                          <span className='text-muted fs-7'>
                            {row.persona?.ci || row.persona?.codigo_biometrico_principal || `ID ${row.id_persona}`}
                          </span>
                        </div>
                      </td>
                      <td>{row.persona?.nombre_cargo || '-'}</td>
                      <td>{row.dias_validos_bono ?? 0}</td>
                      <td>{row.dias_excluidos_bono ?? 0}</td>
                      <td>{row.dias_no_validos_bono ?? 0}</td>
                      <td>{row.minutos_atraso_oficial ?? 0} min</td>
                      <td>{row.dias_descuento_oficial ?? 0}</td>
                      <td>
                        <StatusBadge value={row.estado_bono} />
                      </td>
                      <td className='text-end'>
                        <button
                          type='button'
                          className='btn btn-sm btn-light-primary'
                          onClick={() => void verDetalle(row)}
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </KTCard>

      {rows.length > 0 && (
        <div className='row g-5 mb-7'>
          <div className='col-12 col-md-3'>
            <div className='card card-flush h-100'>
              <div className='card-body'>
                <div className='text-gray-500 fs-7 text-uppercase fw-bold mb-2'>Personas listadas</div>
                <div className='fs-1 fw-bolder text-gray-900'>{rows.length}</div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-3'>
            <div className='card card-flush h-100'>
              <div className='card-body'>
                <div className='text-gray-500 fs-7 text-uppercase fw-bold mb-2'>Días pagables</div>
                <div className='fs-1 fw-bolder text-success'>
                  {rows.reduce((sum, row) => sum + (row.dias_validos_bono ?? 0), 0)}
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-3'>
            <div className='card card-flush h-100'>
              <div className='card-body'>
                <div className='text-gray-500 fs-7 text-uppercase fw-bold mb-2'>Días no válidos</div>
                <div className='fs-1 fw-bolder text-danger'>
                  {rows.reduce((sum, row) => sum + (row.dias_no_validos_bono ?? 0), 0)}
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-3'>
            <div className='card card-flush h-100'>
              <div className='card-body'>
                <div className='text-gray-500 fs-7 text-uppercase fw-bold mb-2'>Observados</div>
                <div className='fs-1 fw-bolder text-warning'>
                  {rows.reduce((sum, row) => sum + (row.dias_observados_bono ?? 0), 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {detalle && (
        <KTCard>
          <div className='card-header'>
            <div className='card-title d-flex flex-column'>
              <h3 className='fw-bold m-0'>Detalle de bono refrigerio</h3>
              <span className='text-muted mt-1'>
                {detalle.resumen.persona?.nombre_completo || `Persona ${detalle.resumen.id_persona}`} - {detalle.resumen.persona?.ci || detalle.resumen.persona?.codigo_biometrico_principal || 'Sin CI'}
              </span>
            </div>
          </div>
          <div className='card-body'>
            <div className='row g-5 mb-7'>
              <div className='col-md-3'>
                <div className='text-gray-600 fs-7 text-uppercase mb-1'>Días pagables</div>
                <div className='fw-bold fs-4 text-success'>{detalle.resumen.dias_validos_bono ?? 0}</div>
              </div>
              <div className='col-md-3'>
                <div className='text-gray-600 fs-7 text-uppercase mb-1'>Días excluidos</div>
                <div className='fw-bold fs-4 text-primary'>{detalle.resumen.dias_excluidos_bono ?? 0}</div>
              </div>
              <div className='col-md-3'>
                <div className='text-gray-600 fs-7 text-uppercase mb-1'>Días no válidos</div>
                <div className='fw-bold fs-4 text-danger'>{detalle.resumen.dias_no_validos_bono ?? 0}</div>
              </div>
              <div className='col-md-3'>
                <div className='text-gray-600 fs-7 text-uppercase mb-1'>Estado bono</div>
                <StatusBadge value={detalle.resumen.estado_bono} />
              </div>
            </div>

            <div className='table-responsive'>
              <table className='table align-middle table-row-dashed fs-7 gy-3'>
                <thead>
                  <tr className='text-start text-muted fw-bold text-uppercase gs-0'>
                    <th>Fecha</th>
                    <th>Estado día</th>
                    <th>Estado bono</th>
                    <th>Horario</th>
                    <th>Marcaciones</th>
                    <th>Justificativo</th>
                    <th>Motivo</th>
                  </tr>
                </thead>
                <tbody className='fw-semibold text-gray-700'>
                  {detalle.dias.map((dia) => (
                    <tr key={dia.id_resultado_diario}>
                      <td>{dia.fecha || '-'}</td>
                      <td><StatusBadge value={dia.estado_dia} /></td>
                      <td><StatusBadge value={dia.estado_bono_dia} /></td>
                      <td>{dia.tipo_horario || dia.nombre_horario_tipo || '-'}</td>
                      <td>
                        {dia.cantidad_marcaciones_validas ?? 0} / {dia.cantidad_marcaciones_esperadas ?? 0}
                      </td>
                      <td>{dia.justificativo_principal || '-'}</td>
                      <td>{dia.motivo_bono || dia.observacion || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </KTCard>
      )}

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        proceso={procesoSeleccionado}
        searchInicial={search}
        onShowPDF={handleShowPDF}
      />

      <PDFModal
        isOpen={showPDFModal}
        onClose={handleClosePDFModal}
        pdfBlob={currentPDFData?.blob || null}
        filename={currentPDFData?.filename || 'REPORTE_BONO_REFRIGERIO.pdf'}
        title={currentPDFData?.title || 'Reporte de bono refrigerio'}
      />
    </>
  )
}

export default BonoRefrigerioPage
