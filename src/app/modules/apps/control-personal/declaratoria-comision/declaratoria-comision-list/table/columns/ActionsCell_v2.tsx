/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect, useState} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import {MenuComponent} from '../../../../../../../../_metronic/assets/ts/components'
import {ID, KTIcon, QUERIES} from '../../../../../../../../_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {DECLARATORIA_URL, deleteDeclaratoriaComision, imprimirDeclaratoriaComision} from '../../core/_requests'
import {showConfirmDialog} from 'src/app/utils/swalHelpers.ts'
import {showToast} from 'src/app/utils/toastHelper'
import PDFModal from '../../pdf-modal/PDFModal'
import DataViewModal from '../../data-view-modal/DataViewModal'

const ActionsCell = ({declaratoria}) => {
  const {setItemIdForUpdate, setIsShow} = useListView()
  const {query} = useQueryResponse()
  const queryClient = useQueryClient()
  
  // Estado para el modal del PDF
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [pdfData, setPdfData] = useState({
    base64: '',
    filename: '',
    isLoading: false
  })

  // Estado para el modal de vista de datos
  const [showDataModal, setShowDataModal] = useState(false)

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const openEditModal = async () => {
    setItemIdForUpdate(declaratoria.id_declaratoria_comision)
    setIsShow(true)
  }

  const deleteItem = useMutation(
    () => deleteDeclaratoriaComision(declaratoria.id_declaratoria_comision),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`${QUERIES.DECLARATORIA_COMISION_LIST}-${query}`])
        showToast({
          message: 'Declaratoria comisión eliminada correctamente',
          type: 'success',
        })
      },
      onError: (error: any) => {
        showToast({
          message: error.response?.data?.message || 'Error al eliminar la declaratoria comisión',
          type: 'error',
        })
      },
    }
  )

  const printMutation = useMutation(
    () => imprimirDeclaratoriaComision(declaratoria.hash),
    {
      onMutate: () => {
        setPdfData(prev => ({ ...prev, isLoading: true }))
      },
      onSuccess: (response) => {
        setPdfData({
          base64: response.pdf_base64,
          filename: response.filename,
          isLoading: false
        })
        setShowPDFModal(true)
        
        // Si el estado era GENERADO, actualizar la lista
        if (declaratoria.estado === 'GENERADO') {
          queryClient.invalidateQueries([`${QUERIES.DECLARATORIA_COMISION_LIST}-${query}`])
          showToast({
            message: 'Declaratoria emitida correctamente',
            type: 'success'
          })
        }
      },
      onError: (error: any) => {
        setPdfData(prev => ({ ...prev, isLoading: false }))
        showToast({
          message: error.response?.data?.message || 'Error al generar el PDF',
          type: 'error'
        })
      }
    }
  )

  const handlePrintConfirm = async () => {
    try {
      if (declaratoria.estado === 'GENERADO') {
        const result = await showConfirmDialog({
          title: '¿Está seguro?',
          html: '<div>Una vez que imprima, la comisión <strong>no podrá ser modificada</strong> y se marcará como </div><span class="badge badge-light-success fs-5 mt-3">EMITIDO</span>',
          icon: 'warning',
          confirmButtonText: 'Sí, imprimir',
        })
        
        if (!result?.isConfirmed) {
          return
        }
      }

      // Ejecutar la mutación para generar el PDF
      printMutation.mutate()
      
    } catch (error) {
      showToast({message: 'Error al procesar la impresión', type: 'error'})
    }
  }

  const handleDelete = async () => {
    try {
      const result = await showConfirmDialog({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esta acción!',
        icon: 'warning',
        confirmButtonText: 'Sí, eliminar',
      })

      if (result.isConfirmed) {
        await deleteItem.mutateAsync()
      }
    } catch (error) {
      // Error is already handled in onError
    }
  }

  const handleClosePDFModal = () => {
    setShowPDFModal(false)
    setPdfData({ base64: '', filename: '', isLoading: false })
  }

  const handleOpenDataModal = () => {
    setShowDataModal(true)
  }

  const handleCloseDataModal = () => {
    setShowDataModal(false)
  }

  return (
    <>
      <a
        href='#'
        className='btn btn-light btn-active-light-primary btn-sm'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-end'
      >
        Acciones
        <KTIcon iconName='down' className='fs-5 m-0' />
      </a>
      
      {/* begin::Menu */}
      <div
        className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-150px py-4'
        data-kt-menu='true'
      >
        {/* Imprimir action */}
        <div className='menu-item px-3'>
          <a 
            href='#' 
            className='menu-link px-3' 
            onClick={handlePrintConfirm}
            style={{ opacity: pdfData.isLoading ? 0.6 : 1 }}
          >
            {pdfData.isLoading ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                Generando...
              </>
            ) : (
              <>
                <i className='las la-print fs-5 me-2'></i> Imprimir
              </>
            )}
          </a>
        </div>

        {/* Ver datos action */}
        <div className='menu-item px-3'>
          <a href='#' className='menu-link px-3' onClick={handleOpenDataModal}>
            <i className='las la-eye fs-5 me-2'></i> Ver datos
          </a>
        </div>

        {/* Edit action */}
        {declaratoria.estado === 'GENERADO' && (
          <div className='menu-item px-3'>
            <a className='menu-link px-3' onClick={openEditModal}>
              <i className='las la-edit fs-5 me-2'></i> Editar
            </a>
          </div>
        )}

        {/* Delete action */}
        {declaratoria.estado === 'GENERADO' && (
          <div className='menu-item px-3'>
            <a className='menu-link px-3' onClick={handleDelete}>
              <i className='las la-trash-alt fs-5 me-2'></i> Eliminar
            </a>
          </div>
        )}
      </div>
      {/* end::Menu */}

      {/* PDF Modal */}
      <PDFModal
        isOpen={showPDFModal}
        onClose={handleClosePDFModal}
        pdfBase64={pdfData.base64}
        filename={pdfData.filename}
        title="Declaratoria de Comisión"
      />

      {/* Data View Modal */}
      <DataViewModal
        isOpen={showDataModal}
        onClose={handleCloseDataModal}
        declaratoria={declaratoria}
      />
    </>
  )
}

export {ActionsCell}