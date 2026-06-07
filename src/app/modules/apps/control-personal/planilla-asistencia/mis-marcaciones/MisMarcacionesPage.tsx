import {useEffect, useMemo, useState} from 'react'
import {PageTitle} from 'src/_metronic/layout/core'
import PDFModal from '../../comision/comision-list/pdf-modal/PDFModal'
import {KTCard} from 'src/_metronic/helpers'
import {useAuth} from 'src/app/modules/auth'
import {EmptyState} from '../components/EmptyState'
import {StatusBadge} from '../components/StatusBadge'
import {
  MarcacionNormalizada,
  MiMarcacionOficialDia,
  PaginationPayload,
  PlanillaMensualPDFData,
} from '../core/_models'
import {generarReporteMisMarcaciones, getMisMarcaciones} from '../core/_requests'

const PAGE_SIZE = 25
const today = () => new Date().toISOString().slice(0, 10)

const formatHora = (value?: string | null) => value || '-'
const formatFechaHora = (value?: string | null) => value?.slice(11, 19) || '-'

const MisMarcacionesPage = () => {
  const {currentUser} = useAuth()
  const [fechaDesde, setFechaDesde] = useState(today())
  const [fechaHasta, setFechaHasta] = useState(today())
  const [rows, setRows] = useState<MarcacionNormalizada[]>([])
  const [oficiales, setOficiales] = useState<MiMarcacionOficialDia[]>([])
  const [pagination, setPagination] = useState<PaginationPayload>({
    page: 1,
    total: 0,
    items_per_page: PAGE_SIZE,
  })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'historial' | 'horario'>('historial')
  const [pdfData, setPdfData] = useState<PlanillaMensualPDFData | null>(null)
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [generatingPdf, setGeneratingPdf] = useState(false)

  const totalPages = useMemo(() => {
    const total = Number(pagination.total || 0)
    const perPage = Number(pagination.items_per_page || PAGE_SIZE)
    return Math.max(1, Math.ceil(total / perPage))
  }, [pagination])

  const resumen = useMemo(() => {
    const puntos = oficiales.flatMap((dia) => dia.puntos || [])
    const validas = puntos.filter((punto) => Boolean(punto.id_marcacion)).length
    const atrasos = puntos.filter((punto) => punto.estado_punto === 'ATRASO').length
    return {
      oficiales: validas,
      esperadas: puntos.length,
      atrasos,
      historial: rows.length,
    }
  }, [oficiales, rows])

  const cargar = async (nextPage = page) => {
    setLoading(true)
    setError(null)

    try {
      const response = await getMisMarcaciones(nextPage, PAGE_SIZE, {
        fecha_desde: fechaDesde || undefined,
        fecha_hasta: fechaHasta || undefined,
      })
      setRows(response.data || [])
      setOficiales(response.oficiales || [])
      setPagination(response.pagination || {page: nextPage, total: 0, items_per_page: PAGE_SIZE})
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || 'No se pudieron cargar sus marcaciones.'
      )
    } finally {
      setLoading(false)
    }
  }

  const buscar = () => {
    setPage(1)
    void cargar(1)
  }

  const cambiarPagina = (nextPage: number) => {
    const safePage = Math.min(Math.max(1, nextPage), totalPages)
    setPage(safePage)
    void cargar(safePage)
  }
  const generarReporte = async () => {
    setGeneratingPdf(true)
    setError(null)
    try {
      const tipo = activeTab === 'horario' ? 'HORARIO' : 'HISTORIAL'
      const response = await generarReporteMisMarcaciones(tipo, {
        fecha_desde: fechaDesde || undefined,
        fecha_hasta: fechaHasta || undefined,
      })
      setPdfData(response)
      setShowPDFModal(true)
    } catch (err: any) {
      setError(err?.message || 'No se pudo generar el reporte PDF.')
    } finally {
      setGeneratingPdf(false)
    }
  }

  const cerrarPDF = () => {
    setShowPDFModal(false)
    setPdfData(null)
  }

  useEffect(() => {
    void cargar(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <PageTitle breadcrumbs={[]}>Mis marcaciones</PageTitle>

      <KTCard className='mb-5'>
        <div className='card-body py-5'>
          <div className='d-flex flex-column flex-lg-row justify-content-between gap-4'>
            <div>
              <h3 className='fw-bold text-gray-900 mb-1'>Mis marcaciones</h3>
              <div className='text-muted fs-7'>
                Consulta personal de marcas válidas por horario e historial biométrico.
              </div>
            </div>
            <div className='d-flex align-items-center justify-content-lg-end gap-3'>
              <button
                type='button'
                className='btn btn-sm btn-light-danger'
                onClick={() => void generarReporte()}
                disabled={generatingPdf}
                title='Generar PDF'
              >
                {generatingPdf ? (
                  <>
                    <span className='spinner-border spinner-border-sm' />{' '}
                  </>
                ) : (
                  <i className='bi bi-file-earmark-pdf' />
                )}
                Reporte PDF
              </button>
              <div className='text-lg-end'>
                <div className='fw-bold text-gray-900'>{currentUser?.first_name || 'Usuario'}</div>
                <div className='text-muted fs-8'>
                  {currentUser?.personal?.tipo_personal || 'Administrativo'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </KTCard>

      <KTCard className='mb-5'>
        <div className='card-body py-0 px-6'>
          <div className='d-flex flex-wrap align-items-stretch gap-4 gap-md-8 overflow-auto'>
            <button
              type='button'
              className={`btn btn-flush d-flex align-items-center rounded-0 px-0 py-3 border-bottom border-3 ${
                activeTab === 'historial' ? 'border-gray-900' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('historial')}
            >
              <span
                className={`fw-semibold fs-6 me-2 ${
                  activeTab === 'historial' ? 'text-gray-900' : 'text-gray-600'
                }`}
              >
                Historial biométrico
              </span>
              <span className='badge badge-dark fw-bold'>{resumen.historial}</span>
            </button>
            <button
              type='button'
              className={`btn btn-flush d-flex align-items-center rounded-0 px-0 py-3 border-bottom border-3 ${
                activeTab === 'horario' ? 'border-gray-900' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('horario')}
            >
              <span
                className={`fw-semibold fs-6 me-2 ${
                  activeTab === 'horario' ? 'text-gray-900' : 'text-gray-600'
                }`}
              >
                Marcaciones por horario
              </span>
              <span className='badge badge-light-success text-success fw-bold'>
                {resumen.oficiales}
              </span>
            </button>
            <div className='d-flex align-items-center py-3'>
              <span className='text-gray-600 fw-semibold fs-6 me-2'>Esperadas</span>
              <span className='badge badge-light-warning text-warning fw-bold'>
                {resumen.esperadas}
              </span>
            </div>
            <div className='d-flex align-items-center py-3'>
              <span className='text-gray-600 fw-semibold fs-6 me-2'>Atrasos</span>
              <span className='badge badge-light-danger text-danger fw-bold'>
                {resumen.atrasos}
              </span>
            </div>
          </div>
        </div>
      </KTCard>
      <KTCard className='mb-5'>
        <div className='card-body'>
          <div className='row g-4 align-items-end'>
            <div className='col-12 col-md-4'>
              <label className='form-label fw-semibold'>Desde</label>
              <input
                type='date'
                className='form-control'
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
              />
            </div>
            <div className='col-12 col-md-4'>
              <label className='form-label fw-semibold'>Hasta</label>
              <input
                type='date'
                className='form-control'
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
              />
            </div>
            <div className='col-12 col-md-4 d-flex gap-2'>
              <button
                type='button'
                className='btn btn-primary flex-grow-1'
                onClick={buscar}
                disabled={loading}
              >
                Buscar
              </button>
              <button
                type='button'
                className='btn btn-light-primary'
                onClick={() => void cargar()}
                disabled={loading}
                title='Recargar'
              >
                {loading ? (
                  <span className='spinner-border spinner-border-sm' />
                ) : (
                  <i className='bi bi-arrow-clockwise' />
                )}
              </button>
            </div>
          </div>
          {error && <div className='alert alert-danger mt-5 mb-0'>{error}</div>}
        </div>
      </KTCard>

      <KTCard>
        <div className='card-body'>
          {activeTab === 'historial' ? (
            <>
              {loading ? (
                <div className='text-muted'>Cargando historial...</div>
              ) : rows.length === 0 ? (
                <EmptyState
                  title='Sin marcaciones'
                  description='No se encontraron marcas para el rango seleccionado.'
                />
              ) : (
                <div className='table-responsive'>
                  <table className='table align-middle table-row-dashed fs-6 gy-4'>
                    <thead>
                      <tr className='text-start text-muted fw-bold fs-7 text-uppercase gs-0'>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Código biométrico</th>
                        {/* <th>Dispositivo</th> */}
                        {/* <th>Marcación</th> */}
                        <th>Verificación</th>
                        <th>Origen</th>
                      </tr>
                    </thead>
                    <tbody className='fw-semibold text-gray-700'>
                      {rows.map((row) => (
                        <tr key={row.id_marcacion}>
                          <td>
                            {row.fecha_marcacion || row.fecha_hora_marcacion?.slice(0, 10) || '-'}
                          </td>
                          <td>
                            {row.hora_marcacion || row.fecha_hora_marcacion?.slice(11, 19) || '-'}
                          </td>
                          <td>{row.codigo_biometrico || '-'}</td>
                          {/* <td>{row.serial_dispositivo || '-'}</td> */}
                          {/* <td>
                            <StatusBadge value={row.estado_marcacion || '-'} />
                          </td> */}
                          <td>{row.tipo_verificacion || '-'}</td>
                          <td>
                            <StatusBadge value={row.origen_marcacion || '-'} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className='d-flex justify-content-between align-items-center pt-4'>
                <span className='text-muted fs-7'>
                  Página {page} de {totalPages}
                </span>
                <div className='d-flex gap-2'>
                  <button
                    type='button'
                    className='btn btn-sm btn-light'
                    onClick={() => cambiarPagina(page - 1)}
                    disabled={loading || page <= 1}
                  >
                    Anterior
                  </button>
                  <button
                    type='button'
                    className='btn btn-sm btn-light'
                    onClick={() => cambiarPagina(page + 1)}
                    disabled={loading || page >= totalPages}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {loading ? (
                <div className='text-muted'>Cargando marcaciones...</div>
              ) : oficiales.length === 0 ? (
                <EmptyState
                  title='Sin cálculo oficial'
                  description='Aún no existe resultado de planilla para el rango seleccionado.'
                />
              ) : (
                <div className='table-responsive'>
                  <table className='table align-middle table-row-dashed fs-6 gy-4'>
                    <thead>
                      <tr className='text-start text-muted fw-bold fs-7 text-uppercase gs-0'>
                        <th>Fecha</th>
                        <th>Horario</th>
                        <th>Punto</th>
                        <th>Esperada</th>
                        <th>Marcada</th>
                        <th>Estado</th>
                        <th>Desfase</th>
                      </tr>
                    </thead>
                    <tbody className='fw-semibold text-gray-700'>
                      {oficiales.flatMap((dia) =>
                        dia.puntos.map((punto) => (
                          <tr key={`${dia.id_resultado_diario}-${punto.id_resultado_punto}`}>
                            <td>{dia.fecha || '-'}</td>
                            <td>{dia.nombre_horario_tipo || dia.tipo_horario || '-'}</td>
                            <td>{punto.nombre_punto || punto.codigo_punto || '-'}</td>
                            <td>{formatHora(punto.hora_esperada)}</td>
                            <td>
                              {punto.hora_marcada || formatFechaHora(punto.fecha_hora_marcacion)}
                            </td>
                            <td>
                              <StatusBadge value={punto.estado_punto || 'SIN_MARCACION'} />
                            </td>
                            <td>{Number(punto.minutos_desfase || 0)} min</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </KTCard>
      <PDFModal
        isOpen={showPDFModal}
        onClose={cerrarPDF}
        pdfBlob={pdfData?.blob || null}
        filename={pdfData?.filename || 'MIS_MARCACIONES.pdf'}
        title={pdfData?.title || 'Reporte de marcaciones'}
      />
    </>
  )
}

export default MisMarcacionesPage
