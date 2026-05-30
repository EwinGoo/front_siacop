import {ChangeEvent, useEffect, useState} from 'react'
import {KTCard} from 'src/_metronic/helpers'
import {PlanillaModuleNav} from '../components/PlanillaModuleNav'
import {StatusBadge} from '../components/StatusBadge'
import {EmptyState} from '../components/EmptyState'
import {ImportacionResumenResponse} from '../core/_models'
import {getResumenImportaciones, uploadMarcaciones} from '../core/_requests'

const ImportacionesPage = () => {
  const [files, setFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [loadingResumen, setLoadingResumen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resumen, setResumen] = useState<ImportacionResumenResponse | null>(null)
  const archivosResumen = Array.isArray(resumen?.archivos) ? resumen.archivos : []

  const cargarResumen = async () => {
    setLoadingResumen(true)
    try {
      const data = await getResumenImportaciones()
      setResumen(data)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'No se pudo cargar el resumen.')
    } finally {
      setLoadingResumen(false)
    }
  }

  useEffect(() => {
    void cargarResumen()
  }, [])

  const onFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || [])
    setFiles(selected)
    setError(null)
  }

  const onSubmit = async () => {
    if (files.length === 0) {
      setError('Debes seleccionar al menos un archivo .dat.')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const response = await uploadMarcaciones(files)
      setResumen(response)
      setFiles([])
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'No se pudo importar los archivos.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PlanillaModuleNav />

      {resumen && (
        <div className='row g-5 mb-7'>
          <div className='col-12 col-md-4'>
            <div className='card card-flush h-100'>
              <div className='card-body'>
                <div className='text-gray-500 fs-7 text-uppercase fw-bold mb-2'>Archivos procesados</div>
                <div className='d-flex align-items-end gap-3'>
                  <span className='fs-1 fw-bolder text-gray-900'>
                    {resumen.total_archivos ?? archivosResumen.length}
                  </span>
                  <span className='badge badge-light-primary'>Total</span>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-4'>
            <div className='card card-flush h-100'>
              <div className='card-body'>
                <div className='text-gray-500 fs-7 text-uppercase fw-bold mb-2'>Importaciones correctas</div>
                <div className='d-flex align-items-end gap-3'>
                  <span className='fs-1 fw-bolder text-success'>{resumen.total_ok ?? 0}</span>
                  <span className='badge badge-light-success'>Completadas</span>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-4'>
            <div className='card card-flush h-100'>
              <div className='card-body'>
                <div className='text-gray-500 fs-7 text-uppercase fw-bold mb-2'>Importaciones con error</div>
                <div className='d-flex align-items-end gap-3'>
                  <span className='fs-1 fw-bolder text-danger'>{resumen.total_error ?? 0}</span>
                  <span className='badge badge-light-danger'>Revisar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <KTCard className='mb-7'>
        <div className='card-header'>
          <div className='card-title d-flex flex-column'>
            <h3 className='fw-bold m-0'>Importación de marcaciones</h3>
            <span className='text-muted mt-1'>Carga multiarchivo con trazabilidad individual por biométrico</span>
          </div>
        </div>
        <div className='card-body'>
          <div className='row g-5 align-items-end'>
            <div className='col-12 col-lg-8'>
              <label className='form-label fw-semibold'>Archivos biométricos `.dat`</label>
              <input
                type='file'
                multiple
                accept='.dat'
                className='form-control'
                onChange={onFilesChange}
              />
              <div className='form-text'>
                Puedes subir uno o varios archivos a la vez. El backend los procesa de forma secuencial.
              </div>
            </div>
            <div className='col-12 col-lg-4 d-flex gap-2'>
              <button
                type='button'
                className='btn btn-primary flex-grow-1'
                disabled={submitting}
                onClick={onSubmit}
              >
                {submitting ? 'Importando...' : 'Importar archivos'}
              </button>
              <button
                type='button'
                className='btn btn-light-primary'
                disabled={loadingResumen}
                onClick={() => void cargarResumen()}
              >
                Recargar
              </button>
            </div>
          </div>

          {files.length > 0 && (
            <div className='mt-6'>
              <div className='fw-semibold mb-2'>Archivos seleccionados</div>
              <div className='d-flex flex-wrap gap-2'>
                {files.map((file) => (
                  <span key={`${file.name}-${file.size}`} className='badge badge-light-info'>
                    {file.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {error && <div className='alert alert-danger mt-6 mb-0'>{error}</div>}
        </div>
      </KTCard>

      <KTCard>
        <div className='card-header'>
          <div className='card-title d-flex flex-column'>
            <h3 className='fw-bold m-0'>Resumen de importaciones</h3>
            <span className='text-muted mt-1'>
              {resumen
                ? `${resumen.total_archivos ?? archivosResumen.length} archivos, ${resumen.total_ok ?? 0} correctos, ${resumen.total_error ?? 0} con error`
                : 'Trazabilidad por archivo'}
            </span>
          </div>
        </div>
        <div className='card-body'>
          {loadingResumen ? (
            <div className='text-muted'>Cargando resumen...</div>
          ) : !resumen || archivosResumen.length === 0 ? (
            <EmptyState
              title='Sin importaciones registradas'
              description='Cuando subas archivos, aquí verás el resultado por archivo.'
            />
          ) : (
            <div className='table-responsive'>
              <table className='table align-middle table-row-dashed fs-6 gy-4'>
                <thead>
                  <tr className='text-start text-muted fw-bold fs-7 text-uppercase gs-0'>
                    <th>Archivo</th>
                    <th>Estado</th>
                    <th>Líneas</th>
                    <th>Raw</th>
                    <th>Normalizadas</th>
                    <th>Sin persona</th>
                    <th>Duración</th>
                  </tr>
                </thead>
                <tbody className='fw-semibold text-gray-700'>
                  {archivosResumen.map((item) => (
                    <tr key={`${item.id_importacion_archivo}-${item.archivo_origen}`}>
                      <td>
                        <div className='d-flex flex-column'>
                          <span className='fw-bold'>{item.archivo_origen}</span>
                          <span className='text-muted fs-7'>{item.ruta_archivo_guardado}</span>
                        </div>
                      </td>
                      <td><StatusBadge value={item.estado_importacion} /></td>
                      <td>{item.total_lineas_archivo ?? 0}</td>
                      <td>
                        <div>Insertadas: {item.raw_insertados ?? 0}</div>
                        <div className='text-muted fs-7'>Duplicadas: {item.raw_duplicados ?? 0}</div>
                      </td>
                      <td>
                        <div>Insertadas: {item.normalizados_insertados ?? 0}</div>
                        <div className='text-muted fs-7'>
                          Duplicadas: {item.normalizados_duplicados ?? 0}
                        </div>
                      </td>
                      <td>{item.sin_persona_relacionada ?? 0}</td>
                      <td>{item.duracion_ms ?? 0} ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </KTCard>
    </>
  )
}

export default ImportacionesPage
