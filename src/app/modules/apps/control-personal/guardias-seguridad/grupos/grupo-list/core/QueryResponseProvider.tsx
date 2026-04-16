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
import {getGrupos} from './_requests'
import {Grupo} from './_models'
import {useQueryRequest} from './QueryRequestProvider'

const QueryResponseContext = createResponseContext<Grupo>(initialQueryResponse)

const QueryResponseProvider: FC<WithChildren> = ({children}) => {
  const {state} = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state])

  useEffect(() => {
    if (query !== updatedQuery) setQuery(updatedQuery)
  }, [updatedQuery])

  const {isFetching, refetch, data: response} = useQuery(
    `${QUERIES.GUARDIA_GRUPOS_LIST}-${query}`,
    () => getGrupos(query),
    {cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false}
  )

  return (
    <QueryResponseContext.Provider value={{isLoading: isFetching, refetch, response, query}}>
      {children}
    </QueryResponseContext.Provider>
  )
}

const useQueryResponse = () => useContext(QueryResponseContext)
const useQueryResponseData = () => useQueryResponse().response?.data || []
const useQueryResponsePagination = () => {
  const def: PaginationState = {links: [], ...initialQueryState}
  const {response} = useQueryResponse()
  return response?.payload?.pagination ?? def
}
const useQueryResponseLoading = () => useQueryResponse().isLoading

export {QueryResponseProvider, useQueryResponse, useQueryResponseData, useQueryResponsePagination, useQueryResponseLoading}
