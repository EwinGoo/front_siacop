import {FC, useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {useListView} from '../core/ListViewProvider'
import {useQuery} from 'react-query'
import {getComisionById} from '../core/_requests'
import {QUERIES} from 'src/_metronic/helpers'
import {ComisionDetails} from './components/ComisionDetails'
import {useObservarComision} from './hooks/useObservarComision'
import {toast} from 'react-toastify'

export const ObservarModal: FC = () => {
  const {accion, isShow, itemIdForUpdate, setIsShow, setAccion} = useListView()
  const show = isShow && accion === 'observar'

  const {data: comision, isLoading, error} = useQuery(
    `${QUERIES.COMISIONES_LIST}-observar-${itemIdForUpdate}`,
    () => getComisionById(itemIdForUpdate),
    {
      enabled: !!itemIdForUpdate && show,
      cacheTime: 0,
      retry: 1,
      onError: () => {
        toast.error('Error al cargar la comisión')
        handleClose()
      }
    }
  )

  const {formik, resetForm} = useObservarComision(
    itemIdForUpdate ?? undefined,
    comision?.observacion ?? '',
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
        <Modal.Title>Observar Comisión</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {comision && <ComisionDetails comision={comision} />}

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
        <Button 
          type='submit' 
          form='form-observar' 
          variant='primary' 
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Enviando...' : 'Enviar Observación'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}