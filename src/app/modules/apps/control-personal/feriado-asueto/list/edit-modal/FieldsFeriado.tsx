// aqui pon una compnente con campo
import Flatpickr from 'react-flatpickr'
import {Spanish} from 'flatpickr/dist/l10n/es'
import clsx from 'clsx'

export const FieldsFeriado = ({ formik, isFieldValid, getFieldError }) => (
  <div className='row mb-7'>
    <div className='col-md-6 fv-row'>
      <label className='required fw-bold fs-6 mb-2'>Fecha Inicio</label>
      <Flatpickr
        value={formik.values.fecha_inicio}
        onChange={([date]) => formik.setFieldValue('fecha_inicio', date)}
        options={{
          dateFormat: 'Y-m-d',
          locale: Spanish,
          static: true,
          appendTo: document.body,
        }}
        className={clsx('form-control form-control-solid', {
          'is-invalid': !isFieldValid('fecha_inicio'),
          'is-valid': formik.touched.fecha_inicio && isFieldValid('fecha_inicio'),
        })}
        disabled={formik.isSubmitting}
      />
      {!isFieldValid('fecha_inicio') && (
        <div className='fv-plugins-message-container'>
          <span role='alert'>{getFieldError('fecha_inicio')}</span>
        </div>
      )}
    </div>
    <div className='col-md-6 fv-row'>
      <label className='required fw-bold fs-6 mb-2'>Fecha Fin</label>
      <Flatpickr
        value={formik.values.fecha_fin}
        onChange={([date]) => formik.setFieldValue('fecha_fin', date)}
        options={{
          dateFormat: 'Y-m-d',
          locale: Spanish,
          static: true,
          appendTo: document.body,
        }}
        className={clsx('form-control form-control-solid', {
          'is-invalid': !isFieldValid('fecha_fin'),
          'is-valid': formik.touched.fecha_fin && isFieldValid('fecha_fin'),
        })}
        disabled={formik.isSubmitting}
      />
      {!isFieldValid('fecha_fin') && (
        <div className='fv-plugins-message-container'>
          <span role='alert'>{getFieldError('fecha_fin')}</span>
        </div>
      )}
    </div>
  </div>
)
