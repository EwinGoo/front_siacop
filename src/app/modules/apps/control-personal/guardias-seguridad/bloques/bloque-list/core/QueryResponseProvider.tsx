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
} from '../../../../../../../../_metronic/helpers'
import {getBloques} from './_requests'
import {Bloque} from './_models'
import {useQueryRequest} from './QueryRequestProvider'

const QueryResponseContext = createResponseContext<Bloque>(initialQueryResponse)

const QueryResponseProvider: FC<WithChildren> = ({children}) => {
  const {state} = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state])

  useEffect(() => {
    if (query !== updatedQuery) setQuery(updatedQuery)
  }, [updatedQuery])

  const {isFetching, refetch, data: response} = useQuery(
    `${QUERIES.GUARDIA_BLOQUES_LIST}-${query}`,
    () => getBloques(query),
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
  return response?.data || []
}
const useQueryResponsePagination = () => {
  const defaultPaginationState: PaginationState = {links: [], ...initialQueryState}
  const {response} = useQueryResponse()
  if (!response?.payload?.pagination) return defaultPaginationState
  return response.payload.pagination
}
const useQueryResponseLoading = (): boolean => useQueryResponse().isLoading

export {
  QueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponsePagination,
  useQueryResponseLoading,
}
