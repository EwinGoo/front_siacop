import { Modal } from 'react-bootstrap'
import {KTIcon} from '../../../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'

const EditModalHeader = ({onClose}) => {
  const {itemIdForUpdate} = useListView();

  return (
    <>
      {/* begin::Modal title */}
      {/* <h2 className='fw-bolder'>Add User</h2> */}
      <Modal.Title className="fw-bold fs-2">{itemIdForUpdate ==null ? 'Agregar':'Editar'} Permiso</Modal.Title>
      {/* end::Modal title */}

      {/* begin::Close */}
      <div
        className='btn btn-icon btn-sm btn-active-icon-primary'
        data-kt-users-modal-action='close'
        onClick={onClose}
        style={{cursor: 'pointer'}}
      >
        <KTIcon iconName='cross' className='fs-1' />
      </div>
      {/* end::Close */}
    </>
  )
}

export {EditModalHeader}
