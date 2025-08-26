/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react'
import {initialQueryState, KTIcon, QUERIES, useDebounce} from '../../../../../../../../../_metronic/helpers'
import {useQueryRequest} from '../../core/QueryRequestProvider'
import { useQueryResponse } from '../../core/QueryResponseProvider'
import { useQueryClient } from 'react-query'

const ListSearchComponent = () => {
  const {updateState} = useQueryRequest()
  const [searchTerm, setSearchTerm] = useState<string>('')
    const {query} = useQueryResponse()
  const queryClient = useQueryClient()

  // Debounce search term so that it only gives us latest value ...
  // ... if searchTerm has not been updated within last 500ms.
  // The goal is to only have the API call fire when user stops typing ...
  // ... so that we aren't hitting our API rapidly.
  const debouncedSearchTerm = useDebounce(searchTerm, 150)
  // Effect for API call
  useEffect(
    () => {
      if (debouncedSearchTerm !== undefined && searchTerm !== undefined) {
        updateState({search: debouncedSearchTerm, ...initialQueryState})
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
    // More details about useDebounce: https://usehooks.com/useDebounce/
  )

  return (
    <div className='card-title'>
      <button
        type='button'
        className='btn btn-light btn-sm mx-2'
        onClick={() => {
          queryClient.invalidateQueries([`${QUERIES.TIPOS_PERMISOS_LIST}-${query}`])
        }}
        title='Actualizar tabla'
      >
        <KTIcon iconName='arrows-circle' className='fs-1' />
      </button>
      {/* begin::Search */}
      <div className='d-flex align-items-center position-relative my-1'>
        <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
        <input
          type='text'
          data-kt-user-table-filter='search'
          className='form-control form-control-solid w-250px ps-14'
          placeholder='Buscar'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* end::Search */}
    </div>
  )
}

export {ListSearchComponent}
