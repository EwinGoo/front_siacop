import {useState} from 'react'
import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {ListHeader} from './components/header/ListHeader'
import {AsistenciaPermisoTable} from './table/AsistenciaPermisoTable'
import {EditModal} from './edit-modal/EditModal'
import {KTCard} from '../../../../../../../_metronic/helpers'

const AsistenciaPermisoList = () => {
  const {itemIdForUpdate} = useListView()

  return (
    <>
      <KTCard>
        <ListHeader />
        <AsistenciaPermisoTable />
      </KTCard>
      {/* {itemIdForUpdate !== undefined && <EditModal />} */}
      <EditModal />
    </>
  )
}

const AsistenciaPermisoListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <AsistenciaPermisoList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {AsistenciaPermisoListWrapper}
