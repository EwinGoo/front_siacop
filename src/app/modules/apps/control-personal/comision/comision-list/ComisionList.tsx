import {ListViewProvider} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {ListHeader} from './components/header/ListHeader'
import {ComisionTable} from './table/ComisionTable'
import {EditModal} from './comision-edit-modal/EditModal'
import {KTCard} from '../../../../../../_metronic/helpers'
import { ReportModal } from './comision-report-modal/ReportModal'
import { ObservarModal } from './comison-observar-modal/ObservarModal'

const ComisionList = () => {
  return (
    <>
      <KTCard>
        <ListHeader />
        <ComisionTable />
      </KTCard>
      <EditModal />
      <ObservarModal />
      <ReportModal />
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
