// @ts-nocheck
import { Column } from 'react-table';
import { InfoCell } from './InfoCell'; // Cambiar a InfoCell de Persona
import { ActionsCell } from './ActionsCell'; // Cambiar a ActionsCell de Persona
import { CustomHeader } from './CustomHeader'; // Cambiar a CustomHeader de Persona
import { SelectionCell } from './SelectionCell'; // Cambiar a SelectionCell de Persona
import { SelectionHeader } from './SelectionHeader'; // Cambiar a SelectionHeader de Persona
import { Persona } from '../../core/_models';

const Columns: ReadonlyArray<Column<Persona>> = [
  {
    Header: (props) => <SelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({ ...props }) => <SelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Nombre' className='min-w-125px' />
    ),
    id: 'nombre',
    Cell: ({ ...props }) => <InfoCell persona={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Apellido' className='min-w-125px' />
    ),
    accessor: 'apellido',
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Email' className='min-w-125px' />
    ),
    accessor: 'email',
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Teléfono' className='min-w-125px' />
    ),
    accessor: 'telefono',
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Estado' className='min-w-125px' />
    ),
    accessor: 'estado',
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Acciones' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <ActionsCell id={props.data[props.row.index].id} />,
  },
];

export { Columns };