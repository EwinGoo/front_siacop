import {useState} from 'react'
import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {ListHeader} from './components/header/ListHeader'
import {FeriadoAsuetoTable} from './table/FeriadoAsuetoTable'
import {EditModal} from './edit-modal/EditModal'
import {KTCard} from '../../../../../../_metronic/helpers'

const FeriadoAsuetoList = () => {
  const {itemIdForUpdate} = useListView()

  return (
    <>
      <KTCard>
        <ListHeader />
        <FeriadoAsuetoTable />
      </KTCard>
      {/* {itemIdForUpdate !== undefined && <EditModal />} */}
      <EditModal />
    </>
  )
}

const FeriadoAsuetoListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <FeriadoAsuetoList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {FeriadoAsuetoListWrapper}
