import { useMemo } from 'react'
import { useTable, ColumnInstance, Row } from 'react-table'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

import { CustomHeaderColumn } from './columns/CustomHeaderColumn'
import { CustomRow } from './columns/CustomRow'
import { useQueryResponseData, useQueryResponseLoading } from '../core/QueryResponseProvider'
import { Columns } from './columns/_columns'
import { FeriadoAsueto } from '../core/_models'
import { ListPagination } from '../components/pagination/ListPagination'
import { KTCardBody } from '../../../../../../../_metronic/helpers'
import { ListLoading } from 'src/app/modules/components/loading/ListLoading'

const FeriadoAsuetoTable = () => {
  const feriadosAsuetos = useQueryResponseData()
  const isLoading = useQueryResponseLoading()
  const data = useMemo(() => feriadosAsuetos, [feriadosAsuetos])
  const columns = useMemo(() => Columns, [])

  const {
    getTableProps,
    getTableBodyProps,
    headers,
    rows,
    prepareRow
  } = useTable({
    columns,
    data,
  })

  return (
    <KTCardBody className='py-4'>
      <div className='table-responsive'>
        {/* Usando react-super-responsive-table components */}
        <Table
          id='kt_table_hover'
          className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
          {...getTableProps()}
        >
          <Thead>
            <Tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
              {headers.map((column: ColumnInstance<FeriadoAsueto>) => (
                <Th key={column.id}>
                  <CustomHeaderColumn column={column} />
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row: Row<FeriadoAsueto>, i) => {
                prepareRow(row)
                return (
                  <Tr key={`row-${i}-${row.id}`}>
                    {row.cells.map((cell, cellIndex) => (
                      <Td key={cellIndex}>
                        {cell.render('Cell')}
                      </Td>
                    ))}
                  </Tr>
                )
              })
            ) : (
              <Tr>
                <Td colSpan={headers.length}>
                  <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                    No se encontraron feriados o asuetos registrados
                  </div>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </div>
      <ListPagination />
      {isLoading && <ListLoading />}
    </KTCardBody>
  )
}

export { FeriadoAsuetoTable }