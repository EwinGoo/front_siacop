import {useEffect, useState} from 'react'
import {EditModalHeader} from './EditModalHeader'
import {EditModalFormWrapper} from './EditModalFormWrapper'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import {useListView} from '../core/ListViewProvider'

const EditModal = () => {
  const {setItemIdForUpdate, setIsShow, isShow} = useListView()
  // const [show, setShow] = useState(false);
  const handleClose = () => {
    setIsShow(false)
    setItemIdForUpdate(undefined)
  }
  // console.log(setItemIdForUpdate);

  // useEffect(() => {
  //   document.body.classList.add('modal-open')
  //   return () => {
  //     document.body.classList.remove('modal-open')
  //   }
  // }, [])
  return (
    <>
      <Modal
        show={isShow}
        onHide={handleClose}
        centered
        size='lg' // Equivalente a mw-650px
        backdrop='static' // Para evitar que se cierre haciendo clic fuera
        keyboard={false} // Para evitar que se cierre con ESC
      >
        <Modal.Header>
          <EditModalHeader onClose = {handleClose}/>
        </Modal.Header>

        <Modal.Body className='py-0 px-5 px-xl-15'>
          <EditModalFormWrapper  onClose={handleClose} />
        </Modal.Body>
        <Modal.Footer style={{borderTop: 'none'}}></Modal.Footer>
      </Modal>
    </>
  )
  // return (
  //   <>
  //     <div
  //       className='modal fade show d-block'
  //       id='kt_modal_add_user'
  //       role='dialog'
  //       tabIndex={-1}
  //       aria-modal='true'
  //     >
  //       {/* begin::Modal dialog */}
  //       <div className='modal-dialog modal-dialog-centered mw-650px'>
  //         {/* begin::Modal content */}
  //         <div className='modal-content'>
  //           <EditModalHeader />
  //           {/* begin::Modal body */}
  //           <div className='modal-body scroll-y mx-5 mx-xl-15 my-7'>
  //             <EditModalFormWrapper />
  //           </div>
  //           {/* end::Modal body */}
  //         </div>
  //         {/* end::Modal content */}
  //       </div>
  //       {/* end::Modal dialog */}
  //     </div>
  //     {/* begin::Modal Backdrop */}
  //     <div className='modal-backdrop fade show'></div>
  //     {/* end::Modal Backdrop */}
  //   </>
  // )
}

export {EditModal}
