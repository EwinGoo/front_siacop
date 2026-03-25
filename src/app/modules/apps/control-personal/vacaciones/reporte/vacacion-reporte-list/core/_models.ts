import {ID} from 'src/_metronic/helpers'

export type ListViewContextProps = {
  selected: Array<ID>
  itemIdForUpdate?: ID
  setItemIdForUpdate: (id: ID) => void
  isShow: boolean
  setIsShow: (show: boolean) => void
  accion?: 'report'
  setAccion: (accion: 'report' | undefined) => void
}

export const initialListView: ListViewContextProps = {
  selected: [],
  itemIdForUpdate: undefined,
  setItemIdForUpdate: () => {},
  isShow: false,
  setIsShow: () => {},
  accion: undefined,
  setAccion: () => {},
}
