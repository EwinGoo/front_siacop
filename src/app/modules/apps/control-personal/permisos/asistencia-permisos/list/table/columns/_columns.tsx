// @ts-nocheck
import { Column } from 'react-table';
import { InfoCell } from './InfoCell';
import { ActionsCell } from './ActionsCell';
import { CustomHeader } from './CustomHeader';
import { SelectionCell } from './SelectionHeader';
import { AsistenciaPermiso } from '../../core/_models';

const Columns: ReadonlyArray<Column<AsistenciaPermiso>> = [
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='ID' className='min-w-75px' />
    ),
    accessor: 'id_asistencia_permiso',
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Persona' className='min-w-200px' />
    ),
    id: 'persona',
    Cell: ({ ...props }) => <InfoCell asistenciaPermiso={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Tipo Permiso' className='min-w-150px' />
    ),
    accessor: 'tipo_permiso_nombre',
    Cell: ({ value }) => value || <span className='text-muted'>No especificado</span>,
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Fechas' className='min-w-250px' />
    ),
    id: 'fechas',
    Cell: ({ row }) => (
      <div>
        <div>Inicio: {row.original.fecha_inicio_permiso ? new Date(row.original.fecha_inicio_permiso).toLocaleDateString() : '-'}</div>
        <div>Fin: {row.original.fecha_fin_permiso ? new Date(row.original.fecha_fin_permiso).toLocaleDateString() : '-'}</div>
      </div>
    ),
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Estado' className='min-w-150px' />
    ),
    accessor: 'estado_permiso',
    Cell: ({ value }) => (
      <span className={`badge badge-light-${value === 'APROBADO' ? 'success' : 'warning'}`}>
        {value === 'APROBADO' ? 'Aprobado' : 'Generado'}
      </span>
    ),
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Creado' className='min-w-150px' />
    ),
    accessor: 'created_at',
    Cell: ({ value }) => value ? new Date(value).toLocaleString() : '-',
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Acciones' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => (
      <ActionsCell 
        id={props.data[props.row.index].id_asistencia_permiso} 
        isActive={props.data[props.row.index].estado_permiso === 'GENERADO'} 
      />
    ),
  },
];

export { Columns };