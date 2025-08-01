import {useFormik} from 'formik'
import {ObservarFormValues} from '../types'
import {ObservarSchema} from '../schemas/observarSchema'
import {procesarEstadoComision} from '../../core/_requests'
import {useQueryClient} from 'react-query'
import {QUERIES} from 'src/_metronic/helpers'
import {toast} from 'react-toastify'
import Swal from 'sweetalert2'
import { useQueryResponse } from '../../core/QueryResponseProvider'

export const useObservarComision = (comisionId?: number,observacionInicial: string = '', onSuccess?: () => void) => {
  const queryClient = useQueryClient()
  const {query} = useQueryResponse()
  const formik = useFormik<ObservarFormValues>({
    enableReinitialize: true,
    initialValues: {
      code: comisionId || null,
      action: 'observe',
      observacion: observacionInicial
    },
    validationSchema: ObservarSchema,
    onSubmit: async (values, {setSubmitting}) => {
      try {
        if (!values.code) return

        await procesarEstadoComision(values)
        await queryClient.invalidateQueries([`${QUERIES.COMISIONES_LIST}-${query}`])

        toast.success('Observación enviada correctamente')
        onSuccess?.()
      } catch (error: any) {
        Swal.fire('Error', error.message || 'Error al enviar la observación', 'error')
      } finally {
        setSubmitting(false)
      }
    },
  })

  return {
    formik,
    resetForm: () => formik.resetForm(),
  }
}
