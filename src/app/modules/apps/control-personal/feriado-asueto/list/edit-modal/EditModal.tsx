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
  return (
    <>
      <Modal
        show={isShow}
        onHide={handleClose}
        centered
        size='lg'
        backdrop='static'
        keyboard={false}
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
}

export {EditModal}
