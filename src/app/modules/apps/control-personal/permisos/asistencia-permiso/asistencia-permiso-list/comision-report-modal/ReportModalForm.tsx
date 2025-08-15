import {FormikProps} from 'formik'
import Flatpickr from 'react-flatpickr'
import {Spanish} from 'flatpickr/dist/l10n/es'
import {SelectField} from 'src/app/modules/components/SelectField'
import {TipoPermiso} from '../../../tipos-permisos/list/core/_models'
import {DatePickerField} from 'src/app/modules/components/DatePickerField'

const estadoOptions = [
  {value: 'TODO', label: 'Todo'},
  {value: 'GENERADO', label: 'Generado'},
  {value: 'ENVIADO', label: 'Enviado'},
  {value: 'RECEPCIONADO', label: 'Recepcionado'},
  {value: 'APROBADO', label: 'Aprobado'},
  {value: 'OBSERVADO', label: 'Observado'},
]

export const ReportModalForm = ({
  formik,
  onClose,
  tiposPermisos,
}: {
  formik: FormikProps<any>
  onClose: () => void
  tiposPermisos: TipoPermiso[]
}) => {
  const getFieldError = (fieldName: string) => {
    return formik.errors[fieldName]
  }
  const isFieldValid = (fieldName: string) => {
    return !(formik.touched[fieldName] && getFieldError(fieldName))
  }

  const tipoOptions = [
    {value: 'TODO', label: 'Todo'},
    ...tiposPermisos.map((tipo) => ({
      value: tipo.id_tipo_permiso!.toString(),
      label: tipo.nombre,
    })),
  ]
  const handleChange = (fieldName: string) => (value: any) => {
    formik.setFieldValue(fieldName, value)
    // clearFieldError(fieldName)
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='modal-body py-0'>
        <div className='row mb-4'>
          <p className='text-muted mb-4'>
            Seleccione el rango de fechas para generar el reporte de boletas recepcionadas.
          </p>
          <div className='col-md-6'>
            <label className='form-label fw-semibold'>📅 Fecha de inicio</label>
            <DatePickerField
              field={formik.getFieldProps('fechaInicio')}
              form={formik}
              isFieldValid={isFieldValid('fechaInicio')}
              isSubmitting={formik.isSubmitting}
              onChange={handleChange('fechaInicio')}
              onBlur={() => formik.setFieldTouched('fechaInicio', true)}
            />
          </div>
          <div className='col-md-6'>
            <label className='form-label fw-semibold'>📅 Fecha de fin</label>
            <DatePickerField
              field={formik.getFieldProps('fechaFin')}
              form={formik}
              isFieldValid={isFieldValid('fechaFin')}
              isSubmitting={formik.isSubmitting}
              onChange={handleChange('fechaFin')}
              onBlur={() => formik.setFieldTouched('fechaFin', true)}
            />
          </div>
          {/* <div className='col-md-6 mb-4 mt-4'>
            <label className='form-label fw-semibold'>📝 Estado</label>
            <SelectField
              field={formik.getFieldProps('estado')}
              form={formik}
              isFieldValid={isFieldValid('estado')}
              isSubmitting={formik.isSubmitting}
              options={estadoOptions}
              placeholder='Seleccione estado'
            />
          </div>

          <div className='col-md-6 mb-4 mt-4'>
            <label className='form-label fw-semibold'>🚗 Tipo de Permiso</label>
            <SelectField
              field={formik.getFieldProps('tipoPermiso')}
              form={formik}
              isFieldValid={isFieldValid('tipoPermiso')}
              isSubmitting={formik.isSubmitting}
              options={tipoOptions}
              placeholder='Seleccione tipo'
            />
          </div> */}
        </div>
      </div>

      <div className='modal-footer'>
        <button type='button' className='btn btn-light' onClick={onClose}>
          <i className='bi bi-x-circle me-2'></i> Cancelar
        </button>
        <button type='submit' className='btn btn-primary'>
          <i className='bi bi-file-earmark-bar-graph me-2'></i> Generar Reporte
        </button>
      </div>
    </form>
  )
}
