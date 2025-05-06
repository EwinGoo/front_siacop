import {KTIcon} from '../../../../../../../../../_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {ListFilter} from './ListFilter'
import Button from 'react-bootstrap/Button'
import Tooltip, {TooltipProps, tooltipClasses} from '@mui/material/Tooltip'
import {styled} from '@mui/material/styles'

const ListToolbar = () => {
  const {setItemIdForUpdate, setIsShow} = useListView()
  const openAddModal = () => {
    setItemIdForUpdate(null)
    setIsShow(true)
  }

  return (
    <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      {/* <ListFilter /> */}

      {/* begin::Export */}
      {/* <button type='button' className='btn btn-light-primary me-3'>
        <KTIcon iconName='exit-up' className='fs-2' />
        Export
      </button> */}
      {/* end::Export */}

      {/* begin::Add user */}
      {/* <button type='button' className='btn btn-primary' onClick={openAddUserModal}>
        <KTIcon iconName='plus' className='fs-2' />
        Agrega Persona
      </button> */}
        <Button variant='primary' onClick={openAddModal}>
          <KTIcon iconName='plus' className='fs-2' />
          Agregar Tipo Permiso
        </Button>
      {/* end::Add user */}
    </div>
  )
}

export {ListToolbar}
