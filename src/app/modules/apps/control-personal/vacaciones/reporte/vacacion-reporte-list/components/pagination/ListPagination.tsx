/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {useMemo} from 'react'
import {useQueryResponseLoading, useQueryResponsePagination} from '../../core/QueryResponseProvider'
import {useQueryRequest} from '../../core/QueryRequestProvider'
import {PaginationState} from 'src/_metronic/helpers'

const mappedLabel = (label: string): string => {
  if (label === '&laquo; Anterior') return 'Anterior'
  if (label === 'Siguiente &raquo;') return 'Siguiente'
  return label
}

const ListPagination = () => {
  const raw       = useQueryResponsePagination()
  const isLoading = useQueryResponseLoading()
  const {updateState} = useQueryRequest()

  // El backend devuelve: page, items_per_page, total, total_pages
  // Lo mapeamos al formato que usa el componente de Metronic
  const pagination: PaginationState | null = useMemo(() => {
    const p = raw as any
    if (!p || !p.total_pages) return null

    const currentPage  = p.page       ?? 1
    const pageCount    = p.total_pages ?? 1
    const itemsPerPage = p.items_per_page ?? 10

    const links: Array<{label: string; active: boolean; url: string | null; page: number | null}> = []

    links.push({
      label:  '&laquo; Anterior',
      active: false,
      url:    currentPage > 1 ? `?page=${currentPage - 1}` : null,
      page:   currentPage > 1 ? currentPage - 1 : null,
    })

    for (let i = 1; i <= pageCount; i++) {
      links.push({
        label:  i.toString(),
        active: i === currentPage,
        url:    `?page=${i}&items_per_page=${itemsPerPage}`,
        page:   i,
      })
    }

    links.push({
      label:  'Siguiente &raquo;',
      active: false,
      url:    currentPage < pageCount ? `?page=${currentPage + 1}` : null,
      page:   currentPage < pageCount ? currentPage + 1 : null,
    })

    return {
      page:          currentPage,
      items_per_page: itemsPerPage,
      links,
      currentPage,
      perPage:    itemsPerPage,
      pageCount,
      next:     currentPage < pageCount ? `?page=${currentPage + 1}` : null,
      previous: currentPage > 1        ? `?page=${currentPage - 1}` : null,
    } as PaginationState
  }, [raw])

  const updatePage = (page: number | null | undefined) => {
    if (!page || isLoading || !pagination || (pagination as any).currentPage === page) return
    updateState({page, items_per_page: (pagination as any).perPage} as any)
  }

  const PAGINATION_PAGES_COUNT = 5

  const sliceLinks = (p: PaginationState) => {
    if (!p.links?.length) return []

    let scoped       = [...p.links]
    const prevLink   = scoped.shift()!
    const nextLink   = scoped.pop()!
    const half       = Math.floor(PAGINATION_PAGES_COUNT / 2)
    const cur        = (p as any).currentPage as number
    const total      = (p as any).pageCount  as number

    let pageLinks = [prevLink]

    if (total <= PAGINATION_PAGES_COUNT) {
      pageLinks = [...pageLinks, ...scoped]
    } else if (cur <= half + 1) {
      pageLinks = [...pageLinks, ...scoped.slice(0, PAGINATION_PAGES_COUNT)]
    } else if (cur >= total - half) {
      pageLinks = [...pageLinks, ...scoped.slice(-PAGINATION_PAGES_COUNT)]
    } else {
      pageLinks = [...pageLinks, ...scoped.slice(cur - half - 1, cur + half)]
    }

    pageLinks.push(nextLink)
    return pageLinks
  }

  const paginationLinks = useMemo(() => (pagination ? sliceLinks(pagination) : []), [pagination])

  if (!pagination || (pagination as any).pageCount <= 1) return null

  return (
    <div className='row'>
      <div className='col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start' />
      <div className='col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'>
        <div id='kt_table_vacaciones_paginate'>
          <ul className='pagination'>
            <li className={clsx('page-item', {disabled: isLoading || (pagination as any).currentPage === 1})}>
              <a onClick={() => updatePage(1)} style={{cursor: 'pointer'}} className='page-link'>
                Primero
              </a>
            </li>

            {paginationLinks.map((link) => (
              <li
                key={`${link.label}-${link.page}`}
                className={clsx('page-item', {
                  active:   link.active,
                  disabled: isLoading || link.page === null,
                  previous: link.label.includes('Anterior'),
                  next:     link.label.includes('Siguiente'),
                })}
              >
                <a
                  className={clsx('page-link', {
                    'page-text': link.label.includes('Anterior') || link.label.includes('Siguiente'),
                    'me-5':      link.label.includes('Anterior'),
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
                disabled: isLoading || (pagination as any).currentPage === (pagination as any).pageCount,
              })}
            >
              <a
                onClick={() => updatePage((pagination as any).pageCount)}
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
