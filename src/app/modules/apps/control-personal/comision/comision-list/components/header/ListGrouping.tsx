import {useQueryClient, useMutation} from 'react-query'
import {initialQueryState, QUERIES} from 'src/_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {useQueryRequest} from '../../core/QueryRequestProvider'
import {aprobarSelectedComisiones} from '../../core/_requests'
import {toast} from 'react-toastify'
import {showAxiosError} from 'src/app/utils/showAxiosErrorToast'
import Tooltip from '@mui/material/Tooltip'

const ListGrouping = () => {
  const {selected, clearSelected} = useListView()
  const {updateState} = useQueryRequest()
  const queryClient = useQueryClient()
  const {query, refetch} = useQueryResponse()

  const aprobarSelectedItems = useMutation(
    () => {
      // Simular error 50% de las veces
      // if (Math.random() > 0.5) {
      //   return Promise.reject(new Error('Error simulado: Fallo en el servidor'))
      // }
      return aprobarSelectedComisiones(selected.map((id) => Number(id)))
    },
    {
      onMutate: async () => {
        await queryClient.cancelQueries([QUERIES.COMISIONES_LIST, query])

        const previousData = queryClient.getQueryData([QUERIES.COMISIONES_LIST, query])

        queryClient.setQueryData([QUERIES.COMISIONES_LIST, query], (old: any) => {
          if (!old?.data) return old
          return {
            ...old,
            data: old.data.map((comision) =>
              selected.includes(comision.id_comision)
                ? {...comision, estado_boleta_comision: 'APROBADO'}
                : comision
            ),
          }
        })

        return {previousData}
      },
      onError: (error, variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData([QUERIES.COMISIONES_LIST, query], context.previousData)
        }

        showAxiosError(error, {useSwal: true})
      },
      onSettled: async () => {
        // Limpiar selección independientemente del resultado
        // clearSelected()
      },
      onSuccess: async () => {
        try {
          await Promise.all([
            queryClient.invalidateQueries([QUERIES.COMISIONES_LIST, query], {exact: true}),
            refetch(),
            queryClient.invalidateQueries([QUERIES.COMISIONES_LIST], {exact: false}),
          ])

          toast.success(`${selected.length} comisiones aprobadas correctamente`)
          updateState({filter: undefined, ...initialQueryState})
          // Limpiar selección solo cuando es éxito
          clearSelected()
        } catch (error) {
          console.error('Error al actualizar datos:', error)
        }
      },
    }
  )

  return (
    <div className='d-flex justify-content-end align-items-center'>
      <div className='fw-bolder me-5'>
        <span className='me-2'>{selected.length}</span> Seleccionados
      </div>

      {/* Botón cancelar */}

      <Tooltip
        title='Cancelar'
        arrow
        slotProps={{
          tooltip: {
            sx: {
              fontSize: 11,
            },
          },
        }}
      >
        <button
          type='button'
          className='btn btn-danger me-2 rounded-circle px-4 py-2'
          onClick={() => clearSelected()}
          disabled={aprobarSelectedItems.isLoading || selected.length === 0}
        >
          x
        </button>
      </Tooltip>
      <button
        type='button'
        className='btn btn-success'
        onClick={async () => {
          try {
            await aprobarSelectedItems.mutateAsync()
          } catch (error) {
            // El error ya es manejado por onError, pero aquí lo atrapamos para que React no se queje
            console.warn('Error ya manejado internamente:', error)
          }
        }}
        disabled={aprobarSelectedItems.isLoading || selected.length === 0}
      >
        {aprobarSelectedItems.isLoading ? (
          <span className='indicator-progress' style={{display: 'block'}}>
            Procesando... <span className='spinner-border spinner-border-sm align-middle ms-2' />
          </span>
        ) : (
          <>
            <i className='bi bi-check-circle me-2'></i>
            Aprobar Seleccionados
          </>
        )}
      </button>
    </div>
  )
}

export {ListGrouping}
