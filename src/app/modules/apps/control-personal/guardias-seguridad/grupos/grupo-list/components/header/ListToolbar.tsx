import {useListView} from '../../core/ListViewProvider'
import {usePermissions} from 'src/app/modules/auth/hooks/usePermissions'

const ListToolbar = () => {
  const {setItemIdForUpdate} = useListView()
  const {guardiaSeguridad} = usePermissions()

  return (
    <div className='d-flex justify-content-end'>
      {guardiaSeguridad.canManage && (
        <button type='button' className='btn btn-primary' onClick={() => setItemIdForUpdate(null)}>
          <i className='ki-duotone ki-plus fs-2'></i>
          Nuevo Grupo
        </button>
      )}
    </div>
  )
}

export {ListToolbar}
