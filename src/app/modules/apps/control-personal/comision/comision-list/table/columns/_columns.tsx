// @ts-nocheck
import { Column } from 'react-table';
import { InfoCell } from './InfoCell'; // Asegúrate de adaptar este componente
import { ActionsCell } from './ActionsCell';
import { CustomHeader } from './CustomHeader';
import { SelectionCell } from './SelectionCell';
import { SelectionHeader } from './SelectionHeader';
import { Comision } from '../../core/_models'; // Usamos el tipo Comision que definimos antes

const Columns: ReadonlyArray<Column<Comision>> = [
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Descripción' className='min-w-200px' />
    ),
    id: 'descripcion',
    Cell: ({ ...props }) => <InfoCell comision={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Solicitante' className='min-w-100px' />
    ),
    accessor: 'nombre_generador',
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Tipo' className='min-w-100px' />
    ),
    accessor: 'tipo_comision',
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Fecha' className='min-w-120px' />
    ),
    accessor: 'fecha_comision',
    Cell: ({ value }) => new Date(value).toLocaleDateString(), // Formatear fecha
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Horario' className='min-w-150px' />
    ),
    id: 'horario',
    Cell: ({ row }) => (
      <span>
        {row.original.hora_salida} - {row.original.hora_retorno}
      </span>
    ),
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Recorrido' className='min-w-200px' />
    ),
    id: 'recorrido',
    Cell: ({ row }) => (
      <span>
        {row.original.recorrido_de} → {row.original.recorrido_a}
      </span>
    ),
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Estado' className='min-w-100px' />
    ),
    accessor: 'estado_boleta_comision',
    Cell: ({ value }) => (
      <span className={`badge badge-light-${value === 'APROBADO' ? 'success' : 'warning'}`}>
        {value}
      </span>
    ),
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Acciones' className='text-end min-w-150px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => (
      <ActionsCell 
        id={props.data[props.row.index].id_comision} 
        estado={props.data[props.row.index].estado_boleta_comision} 
      />
    ),
  },
];

export { Columns };