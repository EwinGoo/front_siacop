import {KTCard} from 'src/_metronic/helpers'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {ListViewProvider} from './core/ListViewProvider'
import {ListHeader} from './components/header/ListHeader'
import {VacacionReporteTable} from './table/VacacionReporteTable'
import {ReportModal} from './report-modal/ReportModal'

const VacacionReporteList = () => {
  return (
    <>
      <KTCard>
        <ListHeader />
        <VacacionReporteTable />
      </KTCard>
      <ReportModal />
    </>
  )
}

const VacacionReporteListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <VacacionReporteList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {VacacionReporteListWrapper}
