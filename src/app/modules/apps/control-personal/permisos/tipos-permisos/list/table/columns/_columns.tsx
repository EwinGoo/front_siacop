import {Column} from 'react-table'
import {InfoCell} from './InfoCell'
import {ActionsCell} from './ActionsCell'
import {CustomHeader} from './CustomHeader'
import {TipoPermiso} from '../../core/_models'
import {DescripcionCell} from './DescripcionCell'

const Columns: ReadonlyArray<Column<TipoPermiso>> = [
  {
    Header: (props) => <CustomHeader tableProps={props} title='N°' className='min-w-20px' />,
    id: 'numero',
    Cell: ({row}) => <span>{row.index + 1}</span>,
  },
  {
    Header: (props) => <CustomHeader tableProps={props} title='Nombre' className='min-w-50px' />,
    id: 'nombre',
    Cell: ({...props}) => <InfoCell tipoPermiso={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Requisitos' className='min-w-450px' />
    ),
    accessor: 'instruccion',
    Cell: ({value}) => <div dangerouslySetInnerHTML={{__html: value ?? ''}} />,
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Límite días' className='min-w-100px' />
    ),
    accessor: 'limite_dias',
    Cell: ({value}) =>
      value !== null && value !== undefined ? (
        <span>{value}</span>
      ) : (
        <span className='text-muted'>No definido</span>
      ),
  },
  // {
  //   Header: (props) => <CustomHeader tableProps={props} title='Creado' className='min-w-150px' />,
  //   accessor: 'created_at',
  //   Cell: ({value}) => (value ? new Date(value).toLocaleString() : '-'),
  // },
  // {
  //   Header: (props) => (
  //     <CustomHeader tableProps={props} title='Actualizado' className='min-w-150px' />
  //   ),
  //   accessor: 'updated_at',
  //   Cell: ({value}) => (value ? new Date(value).toLocaleString() : '-'),
  // },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Acciones' className='text-end min-w-150px' />
    ),
    id: 'actions',
    Cell: ({...props}) => (
      <ActionsCell
        id={props.data[props.row.index].id_tipo_permiso}
        isActive={!props.data[props.row.index].deleted_at}
      />
    ),
  },
]

export {Columns}
