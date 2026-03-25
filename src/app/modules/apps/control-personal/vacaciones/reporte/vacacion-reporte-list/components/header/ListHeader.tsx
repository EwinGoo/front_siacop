import {useListView} from '../../core/ListViewProvider'
import {useQueryRequest} from '../../core/QueryRequestProvider'
import {useQueryResponseLoading} from '../../core/QueryResponseProvider'
import {ListSearchComponent} from './ListSearchComponent'

const ListHeader = () => {
  const {setIsShow, setAccion} = useListView()
  const isLoading = useQueryResponseLoading()
  const {updateState} = useQueryRequest()

  const handleOpenReport = () => {
    setAccion('report')
    setIsShow(true)
  }

  return (
    <div className='card-header border-0 pt-6'>
      <div className='row w-100 g-3 align-items-center'>
        {/* Columna Buscador: Ocupa todo en móvil, y se ajusta en desktop */}
        <div className='col-12 col-lg-3'>
          <ListSearchComponent />
          {/* <div className='position-relative'>
            <i className='ki-duotone ki-magnifier fs-3 position-absolute ms-5 translate-middle-y top-50'>
              <span className='path1'></span>
              <span className='path2'></span>
            </i>
            <input
              type='text'
              className='form-control form-control-solid ps-13'
              placeholder='Buscar por nombre o CI...'
              onChange={(e) => updateState({search: e.target.value, page: 1} as any)}
              disabled={isLoading}
            />
          </div> */}
        </div>

        {/* Columna Filtros y Botón: Se expande para ocupar el resto del espacio */}
        <div className='col-12 col-lg-9'>
          <div className='d-flex flex-wrap justify-content-lg-end gap-3'>
            {/* Filtro estado */}
            <select
              className='form-select form-select-solid w-md-200px w-100'
              onChange={(e) => updateState({filter_estado: e.target.value, page: 1} as any)}
              disabled={isLoading}
            >
              <option value=''>Todos los estados</option>
              <option value='GENERADO'>Generado</option>
              <option value='ENVIADO'>Enviado</option>
              <option value='RECEPCIONADO'>Recepcionado</option>
              <option value='APROBADO'>Aprobado</option>
              {/* <option value='OBSERVADO'>Observado</option> */}
            </select>

            {/* Filtros fecha */}
            {/* <div className='d-flex gap-2 w-100 w-md-auto'>
              <input
                type='date'
                className='form-control form-control-solid'
                title='Fecha desde'
                onChange={(e) => updateState({fecha_desde: e.target.value, page: 1} as any)}
                disabled={isLoading}
              />
              <input
                type='date'
                className='form-control form-control-solid'
                title='Fecha hasta'
                onChange={(e) => updateState({fecha_hasta: e.target.value, page: 1} as any)}
                disabled={isLoading}
              />
            </div> */}

            {/* Botón reporte PDF */}
            <button
              type='button'
              className='btn btn-danger w-100 w-md-auto'
              onClick={handleOpenReport}
              disabled={isLoading}
            >
              <i className='bi bi-file-earmark-pdf me-2'></i>
              Reporte PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export {ListHeader}
