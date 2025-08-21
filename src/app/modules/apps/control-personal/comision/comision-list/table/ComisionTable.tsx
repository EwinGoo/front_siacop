import {useMemo} from 'react'
import {useTable, ColumnInstance, Row} from 'react-table'
import {useQueryResponseData, useQueryResponseLoading} from '../core/QueryResponseProvider'
import {Comision} from '../core/_models'
import {getColumns} from './columns/_columns'
import {CustomRow} from './columns/CustomRow'
import {CustomHeaderColumn} from './columns/CustomHeaderColumn'
import {ListPagination} from '../components/pagination/ListPagination'
import {KTCardBody} from '../../../../../../../_metronic/helpers'
import {ListLoading} from 'src/app/modules/components/loading/ListLoading'
import {usePermissions} from 'src/app/modules/auth/hooks/usePermissions'
import {useAuth} from 'src/app/modules/auth'
import {canManageComisiones} from 'src/app/modules/auth/core/roles/roleDefinitions'

const ComisionTable = () => {
  const comisiones = useQueryResponseData()
  const isLoading = useQueryResponseLoading()
  const data = useMemo(() => comisiones, [comisiones])
  // const {isAdminComision} = usePermissions()
  const {comision} = usePermissions()

  const {currentUser} = useAuth()

  // ✅ Lógica corregida para verificar permisos de gestión
  const canManage = currentUser?.groups ? canManageComisiones(currentUser.groups) : false

  // const columns = useMemo(() => getColumns({isAdmin: isAdminComision}), [isAdminComision])

  const columns = useMemo(
    () =>
      getColumns({
        canView: comision.canView,
        canEdit: comision.canEdit,
        canDelete: comision.canDelete,
        canCreate: comision.canCreate,
        canManage: canManage,
        hasActionPermissions: comision.canEdit || comision.canDelete || comision.canManage,
      }),
    [comision.canView, comision.canEdit, comision.canDelete, comision.canCreate, comision.canManage]
  )

  const {getTableProps, getTableBodyProps, headers, rows, prepareRow} = useTable({
    columns,
    data,
  })

  if (!comision.canView) {
    return (
      <KTCardBody className='py-4'>
        <div className='alert alert-warning d-flex align-items-center'>
          <i className='ki-outline ki-shield-cross fs-2hx text-warning me-4'></i>
          <div className='d-flex flex-column'>
            <h4 className='mb-1 text-warning'>Acceso Denegado</h4>
            <span>No tienes permisos para ver las comisiones.</span>
          </div>
        </div>
      </KTCardBody>
    )
  }

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
              {headers.map((column: ColumnInstance<Comision>) => (
                <CustomHeaderColumn key={column.id} column={column} />
              ))}
            </tr>
          </thead>
          <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row: Row<Comision>, i) => {
                prepareRow(row)
                return <CustomRow row={row} key={`row-${i}-${row.id}`} />
              })
            ) : (
              <tr>
                <td colSpan={headers.length}>
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

export {ComisionTable}
