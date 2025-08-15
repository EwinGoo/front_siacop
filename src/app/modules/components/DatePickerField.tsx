import {useThemeMode} from 'src/_metronic/partials/layout/theme-mode/ThemeModeProvider'
import Flatpickr from 'react-flatpickr'
import {Spanish} from 'flatpickr/dist/l10n/es'
import clsx from 'clsx'
import {formatDate} from 'date-fns'

export const DatePickerField = ({field, form, isFieldValid, onChange, isSubmitting, onBlur}) => {
  const {mode} = useThemeMode()

  const handleClose = () => {
    form.setFieldTouched(field.name, true)
  }
  return (
    <>
      <Flatpickr
        key={field.name}
        className={clsx(
          'form-control form-control-solid',
          {
            'is-invalid': !isFieldValid,
            'is-valid': form.touched[field.name] && isFieldValid,
          },
          mode === 'dark' && 'flatpickr-dark'
        )}
        value={field.value}
        onChange={([date]) => onChange(formatDate(date, 'yyyy-MM-dd'))}
        // onChange={([date]) => onChange(date)}
        options={{
          dateFormat: 'Y-m-d',
          locale: Spanish,
          monthSelectorType: 'static',
          onOpen: () => {
            if (mode === 'dark') {
              setTimeout(() => {
                const calendars = document.querySelectorAll('.flatpickr-calendar')
                calendars.forEach((calendar) => {
                  calendar.classList.add('flatpickr-dark')
                })
              }, 0)
            }
          },
          onClose: handleClose,
        }}
        // onBlur={() => form.setFieldTouched(field.name, true)}
        // onBlur={onBlur}
      />
    </>
  )
}
