import {Dispatch, SetStateAction} from 'react'

export type ID = undefined | null | number

export type PaginationState = {
  page: number
  items_per_page: 10 | 30 | 50 | 100
  links?: Array<{label: string; active: boolean; url: string | null; page: number | null}>
  currentPage: number
  perPage: number
  pageCount: number
  next: string | null
  previous: string | null
  total?: number
  hasMore?: boolean
}

// Api response model

// export type APIResponse<T = any> = {
//   status: number
//   error: boolean
//   message: string
//   data: T
//   pagination?: PaginationState
// }

// Mi paginate model

// export type PaginationStateModel = {
//   current_page: number
//   per_page: number
//   total: number
//   last_page: number
//   links?: Array<{
//     url: string | null
//     label: string
//     active: boolean
//   }>
// }

export type SortState = {
  sort?: string
  order?: 'asc' | 'desc'
}

export type FilterState = {
  filter?: unknown
}

export type SearchState = {
  search?: string
}

export type Response<T> = {
  data?: T
  payload?: {
    message?: string
    errors?: {
      [key: string]: Array<string>
    }
    pagination?: PaginationState
  }
}

export type QueryState = PaginationState & SortState & FilterState & SearchState

export type QueryRequestContextProps = {
  state: QueryState
  updateState: (updates: Partial<QueryState>) => void
}

export const initialQueryState: PaginationState = {
  page: 1,
  items_per_page: 10,
  currentPage: 1,
  perPage: 10,
  pageCount: 1,
  next: null,
  previous: null,
  links: []
}

export const initialQueryRequest: QueryRequestContextProps = {
  state: initialQueryState,
  updateState: () => {},
}

export type QueryResponseContextProps<T> = {
  response?: Response<Array<T>> | undefined
  refetch: () => void
  isLoading: boolean
  query: string
}

export const initialQueryResponse = {refetch: () => {}, isLoading: false, query: ''}

export type ListViewContextProps = {
  selected: Array<ID>
  onSelect: (selectedId: ID) => void
  onSelectAll: () => void
  clearSelected: () => void
  
  // NULL => (CREATION MODE) | MODAL IS OPENED
  // NUMBER => (EDIT MODE) | MODAL IS OPENED
  // UNDEFINED => MODAL IS CLOSED
  itemIdForUpdate?: ID
  setItemIdForUpdate: Dispatch<SetStateAction<ID>>
  isAllSelected: boolean
  disabled: boolean
  isShow: boolean // Tipo explícito para isShow
  setIsShow: Dispatch<SetStateAction<boolean>> // Make sure this is included
}

export const initialListView: ListViewContextProps = {
  selected: [],
  onSelect: () => {},
  onSelectAll: () => {},
  clearSelected: () => {},
  setItemIdForUpdate: () => {},
  isAllSelected: false,
  disabled: false,
  isShow: false, // Make sure this is included
  setIsShow: () => {}, // Make sure this is included
}