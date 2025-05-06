// @ts-nocheck
import { Column } from 'react-table';
import { InfoCell } from './InfoCell'; // Asegúrate de adaptar este componente
import { ActionsCell } from './ActionsCell';
import { CustomHeader } from './CustomHeader';
import { SelectionCell } from './SelectionCell';
import { SelectionHeader } from './SelectionHeader';
import { FeriadoAsueto } from '../../core/_models'; // Usamos el tipo FeriadoAsueto que definimos antes

const Columns: ReadonlyArray<Column<FeriadoAsueto>> = [
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Evento' className='min-w-200px' />
    ),
    id: 'evento',
    Cell: ({ ...props }) => <InfoCell feriadoAsueto={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Tipo' className='min-w-100px' />
    ),
    accessor: 'tipo_evento',
    Cell: ({ value }) => (
      <span className={`badge badge-light-${value === 'FERIADO' ? 'primary' : 'info'}`}>
        {value}
      </span>
    ),
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Fecha Evento' className='min-w-120px' />
    ),
    accessor: 'fecha_evento',
    Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : 'N/A',
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Rango Fechas' className='min-w-200px' />
    ),
    id: 'rango_fechas',
    Cell: ({ row }) => (
      <span>
        {row.original.fecha_inicio ? new Date(row.original.fecha_inicio).toLocaleDateString() : 'N/A'} - 
        {row.original.fecha_fin ? new Date(row.original.fecha_fin).toLocaleDateString() : 'N/A'}
      </span>
    ),
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Horario' className='min-w-150px' />
    ),
    id: 'horario',
    Cell: ({ row }) => (
      <span>
        {row.original.hora_inicio || 'N/A'} - {row.original.hora_fin || 'N/A'}
      </span>
    ),
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Aplicado a' className='min-w-120px' />
    ),
    accessor: 'aplicado_a',
    Cell: ({ value }) => (
      <span className={`badge badge-light-${value === 'TODOS' ? 'success' : value === 'MASCULINO' ? 'primary' : 'danger'}`}>
        {value}
      </span>
    ),
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Acciones' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => (
      <ActionsCell 
        id={props.data[props.row.index].id_asistencia_feriado_asueto} 
      />
    ),
  },
];

export { Columns };