import { Button } from 'react-bootstrap'
import { KTIcon } from 'src/_metronic/helpers'

interface FormActionsProps {
  onClose: () => void
  isSubmitting: boolean
  isUploading?: boolean
  isValid: boolean
  isEdit?: boolean // opcional: para saber si es guardar o actualizar
}

export const FormActions: React.FC<FormActionsProps> = ({
  onClose,
  isSubmitting,
  isUploading = false,
  isValid,
  isEdit = false,
}) => {
  const loading = isSubmitting || isUploading

  return (
    <div className='text-center pt-5 mb-6'>
      <Button
        variant='light'
        onClick={onClose}
        className='me-3'
        disabled={loading}
      >
        <KTIcon iconName='cross' className='fs-2' />
        Cancelar
      </Button>

      <Button
        variant='primary'
        type='submit'
        disabled={loading || !isValid}
      >
        {loading ? (
          <>
            {isUploading ? 'Subiendo archivo...' : 'Procesando...'}
            <span className='spinner-border spinner-border-sm ms-2' />
          </>
        ) : (
          <>
            <KTIcon iconName='check' className='fs-2 me-1' />
            {isEdit ? 'Actualizar' : 'Guardar'}
          </>
        )}
      </Button>
    </div>
  )
}
