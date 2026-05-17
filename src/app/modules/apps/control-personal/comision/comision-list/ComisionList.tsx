import {ListViewProvider} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {ListHeader} from './components/header/ListHeader'
import {ComisionTable} from './table/ComisionTable'
import {EditModal} from './comision-edit-modal/EditModal'
import {KTCard} from '../../../../../../_metronic/helpers'
import {ReportModal} from './comision-report-modal/ReportModal'
import {ObservarModal} from './comison-observar-modal/ObservarModal'
import {ViewModal} from './comision-view-modal/ViewModal'
import {useComisionPDFModal} from './hooks/useComisionPDFModal'
import PDFModal from './pdf-modal/PDFModal'

const ComisionList = () => {
  const {handleShowPDF, pdfModalProps} = useComisionPDFModal()

  return (
    <>
      <KTCard>
        <ListHeader />
        <ComisionTable onShowPDF={handleShowPDF} />
      </KTCard>
      <EditModal />
      <ObservarModal />
      <ReportModal onShowPDF={handleShowPDF} />
      <ViewModal />
      <PDFModal {...pdfModalProps} />
    </>
  )
}

const ComisionListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ComisionList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {ComisionListWrapper}
