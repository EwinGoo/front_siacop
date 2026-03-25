import {FC, useContext, useState, useEffect, useMemo} from 'react'
import {useQuery} from 'react-query'
import {
  createResponseContext,
  initialQueryResponse,
  initialQueryState,
  PaginationState,
  QUERIES,
  stringifyRequestQuery,
  WithChildren,
} from 'src/_metronic/helpers'
import {getVacacionesReporte} from './_requests'
import {Vacacion} from 'src/app/modules/apps/control-personal/vacaciones/core/_models'
import {useQueryRequest} from './QueryRequestProvider'

const QueryResponseContext = createResponseContext<Vacacion>(initialQueryResponse)

// Construye la query incluyendo los filtros custom que Metronic no serializa
const buildQuery = (state: any): string => {
  const base = stringifyRequestQuery(state)
  const extras: string[] = []
  if (state.filter_estado) extras.push(`filter_estado=${encodeURIComponent(state.filter_estado)}`)
  if (state.fecha_desde)   extras.push(`fecha_desde=${encodeURIComponent(state.fecha_desde)}`)
  if (state.fecha_hasta)   extras.push(`fecha_hasta=${encodeURIComponent(state.fecha_hasta)}`)
  return extras.length ? `${base}&${extras.join('&')}` : base
}

const QueryResponseProvider: FC<WithChildren> = ({children}) => {
  const {state} = useQueryRequest()
  const [query, setQuery] = useState<string>(buildQuery(state))
  const updatedQuery = useMemo(() => buildQuery(state), [state])

  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery)
    }
  }, [updatedQuery])

  const {
    isFetching,
    refetch,
    data: response,
  } = useQuery(
    `${QUERIES.VACACIONES_LIST}-${query}`,
    () => getVacacionesReporte(query),
    {cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false}
  )

  return (
    <QueryResponseContext.Provider value={{isLoading: isFetching, refetch, response, query}}>
      {children}
    </QueryResponseContext.Provider>
  )
}

const useQueryResponse = () => useContext(QueryResponseContext)

const useQueryResponseData = () => {
  const {response} = useQueryResponse()
  if (!response) return []
  return response?.data || []
}

const useQueryResponsePagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  }
  const {response} = useQueryResponse()
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState
  }
  return response.payload.pagination
}

const useQueryResponseLoading = (): boolean => {
  const {isLoading} = useQueryResponse()
  return isLoading
}

export {
  QueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponsePagination,
  useQueryResponseLoading,
}
