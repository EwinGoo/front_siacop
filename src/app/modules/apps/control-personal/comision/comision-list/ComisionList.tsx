import {useState} from 'react'
import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {ListHeader} from './components/header/ListHeader'
import {ComisionTable} from './table/ComisionTable'
import {EditModal} from './comision-edit-modal/EditModal'
// import {TipoComisionModal} from './comision-edit-modal/TipoComisionModal'
import {KTCard} from '../../../../../../_metronic/helpers'

const ComisionList = () => {
  const {itemIdForUpdate} = useListView()

  return (
    <>
      <KTCard>
        <ListHeader />
        <ComisionTable />
      </KTCard>
      {/* {itemIdForUpdate !== undefined && <EditModal />} */}
      <EditModal />
      {/* <TipoComisionModal /> */}
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
