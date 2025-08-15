import {useMemo} from 'react'
import {useTable, ColumnInstance, Row} from 'react-table'
import {CustomHeaderColumn} from './columns/CustomHeaderColumn'
import {CustomRow} from './columns/CustomRow'
import {useQueryResponseData, useQueryResponseLoading} from '../core/QueryResponseProvider'
import {getColumns, ModalHandlers} from './columns/_columns' // Cambiar a columnas de Persona
import {DeclaratoriaComision} from '../core/_models'
import {ListPagination} from '../components/pagination/ListPagination'
import {KTCardBody} from 'src/_metronic/helpers'
import {ListLoading} from 'src/app/modules/components/loading/ListLoading'


interface DeclaratoriaComisionTableProps extends ModalHandlers {} // Usa la interface
const DeclaratoriaComisionTable: React.FC<DeclaratoriaComisionTableProps> = ({
  onShowPDF,
  onShowData,
  onSetLoading,
  getLoadingState,
}) => {
  const declaratoria = useQueryResponseData()
  const isLoading = useQueryResponseLoading()
  const columns = useMemo(
    () => getColumns({onShowPDF, onShowData, onSetLoading, getLoadingState}),
    [onShowPDF, onShowData, onSetLoading, getLoadingState]
  )
  const data = useMemo(() => declaratoria, [declaratoria])
  // const columns = useMemo(() => Columns, []) // Cambiar a columnas de Persona
  const {getTableProps, getTableBodyProps, headers, rows, prepareRow} = useTable({
    columns,
    data,
  })

  return (
    <KTCardBody className='py-4'>
      <div className='table-responsive'>
        <table
          id='kt_table_hover'
          className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
          {...getTableProps()}
        >
          <thead>
            <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
              {headers.map((column: ColumnInstance<DeclaratoriaComision>) => (
                <CustomHeaderColumn key={column.id} column={column} />
              ))}
            </tr>
          </thead>
          <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row: Row<DeclaratoriaComision>, i) => {
                prepareRow(row)
                return <CustomRow row={row} key={`row-${i}-${row.id}`} />
              })
            ) : (
              <tr>
                <td colSpan={11}>
                  <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                    No se encontraron registros
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ListPagination />
      {isLoading && <ListLoading />}
    </KTCardBody>
  )
}

export {DeclaratoriaComisionTable}
