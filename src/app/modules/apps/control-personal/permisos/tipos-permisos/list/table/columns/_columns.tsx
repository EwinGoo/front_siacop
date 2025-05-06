// @ts-nocheck
import { Column } from 'react-table';
import { InfoCell } from './InfoCell';
import { ActionsCell } from './ActionsCell';
import { CustomHeader } from './CustomHeader';
import { SelectionCell } from './SelectionHeader';
import { TipoPermiso } from '../../core/_models';
import { DescripcionCell } from './DescripcionCell';

const Columns: ReadonlyArray<Column<TipoPermiso>> = [
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='ID' className='min-w-75px' />
    ),
    accessor: 'id_tipo_permiso',
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Nombre' className='min-w-200px' />
    ),
    id: 'nombre',
    Cell: ({ ...props }) => <InfoCell tipoPermiso={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Descripción' className='min-w-300px' />
    ),
    accessor: 'descripcion',
    Cell: ({ value }) => <DescripcionCell descripcion={value} /> || <span className='text-muted'>Sin descripción</span>,
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
      <CustomHeader tableProps={props} title='Actualizado' className='min-w-150px' />
    ),
    accessor: 'updated_at',
    Cell: ({ value }) => value ? new Date(value).toLocaleString() : '-',
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Acciones' className='text-end min-w-150px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => (
      <ActionsCell 
        id={props.data[props.row.index].id_tipo_permiso} 
        isActive={!props.data[props.row.index].deleted_at} 
      />
    ),
  },
];

export { Columns };