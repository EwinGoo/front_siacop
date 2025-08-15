// @ts-nocheck
import {Column} from 'react-table'
import {InfoCell} from './InfoCell' // Asegúrate de adaptar este componente
import {ActionsCell} from './ActionsCell'
import {CustomHeader} from './CustomHeader'
import {SelectionCell} from './SelectionCell'
import {SelectionHeader} from './SelectionHeader'
import {FeriadoAsueto} from '../../core/_models' // Usamos el tipo FeriadoAsueto que definimos antes
import {DateCell} from './DateCell'
import HorarioCell from './HorarioCell'

const Columns: ReadonlyArray<Column<FeriadoAsueto>> = [
  {
    Header: (props) => <CustomHeader tableProps={props} title='N°' className='min-w-50px' />,
    id: 'numero',
    Cell: ({row}) => <span>{row.index + 1}</span>,
  },
  {
    Header: (props) => <CustomHeader tableProps={props} title='Evento' className='min-w-200px' />,
    id: 'evento',
    Cell: ({row}) => <InfoCell feriadoAsueto={row.original} />,
  },
  {
    Header: (props) => <CustomHeader tableProps={props} title='Tipo' className='min-w-100px' />,
    accessor: 'tipo_evento',
    Cell: ({value}) => (
      <span className={`badge badge-light-${value === 'FERIADO' ? 'primary' : 'info'}`}>
        {value}
      </span>
    ),
  },
  {
    Header: (props) => <CustomHeader tableProps={props} title='Fecha' className='min-w-120px' />,
    id: 'fecha',
    Cell: ({row}) => <DateCell feriadoAsueto={row.original} />,
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Horario' className='min-w-150px text-center' />
    ),
    id: 'horario',
    Cell: ({row}) => <HorarioCell feriadoAsueto={row.original} />,
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Aplicado a' className='min-w-120px' />
    ),
    accessor: 'aplicado_a',
    Cell: ({value}) => (
      <span
        className={`badge badge-light-${
          value === 'TODOS' ? 'success' : value === 'MASCULINO' ? 'primary' : 'danger'
        }`}
      >
        {value}
      </span>
    ),
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Acciones' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({...props}) => (
      <ActionsCell id={props.data[props.row.index].id_asistencia_feriado_asueto} />
    ),
  },
]

export {Columns}
