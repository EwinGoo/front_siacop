import {FC, useState, createContext, useContext} from 'react'
import {ID, WithChildren} from 'src/_metronic/helpers'
import {ListViewContextProps, initialListView} from './_models'

const ListViewContext = createContext<ListViewContextProps>(initialListView)

const ListViewProvider: FC<WithChildren> = ({children}) => {
  const [selected, setSelected] = useState<Array<ID>>(initialListView.selected)
  const [itemIdForUpdate, setItemIdForUpdate] = useState<ID>(initialListView.itemIdForUpdate)
  const [isShow, setIsShow] = useState<boolean>(false)
  const [accion, setAccion] = useState<'report' | undefined>(undefined)

  return (
    <ListViewContext.Provider
      value={{
        selected,
        itemIdForUpdate,
        setItemIdForUpdate,
        isShow,
        setIsShow,
        accion,
        setAccion,
      }}
    >
      {children}
    </ListViewContext.Provider>
  )
}

const useListView = () => useContext(ListViewContext)

export {ListViewProvider, useListView}
