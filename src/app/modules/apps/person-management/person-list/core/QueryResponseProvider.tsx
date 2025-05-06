/* eslint-disable react-hooks/exhaustive-deps */
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
} from '../../../../../../_metronic/helpers'
import {getPersonas} from './_requests'
import {Persona} from './_models'
import {useQueryRequest} from './QueryRequestProvider'

const QueryResponseContext = createResponseContext<Persona>(initialQueryResponse)

const QueryResponseProvider: FC<WithChildren> = ({children}) => {
  const {state} = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state])

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
    `${QUERIES.PERSONAS_LIST}-${query}`,
    () => {
      return getPersonas(query)
    },
    {cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false}
  )

  // console.log(response.pagination)
  // const response = apiResponse?.data || null
  // console.log(response);
  
  // console.log(response?.data);
  // const res = response?.data
  // response = response?.data || []``
  // console.log(res);

  return (
    <QueryResponseContext.Provider value={{isLoading: isFetching, refetch, response, query}}>
      {children}
    </QueryResponseContext.Provider>
  )
}

const useQueryResponse = () => useContext(QueryResponseContext)

const useQueryResponseData = () => {
  const {response} = useQueryResponse()
  if (!response) {
    return []
  }
  // const res =  response?.data?.data;
  // console.log(res);

  // console.log(response)

  // return res || []
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
  // console.log(response.payload.pagination);
  

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
