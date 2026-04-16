import {useQueryResponseData, useQueryResponseLoading, useQueryResponse} from '../core/QueryResponseProvider'
import {useListView} from '../core/ListViewProvider'
import {Grupo} from '../core/_models'
import {ListPagination} from '../components/pagination/ListPagination'
import {KTCardBody, KTIcon} from '../../../../../../../../_metronic/helpers'
import {deleteGrupo} from '../core/_requests'
import {usePermissions} from 'src/app/modules/auth/hooks/usePermissions'
import Swal from 'sweetalert2'

const COLORES_TURNO = ['badge-light-primary', 'badge-light-warning', 'badge-light-danger', 'badge-light-success']

const GrupoTable = () => {
  const grupos = useQueryResponseData() as Grupo[]
  const isLoading = useQueryResponseLoading()
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()
  const {guardiaSeguridad} = usePermissions()

  const handleDelete = async (grupo: Grupo) => {
    const result = await Swal.fire({
      title: '¿Eliminar grupo?',
      text: `Se eliminará "${grupo.nombre}" y sus miembros quedarán sin grupo.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#f1416c',
    })
    if (result.isConfirmed) {
      await deleteGrupo(grupo.id_grupo)
      refetch()
    }
  }

  return (
    <KTCardBody className='py-4'>
      <div className='table-responsive'>
        <table className='table align-middle table-row-dashed fs-6 gy-5 dataTable'>
          <thead>
            <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
              <th>Orden</th>
              <th>Nombre del Grupo</th>
              <th className='text-center'>Guardias</th>
              <th>Descripción</th>
              <th className='text-end'>Acciones</th>
            </tr>
          </thead>
          <tbody className='text-gray-600 fw-bold'>
            {isLoading ? (
              <tr><td colSpan={5} className='text-center py-10'><span className='spinner-border text-primary'></span></td></tr>
            ) : grupos.length === 0 ? (
              <tr><td colSpan={5} className='text-center text-muted py-10'>No se encontraron grupos</td></tr>
            ) : grupos.map((grupo) => {
              const colorIdx = ((grupo.orden ?? 1) - 1) % COLORES_TURNO.length
              return (
                <tr key={grupo.id_grupo}>
                  <td>
                    <span className={`badge ${COLORES_TURNO[colorIdx]} fs-7 fw-bolder`}>
                      #{grupo.orden}
                    </span>
                  </td>
                  <td>
                    <div className='d-flex align-items-center'>
                      <div className='symbol symbol-40px me-3'>
                        <span className='symbol-label bg-light-primary fw-bold text-primary fs-6'>
                          {grupo.nombre?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <span className='text-dark fw-bolder d-block fs-6'>{grupo.nombre}</span>
                      </div>
                    </div>
                  </td>
                  <td className='text-center'>
                    <span className='badge badge-light-info fs-7'>
                      <KTIcon iconName='people' className='fs-5 me-1' />
                      {grupo.total_miembros ?? 0} guardias
                    </span>
                  </td>
                  <td className='text-muted'>{grupo.descripcion || '—'}</td>
                  <td className='text-end'>
                    <button
                      className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      title='Ver / Editar miembros'
                      onClick={() => setItemIdForUpdate(grupo.id_grupo)}
                    >
                      <KTIcon iconName='people' className='fs-3' />
                    </button>
                    {guardiaSeguridad.canManage && (
                      <button
                        className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm'
                        title='Eliminar'
                        onClick={() => handleDelete(grupo)}
                      >
                        <KTIcon iconName='trash' className='fs-3' />
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <ListPagination />
    </KTCardBody>
  )
}

export {GrupoTable}
