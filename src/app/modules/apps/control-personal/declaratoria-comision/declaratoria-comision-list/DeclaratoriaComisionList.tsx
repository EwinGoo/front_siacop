import {ListViewProvider} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {ListHeader} from './components/header/ListHeader'
import {DeclaratoriaComisionTable} from './table/DeclaratoriaComisionTable'
import {EditModal} from './form-edit-modal/EditModal'
import {KTCard} from 'src/_metronic/helpers'
import {useModalManager} from './hooks/useModalManager'
import PDFModal from './pdf-modal/PDFModal'
import DataViewModal from './data-view-modal/DataViewModal'
import ViewportSize from './table/ViewportSize'
import { ListColumnVisibilitySelector } from './components/header/ListColumnVisibilitySelector'

const DeclaratoriaComisionList = () => {
  const {
    handleShowPDF,
    handleShowData,
    handleSetLoading,
    getLoadingState,
    pdfModalProps,
    dataModalProps
  } = useModalManager()

  return (
    <>
      <KTCard>
        <ListHeader />
        <DeclaratoriaComisionTable 
          onShowPDF={handleShowPDF}
          onShowData={handleShowData}
          onSetLoading={handleSetLoading}
          getLoadingState={getLoadingState}
        />
      </KTCard>
      
      {/* Modal de edición existente */}
      <EditModal />
      
      {/* Modales globales optimizados - Solo UNA instancia */}
      <PDFModal {...pdfModalProps} />
      <DataViewModal {...dataModalProps} />
    </>
  )
}

const DeclaratoriaComisionListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <DeclaratoriaComisionList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {DeclaratoriaComisionListWrapper}