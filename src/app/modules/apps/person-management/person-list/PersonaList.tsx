import {useState} from 'react'
import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {ListHeader} from './components/header/ListHeader'
import {PersonaTable} from './table/PersonaTable'
import {EditModal} from './person-edit-modal/EditModal'
import {KTCard} from '../../../../../_metronic/helpers'
// import {KTCard} from '@/_metronic/helpers'

const PersonaList = () => {
  const {itemIdForUpdate} = useListView()

  // const [show, setShow] = useState(false)
  // console.log(itemIdForUpdate);
  

  return (
    <>
      <KTCard>
        <ListHeader />
        <PersonaTable />
      </KTCard>
      {/* {itemIdForUpdate !== undefined && <EditModal />} */}
      <EditModal />
    </>
  )
}

const PersonaListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <PersonaList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {PersonaListWrapper}
