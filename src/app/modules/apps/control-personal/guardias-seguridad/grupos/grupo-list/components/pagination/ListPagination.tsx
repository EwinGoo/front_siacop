import {useMemo} from 'react'
import {useQueryResponsePagination} from '../../core/QueryResponseProvider'
import {useQueryRequest} from '../../core/QueryRequestProvider'

const ListPagination = () => {
  const apiPagination = useQueryResponsePagination() as any
  const {updateState} = useQueryRequest()
  const {currentPage, pageCount} = apiPagination

  const pages = useMemo(() => {
    if (!pageCount) return []
    return Array.from({length: pageCount}, (_, i) => i + 1)
  }, [pageCount])

  if (!pageCount || pageCount <= 1) return null

  const goTo = (page: number) => {
    if (page < 1 || page > pageCount) return
    updateState({page, items_per_page: apiPagination.perPage || 10} as any)
  }

  return (
    <div className='row'>
      <div className='col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'>
        <ul className='pagination'>
          <li className={`page-item previous ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className='page-link' onClick={() => goTo(currentPage - 1)}><i className='previous'></i></button>
          </li>
          {pages.map((p) => (
            <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
              <button className='page-link' onClick={() => goTo(p)}>{p}</button>
            </li>
          ))}
          <li className={`page-item next ${currentPage === pageCount ? 'disabled' : ''}`}>
            <button className='page-link' onClick={() => goTo(currentPage + 1)}><i className='next'></i></button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export {ListPagination}
