import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {ListHeader} from './components/header/ListHeader'
import {BloqueTable} from './table/BloqueTable'
import {EditModal} from './edit-modal/EditModal'
import {KTCard} from '../../../../../../../_metronic/helpers'

const BloqueList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <ListHeader />
        <BloqueTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <EditModal />}
    </>
  )
}

const BloqueListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <BloqueList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {BloqueListWrapper}
