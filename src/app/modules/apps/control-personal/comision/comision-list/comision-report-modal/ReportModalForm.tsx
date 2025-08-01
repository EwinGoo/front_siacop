import {FormikProps} from 'formik'
import Flatpickr from 'react-flatpickr'
import Select from 'react-select'
import {Spanish} from 'flatpickr/dist/l10n/es'
import {SelectField} from 'src/app/modules/components/SelectField'

const estadoOptions = [
  {value: 'TODO', label: 'Todo'},
  {value: 'GENERADO', label: 'Generado'},
  {value: 'RECEPCIONADO', label: 'Recepcionado'},
  {value: 'APROBADO', label: 'Aprobado'},
  {value: 'OBSERVADO', label: 'Observado'},
]

const tipoComisionOptions = [
  {value: 'TODO', label: 'Todo'},
  {value: 'COMISION', label: 'Personal'},
  {value: 'TRANSPORTE', label: 'Transporte'},
]

export const ReportModalForm = ({
  formik,
  onClose,
}: {
  formik: FormikProps<any>
  onClose: () => void
}) => {
  const getFieldError = (fieldName: string) => {
    // return formik.errors[fieldName] || backendErrors[fieldName]
    return formik.errors[fieldName]
  }
  const isFieldValid = (fieldName: string) => {
    return !(formik.touched[fieldName] && getFieldError(fieldName))
  }
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='modal-body'>
        <div className='row mb-4'>
          <div className='col-md-6'>
            <label className='form-label fw-semibold'>📅 Fecha de inicio</label>
            <Flatpickr
              className='form-control form-control-sm'
              value={formik.values.fechaInicio}
              onChange={(date) => formik.setFieldValue('fechaInicio', date)}
              options={{
                dateFormat: 'Y-m-d',
                locale: Spanish,
                monthSelectorType: 'static',
              }}
            />
          </div>
          <div className='col-md-6'>
            <label className='form-label fw-semibold'>📅 Fecha de fin</label>
            <Flatpickr
              className='form-control form-control-sm'
              value={formik.values.fechaFin}
              onChange={(date) => formik.setFieldValue('fechaFin', date)}
              options={{
                dateFormat: 'Y-m-d',
                locale: Spanish,
                monthSelectorType: 'static',
              }}
            />
          </div>
          <div className='col-md-6 mb-4 mt-4'>
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
            <label className='form-label fw-semibold'>🚗 Tipo de Comisión</label>
            <SelectField
              field={formik.getFieldProps('tipoComision')}
              form={formik}
              isFieldValid={isFieldValid('tipoComision')}
              isSubmitting={formik.isSubmitting}
              options={tipoComisionOptions}
              placeholder='Seleccione tipo'
            />
          </div>
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
