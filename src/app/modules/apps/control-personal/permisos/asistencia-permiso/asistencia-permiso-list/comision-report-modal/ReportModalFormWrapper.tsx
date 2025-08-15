import {getLocalDate} from 'src/app/hooks/useDateFormatter'
import { getTiposPermiso} from '../core/_requests'
import {ReportModalForm} from './ReportModalForm'
import {useFormik} from 'formik'
import {useQuery} from 'react-query'
import { API_ROUTES } from 'src/app/config/apiRoutes'

export const ReportModalFormWrapper = ({onClose}) => {
  const formik = useFormik({
    initialValues: {
      fechaInicio: getLocalDate(),
      fechaFin: getLocalDate(),
      estado: 'TODO',
      tipoPermiso: 'TODO',
    },
    onSubmit: (values) => {
      // Crear formulario dinámico
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = API_ROUTES.REPORTES.PERMISO.GENERAL
      form.target = '_blank' // Muy importante para que se abra en nueva pestaña

      // Agregar campos como inputs ocultos
      const addInput = (name: string, value: string) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = name
        input.value = value
        form.appendChild(input)
      }

      addInput('fechaInicio', formatDate(values.fechaInicio))
      addInput('fechaFin', formatDate(values.fechaFin))
      addInput('estado', values.estado)
      addInput('tipoPermiso', values.tipoPermiso)

      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)

      onClose()
    },
  })

  const {data: tiposPermiso = []} = useQuery('tipos-permiso', getTiposPermiso, {
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  })

  return <ReportModalForm formik={formik} tiposPermisos={tiposPermiso} onClose={onClose} />
}

function formatDate(date: any): string {
  if (Array.isArray(date)) {
    const d = date[0]
    return d?.toISOString().split('T')[0] || ''
  }

  if (date instanceof Date) {
    return date.toISOString().split('T')[0]
  }

  return date
}
