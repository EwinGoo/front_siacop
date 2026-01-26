/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {useQueryResponseLoading, useQueryResponsePagination} from '../../core/QueryResponseProvider'
import {useQueryRequest} from '../../core/QueryRequestProvider'
import {PaginationState} from '../../../../../../../../_metronic/helpers'
import {useMemo} from 'react'

const mappedLabel = (label: string): string => {
  if (label === '&laquo; Anterior') {
    return 'Anterior'
  }

  if (label === 'Siguiente &raquo;') {
    return 'Siguiente'
  }

  return label
}

const ListPagination = () => {
  const apiPagination = useQueryResponsePagination()
  const isLoading = useQueryResponseLoading()
  const {updateState} = useQueryRequest()

  const pagination: PaginationState | null = useMemo(() => {
    if (!apiPagination) return null
    
    const itemsPerPage = apiPagination.perPage === 30 || 
                         apiPagination.perPage === 50 || 
                         apiPagination.perPage === 100 
                       ? apiPagination.perPage 
                       : 10
  
    const links: Array<{label: string; active: boolean; url: string | null; page: number | null}> = []
    
    links.push({
      label: '&laquo; Anterior',
      active: false,
      url: apiPagination.previous || null,
      page: apiPagination.currentPage > 1 ? apiPagination.currentPage - 1 : null
    })
    
    for (let i = 1; i <= apiPagination.pageCount; i++) {
      links.push({
        label: i.toString(),
        active: i === apiPagination.currentPage,
        url: `?page=${i}&items_per_page=${itemsPerPage}`,
        page: i
      })
    }
    
    links.push({
      label: 'Siguiente &raquo;',
      active: false,
      url: apiPagination.next || null,
      page: apiPagination.currentPage < apiPagination.pageCount ? apiPagination.currentPage + 1 : null
    })
    
    return {
      page: apiPagination.currentPage,
      items_per_page: itemsPerPage,
      links,
      currentPage: apiPagination.currentPage,
      perPage: itemsPerPage,
      pageCount: apiPagination.pageCount,
      next: apiPagination.next || null,
      previous: apiPagination.previous || null
    }
  }, [apiPagination])

  const updatePage = (page: number | undefined | null) => {
    if (!page || isLoading || !pagination || pagination.page === page) {
      return
    }

    updateState({
      page, 
      items_per_page: pagination.items_per_page
    })
  }

  const PAGINATION_PAGES_COUNT = 5
  const sliceLinks = (pagination: PaginationState) => {
    if (!pagination.links?.length) {
      return []
    }

    let scopedLinks = [...pagination.links]
    let previousLink = scopedLinks.shift()!
    let nextLink = scopedLinks.pop()!

    let pageLinks: Array<{
      label: string
      active: boolean
      url: string | null
      page: number | null
    }> = []

    const halfOfPagesCount = Math.floor(PAGINATION_PAGES_COUNT / 2)
    const currentPage = pagination.currentPage

    pageLinks.push(previousLink)

    if (pagination.pageCount <= PAGINATION_PAGES_COUNT) {
      pageLinks = [...pageLinks, ...scopedLinks]
    } else if (currentPage <= halfOfPagesCount + 1) {
      pageLinks = [...pageLinks, ...scopedLinks.slice(0, PAGINATION_PAGES_COUNT)]
    } else if (currentPage >= pagination.pageCount - halfOfPagesCount) {
      pageLinks = [...pageLinks, ...scopedLinks.slice(-PAGINATION_PAGES_COUNT)]
    } else {
      pageLinks = [
        ...pageLinks,
        ...scopedLinks.slice(currentPage - halfOfPagesCount - 1, currentPage + halfOfPagesCount)
      ]
    }

    pageLinks.push(nextLink)

    return pageLinks
  }

  const paginationLinks = useMemo(() => {
    return pagination ? sliceLinks(pagination) : []
  }, [pagination])

  if (!pagination) return null

  return (
    <div className='row'>
      <div className='col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'></div>
      <div className='col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'>
        <div id='kt_table_users_paginate'>
          <ul className='pagination'>
            <li
              className={clsx('page-item', {
                disabled: isLoading || pagination.currentPage === 1,
              })}
            >
              <a onClick={() => updatePage(1)} style={{cursor: 'pointer'}} className='page-link'>
                Primero
              </a>
            </li>
            {paginationLinks.map((link) => (
              <li
                key={`${link.label}-${link.page}`}
                className={clsx('page-item', {
                  active: link.active,
                  disabled: isLoading || link.page === null,
                  previous: link.label.includes('Anterior'),
                  next: link.label.includes('Siguiente'),
                })}
              >
                <a
                  className={clsx('page-link', {
                    'page-text': link.label.includes('Anterior') || link.label.includes('Siguiente'),
                    'me-5': link.label.includes('Anterior'),
                  })}
                  onClick={() => updatePage(link.page)}
                  style={{cursor: link.page ? 'pointer' : 'default'}}
                >
                  {mappedLabel(link.label)}
                </a>
              </li>
            ))}
            <li
              className={clsx('page-item', {
                disabled: isLoading || pagination.currentPage === pagination.pageCount,
              })}
            >
              <a
                onClick={() => updatePage(pagination.pageCount)}
                style={{cursor: 'pointer'}}
                className='page-link'
              >
                Último
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export {ListPagination}
