// aqui pon una compnente con campo
import Flatpickr from 'react-flatpickr'
import {Spanish} from 'flatpickr/dist/l10n/es'
import clsx from 'clsx'

export const FieldsAsueto = ({ formik, isFieldValid, getFieldError }) => (
    <div className='fv-row mb-7 px-1'>
      <label className={`fw-bold fs-6 mb-2 required`}>Fecha del Evento</label>
      <Flatpickr
        value={formik.values.fecha_evento}
        onChange={([date]) => formik.setFieldValue('fecha_evento', date)}
        options={{
          dateFormat: 'Y-m-d',
          locale: Spanish,
        }}
        className={clsx('d-block form-control form-control-solid', {
          'is-invalid': !isFieldValid('fecha_evento'),
          'is-valid': formik.touched.fecha_evento && isFieldValid('fecha_evento'),
        })}
        disabled={formik.isSubmitting || formik.values.tipo_evento !== 'ASUETO'}
      />
      {formik.values.tipo_evento === 'ASUETO' && !isFieldValid('fecha_evento') && (
        <div className='fv-plugins-message-container'>
          <span role='alert'>{getFieldError('fecha_evento')}</span>
        </div>
      )}
    </div>
  )