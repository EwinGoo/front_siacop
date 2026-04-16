import {FC, useState, createContext, useContext, useMemo} from 'react'
import {ID, calculatedGroupingIsDisabled, calculateIsAllDataSelected, groupingOnSelect, groupingOnSelectAll, WithChildren} from '../../../../../../../../_metronic/helpers'
import {useQueryResponseData} from './QueryResponseProvider'

type ListViewContextProps = {
  selected: Array<ID>
  onSelect: (id: ID) => void
  onSelectAll: () => void
  clearSelected: () => void
  isAllSelected: boolean
  disabled: boolean
  itemIdForUpdate: ID
  setItemIdForUpdate: (id: ID) => void
}

const ListViewContext = createContext<ListViewContextProps>({
  selected: [], onSelect: () => {}, onSelectAll: () => {}, clearSelected: () => {},
  isAllSelected: false, disabled: false, itemIdForUpdate: undefined, setItemIdForUpdate: () => {},
})

const ListViewProvider: FC<WithChildren> = ({children}) => {
  const [selected, setSelected] = useState<Array<ID>>([])
  const [itemIdForUpdate, setItemIdForUpdate] = useState<ID>(undefined)
  const data = useQueryResponseData()
  const disabled = useMemo(() => calculatedGroupingIsDisabled(false, data), [data])
  const isAllSelected = useMemo(() => calculateIsAllDataSelected(data, selected), [data, selected])

  return (
    <ListViewContext.Provider value={{
      selected,
      onSelect: (id) => groupingOnSelect(id, selected, setSelected),
      onSelectAll: () => groupingOnSelectAll(isAllSelected, setSelected, data),
      clearSelected: () => setSelected([]),
      isAllSelected, disabled, itemIdForUpdate, setItemIdForUpdate,
    }}>
      {children}
    </ListViewContext.Provider>
  )
}

const useListView = () => useContext(ListViewContext)
export {ListViewProvider, useListView}
