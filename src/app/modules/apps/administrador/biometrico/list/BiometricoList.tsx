import {useState} from 'react'
import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {ListHeader} from './components/header/ListHeader'
import {BiometricoTable} from './table/BiometricoTable'
import {EditModal} from './edit-modal/EditModal'
import {KTCard} from '../../../../../../_metronic/helpers'

const BiometricoList = () => {
  const {itemIdForUpdate} = useListView()

  return (
    <>
      <KTCard>
        <ListHeader />
        <BiometricoTable />
      </KTCard>
      {/* {itemIdForUpdate !== undefined && <EditModal />} */}
      <EditModal />
    </>
  )
}

const BiometricoListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <BiometricoList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {BiometricoListWrapper}
