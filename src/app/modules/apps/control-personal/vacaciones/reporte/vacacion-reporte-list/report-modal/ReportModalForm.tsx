import {FormikProps} from 'formik'
import {SelectField} from 'src/app/modules/components/SelectField'
import {DatePickerField} from 'src/app/modules/components/DatePickerField'

const ESTADO_OPTIONS = [
  {value: 'TODAS',        label: 'Todas'},
  {value: 'GENERADO',     label: 'Generado'},
  {value: 'ENVIADO',      label: 'Enviado'},
  {value: 'RECEPCIONADO', label: 'Recepcionado'},
  {value: 'APROBADO',     label: 'Aprobado'},
  {value: 'OBSERVADO',    label: 'Observado'},
]

const TIPO_OPTIONS = [
  {value: '',                   label: 'Todos'},
  {value: 'INDIVIDUAL',         label: 'Individual'},
  {value: 'VACACION COLECTIVA', label: 'Vacación Colectiva'},
]

export const ReportModalForm = ({
  formik,
  onClose,
}: {
  formik: FormikProps<any>
  onClose: () => void
}) => {
  const getFieldError = (name: string) => formik.errors[name]
  const isFieldValid  = (name: string) => !(formik.touched[name] && getFieldError(name))
  const handleChange  = (name: string) => (value: any) => formik.setFieldValue(name, value)

  const esRecepcion = formik.values.tipo_reporte === 'recepcion'

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('tipo_reporte', e.target.checked ? 'recepcion' : 'general')
    // Al activar recepción el estado se fuerza en el backend, pero limpiamos el selector
    if (e.target.checked) {
      formik.setFieldValue('estado_vacacion', 'RECEPCIONADO')
    } else {
      formik.setFieldValue('estado_vacacion', 'TODAS')
    }
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='modal-body py-0'>

        {/* Selector de tipo de reporte */}
        <div className='mb-5 p-4 rounded border border-dashed border-primary bg-light-primary'>
          <div className='form-check form-switch form-check-custom form-check-solid'>
            <input
              className='form-check-input'
              type='checkbox'
              id='chkTipoReporte'
              checked={esRecepcion}
              onChange={handleCheckboxChange}
            />
            <label className='form-check-label fw-semibold ms-3' htmlFor='chkTipoReporte'>
              {esRecepcion
                ? 'Reporte de Recepción (con correlativo y sello)'
                : 'Reporte General (todos los estados)'}
            </label>
          </div>
          {esRecepcion && (
            <p className='text-primary mb-0 mt-2 fs-7'>
              Solo incluirá vacaciones con estado <strong>RECEPCIONADO</strong>, con su correlativo y recuadro de firma.
            </p>
          )}
        </div>

        <p className='text-muted mb-4'>
          {esRecepcion
            ? 'Seleccione el rango de fechas de recepción.'
            : 'Seleccione los filtros para el reporte.'}
        </p>

        {/* Fechas */}
        <div className='row mb-4'>
          <div className='col-md-6'>
            <label className='form-label fw-semibold'>Fecha de inicio</label>
            <DatePickerField
              field={formik.getFieldProps('fecha_desde')}
              form={formik}
              isFieldValid={isFieldValid('fecha_desde')}
              isSubmitting={formik.isSubmitting}
              onChange={handleChange('fecha_desde')}
              onBlur={() => formik.setFieldTouched('fecha_desde', true)}
            />
            {!isFieldValid('fecha_desde') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.fecha_desde as string}</span>
              </div>
            )}
          </div>

          <div className='col-md-6'>
            <label className='form-label fw-semibold'>Fecha de fin</label>
            <DatePickerField
              field={formik.getFieldProps('fecha_hasta')}
              form={formik}
              isFieldValid={isFieldValid('fecha_hasta')}
              isSubmitting={formik.isSubmitting}
              onChange={handleChange('fecha_hasta')}
              onBlur={() => formik.setFieldTouched('fecha_hasta', true)}
            />
            {!isFieldValid('fecha_hasta') && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.fecha_hasta as string}</span>
              </div>
            )}
          </div>
        </div>

        {/* Estado y Tipo — solo visibles en reporte general */}
        {!esRecepcion && (
          <div className='row mb-4'>
            <div className='col-md-6'>
              <label className='form-label fw-semibold'>Estado de vacación</label>
              <SelectField
                field={formik.getFieldProps('estado_vacacion')}
                form={formik}
                isFieldValid={isFieldValid('estado_vacacion')}
                isSubmitting={formik.isSubmitting}
                options={ESTADO_OPTIONS}
                placeholder='Seleccione estado'
              />
            </div>

            <div className='col-md-6'>
              <label className='form-label fw-semibold'>Tipo de solicitud</label>
              <SelectField
                field={formik.getFieldProps('tipo_solicitud')}
                form={formik}
                isFieldValid={isFieldValid('tipo_solicitud')}
                isSubmitting={formik.isSubmitting}
                options={TIPO_OPTIONS}
                placeholder='Seleccione tipo'
              />
            </div>
          </div>
        )}
      </div>

      <div className='modal-footer'>
        <button type='button' className='btn btn-light' onClick={onClose}>
          <i className='bi bi-x-circle me-2'></i> Cancelar
        </button>
        <button
          type='submit'
          className={`btn ${esRecepcion ? 'btn-success' : 'btn-primary'}`}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <span className='spinner-border spinner-border-sm me-2'></span>
          ) : (
            <i className='bi bi-file-earmark-pdf me-2'></i>
          )}
          {esRecepcion ? 'Generar Reporte de Recepción' : 'Generar PDF'}
        </button>
      </div>
    </form>
  )
}
