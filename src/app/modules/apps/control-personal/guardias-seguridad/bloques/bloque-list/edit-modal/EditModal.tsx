import {useEffect, useState} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import {useListView} from '../core/ListViewProvider'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {createBloque, updateBloque, getBloqueById} from '../core/_requests'
import {Bloque, initialBloque} from '../core/_models'
import {KTIcon} from '../../../../../../../../_metronic/helpers'

const schema = Yup.object({
  nombre: Yup.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres').required('El nombre es obligatorio'),
  descripcion: Yup.string().max(255, 'Máximo 255 caracteres').nullable(),
})

const EditModal = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()
  const [loading, setLoading] = useState(false)
  const [bloque, setBloque] = useState<Bloque>(initialBloque)

  useEffect(() => {
    if (itemIdForUpdate && itemIdForUpdate !== null) {
      getBloqueById(itemIdForUpdate).then((data) => {
        if (data) setBloque(data)
      })
    } else {
      setBloque(initialBloque)
    }
  }, [itemIdForUpdate])

  const formik = useFormik({
    initialValues: bloque,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      setLoading(true)
      try {
        if (values.id_bloque) {
          await updateBloque(values)
        } else {
          await createBloque(values)
        }
        await Swal.fire({
          icon: 'success',
          title: values.id_bloque ? 'Bloque actualizado' : 'Bloque creado',
          timer: 1500,
          showConfirmButton: false,
        })
        refetch()
        setItemIdForUpdate(undefined)
      } catch {
        Swal.fire({icon: 'error', title: 'Error', text: 'No se pudo guardar el bloque'})
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <>
      <div className='modal fade show d-block' tabIndex={-1} role='dialog'>
        <div className='modal-dialog modal-dialog-centered mw-500px'>
          <div className='modal-content'>
            <div className='modal-header bg-primary'>
              <h2 className='fw-bolder text-white'>
                {bloque.id_bloque ? 'Editar Bloque' : 'Nuevo Bloque'}
              </h2>
              <button
                className='btn btn-icon btn-sm btn-light-danger ms-2'
                onClick={() => setItemIdForUpdate(undefined)}
              >
                <KTIcon iconName='cross' className='fs-1' />
              </button>
            </div>
            <div className='modal-body scroll-y mx-5 mx-xl-15 my-7'>
              <form onSubmit={formik.handleSubmit} noValidate>
                {/* Nombre */}
                <div className='fv-row mb-7'>
                  <label className='required fw-bold fs-6 mb-2'>Nombre del Bloque</label>
                  <input
                    type='text'
                    className={`form-control form-control-solid mb-3 mb-lg-0 ${
                      formik.touched.nombre && formik.errors.nombre ? 'is-invalid' : ''
                    }`}
                    placeholder='Ej: Bloque B, Emblemático...'
                    {...formik.getFieldProps('nombre')}
                  />
                  {formik.touched.nombre && formik.errors.nombre && (
                    <div className='fv-plugins-message-container'>
                      <span role='alert' className='text-danger'>{formik.errors.nombre}</span>
                    </div>
                  )}
                </div>

                {/* Descripción */}
                <div className='fv-row mb-7'>
                  <label className='fw-bold fs-6 mb-2'>Descripción</label>
                  <textarea
                    className='form-control form-control-solid'
                    rows={3}
                    placeholder='Descripción opcional del bloque/área...'
                    {...formik.getFieldProps('descripcion')}
                  />
                </div>

                <div className='text-end pt-5'>
                  <button
                    type='button'
                    className='btn btn-light me-3'
                    onClick={() => setItemIdForUpdate(undefined)}
                  >
                    Cancelar
                  </button>
                  <button type='submit' className='btn btn-primary' disabled={loading || !formik.isValid}>
                    {loading ? (
                      <span className='indicator-progress' style={{display: 'block'}}>
                        Guardando...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    ) : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className='modal-backdrop fade show'></div>
    </>
  )
}

export {EditModal}
