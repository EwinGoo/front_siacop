import {useState} from 'react'
import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {ListHeader} from './components/header/ListHeader'
import {TipoPermisoTable} from './table/TipoPermisoTable'
import {EditModal} from './edit-modal/EditModal'
import {KTCard} from '../../../../../../../_metronic/helpers'

const TipoPermisoList = () => {
  const {itemIdForUpdate} = useListView()

  return (
    <>
      <KTCard>
        <ListHeader />
        <TipoPermisoTable />
      </KTCard>
      {/* {itemIdForUpdate !== undefined && <EditModal />} */}
      <EditModal />
    </>
  )
}

const TipoPermisoListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <TipoPermisoList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {TipoPermisoListWrapper}
