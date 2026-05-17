import {getLocalDate} from 'src/app/hooks/useDateFormatter'
import {generarReporteGeneralPermiso, getTiposPermiso} from '../core/_requests'
import {ReportModalForm} from './ReportModalForm'
import {useFormik} from 'formik'
import {useQuery} from 'react-query'
import {reportValidationSchema} from './schema/reportValidationSchema'
import {PermisoPDFData} from '../core/_models'
import {showToast} from 'src/app/utils/toastHelper'

type Props = {
  onClose: () => void
  onShowPDF: (pdfData: PermisoPDFData) => void
}

export const ReportModalFormWrapper = ({onClose, onShowPDF}: Props) => {
  const formik = useFormik({
    validationSchema: reportValidationSchema,
    initialValues: {
      fechaInicio: getLocalDate(),
      fechaFin: getLocalDate(),
      estado: 'TODO',
      tipoPermiso: 'TODO',
    },
    onSubmit: async (values, helpers) => {
      try {
        const pdfData = await generarReporteGeneralPermiso({
          fechaInicio: formatDate(values.fechaInicio),
          fechaFin: formatDate(values.fechaFin),
          estado: values.estado,
          tipoPermiso: values.tipoPermiso,
        })

        onClose()
        onShowPDF(pdfData)
      } catch (error: any) {
        showToast({
          message: error?.message || 'No se pudo generar el reporte. Intente más tarde.',
          type: 'error',
        })
      } finally {
        helpers.setSubmitting(false)
      }
    },
  })

  const {data: tiposPermiso = []} = useQuery('asistencia-tipos-permiso', getTiposPermiso, {
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
