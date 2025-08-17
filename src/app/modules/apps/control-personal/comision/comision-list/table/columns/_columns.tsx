import {Column} from 'react-table'
import {InfoCell} from './InfoCell'
import {ActionsCell} from './ActionsCell'
import {CustomHeader} from './CustomHeader'
import {SelectionCell} from './SelectionCell'
import {SelectionHeader} from './SelectionHeader'
import {Comision} from '../../core/_models'
import {DateCell} from './DateCell'
import {DetallesCell} from './DetallesCell'
import {EstadoBadge} from '../components/EstadoBadge'
import HorarioCell from './HorarioCell'

type GetColumnsProps = {
  isAdmin: boolean
}

export const getColumns = ({isAdmin}: GetColumnsProps): ReadonlyArray<Column<Comision>> => {
  const columns: Column<Comision>[] = []

  if (isAdmin) {
    columns.push({
      Header: (props) => <SelectionHeader tableProps={props} />,
      id: 'selection',
      Cell: ({...props}) => <SelectionCell id={props.data[props.row.index].id_comision} />,
    })
  }

  columns.push(
    {
      Header: (props) => <CustomHeader tableProps={props} title='N°' className='min-w-50px' />,
      id: 'numero',
      Cell: ({row}) => <span>{row.index + 1}</span>,
    },
    {
      Header: (props) => (
        <CustomHeader tableProps={props} title='Tipo' className='min-w-100px text-center' />
      ),
      id: 'tipo_comision',
      Cell: ({...props}) => <InfoCell comision={props.data[props.row.index]} />,
    },
    {
      Header: (props) => <CustomHeader tableProps={props} title='Código' className='min-w-100px' />,
      accessor: 'id_comision',
    },
    {
      Header: (props) => (
        <CustomHeader tableProps={props} title='Solicitante' className='min-w-100px' />
      ),
      accessor: 'nombre_generador',
    },
    {
      Header: (props) => <CustomHeader tableProps={props} title='Fecha' className='min-w-120px' />,
      accessor: 'fecha_comision',
      Cell: ({value}) => <DateCell value={value} />,
    },
    {
      Header: (props) => (
        <CustomHeader tableProps={props} title='Horario' className='min-w-150px' />
      ),
      id: 'horario',
      Cell: ({row}) => (
        <HorarioCell
          horaSalida={row.original.hora_salida}
          horaRetorno={row.original.hora_retorno}
        />
      ),
    },
    {
      Header: (props) => (
        <CustomHeader tableProps={props} title='Detalles' className='min-w-250px' />
      ),
      id: 'detalles',
      Cell: ({row}) => <DetallesCell comision={row.original} />,
    },
    {
      Header: (props) => <CustomHeader tableProps={props} title='Estado' className='min-w-100px' />,
      accessor: 'estado_boleta_comision',
      Cell: ({value}) => <EstadoBadge estado={value} />,
    },
    {
      Header: (props) => (
        <CustomHeader tableProps={props} title='Acciones' className='text-end min-w-150px' />
      ),
      id: 'actions',
      Cell: ({...props}) => (
        <ActionsCell
          id={props.data[props.row.index].id_comision}
          estado={props.data[props.row.index].estado_boleta_comision}
          hash={props.data[props.row.index].hash}
          tipo={props.data[props.row.index].tipo_comision}
        />
      ),
    }
  )

  return columns
}
