import {ListViewProvider} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {ListHeader} from './components/header/ListHeader'
import {DeclaratoriaComisionTable} from './table/DeclaratoriaComisionTable'
import {EditModal} from './declaratoria-comision-edit-modal/EditModal'
import {KTCard} from 'src/_metronic/helpers'

const DeclaratoriaComisionList = () => {

  return (
    <>
      <KTCard>
        <ListHeader />
        <DeclaratoriaComisionTable />
      </KTCard>
      <EditModal />
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
