import {FC, useEffect} from 'react'
import {Modal, Button, Spinner} from 'react-bootstrap'
import {useListView} from '../core/ListViewProvider'
import {useQuery} from 'react-query'
import {getAsistenciaPermisoById} from '../core/_requests'
import {QUERIES} from 'src/_metronic/helpers'
import {AsistenciaPermisoDetails} from './components/AsistenciaPermisoDetails'
import {useObservarComision} from './hooks/useObservarComision'
import {toast} from 'react-toastify'

export const ObservarModal: FC = () => {
  const {accion, isShow, itemIdForUpdate, setIsShow, setAccion} = useListView()
  const show = isShow && accion === 'observar'

  const {
    data: asistenciaPermiso,
    isLoading,
    error,
  } = useQuery(
    `${QUERIES.ASISTENCIAS_PERMISO_LIST}-observar-${itemIdForUpdate}`,
    () => getAsistenciaPermisoById(itemIdForUpdate),
    {
      enabled: !!itemIdForUpdate && show,
      cacheTime: 0,
      retry: 1,
      onError: () => {
        toast.error('Error al cargar el permiso')
        handleClose()
      },
    }
  )

  const {formik, resetForm} = useObservarComision(
    itemIdForUpdate ?? undefined,
    asistenciaPermiso?.observacion ?? '',
    () => handleClose()
  )

  const handleClose = () => {
    setIsShow(false)
    setAccion(undefined)
    resetForm()
  }

  useEffect(() => {
    if (show) resetForm()
  }, [show])

  if (!show) return null

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Observar Permiso</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoading && (
          <div className='d-flex flex-column align-items-center justify-content-center py-10 px-5'>
            <Spinner animation='border' role='status'>
              <span className='visually-hidden'>Cargando...</span>
            </Spinner>
          </div>
        )}

        {asistenciaPermiso && <AsistenciaPermisoDetails asistenciaPermiso={asistenciaPermiso} />}

        <form onSubmit={formik.handleSubmit} id='form-observar'>
          <div className='mb-3'>
            <label htmlFor='observacion' className='form-label'>
              Observación <span className='text-danger'>*</span>
            </label>
            <textarea
              id='observacion'
              rows={4}
              className={`form-control ${
                formik.touched.observacion && formik.errors.observacion ? 'is-invalid' : ''
              }`}
              {...formik.getFieldProps('observacion')}
              disabled={formik.isSubmitting}
            />
            {formik.touched.observacion && formik.errors.observacion && (
              <div className='invalid-feedback'>{formik.errors.observacion}</div>
            )}
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose} disabled={formik.isSubmitting}>
          Cancelar
        </Button>
        <Button type='submit' form='form-observar' variant='primary' disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Enviando...' : 'Enviar Observación'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
