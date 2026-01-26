import {Column} from 'react-table'
import {InfoCell} from './InfoCell' 
import {ActionsCell} from './ActionsCell'
import {CustomHeader} from './CustomHeader'
import {DispositivoBiometrico} from '../../core/_models'
import {StatusCell} from './StatusCell'
import {ConnectionCell} from './ConnectionCell'

const Columns: ReadonlyArray<Column<DispositivoBiometrico>> = [
  {
    Header: (props) => <CustomHeader tableProps={props} title='N°' className='min-w-10px w-10px' />,
    id: 'numero',
    Cell: ({row}) => <span>{row.index + 1}</span>,
  },
  {
    Header: (props) => <CustomHeader tableProps={props} title='Acciones' className='w-actions' />,
    id: 'actions',
    Cell: ({...props}) => (
      <ActionsCell id={props.data[props.row.index].id_biometrico} />
    ),
  },
  {
    Header: (props) => <CustomHeader tableProps={props} title='Dispositivo' className='min-w-250px' />,
    id: 'dispositivo',
    Cell: ({row}) => <InfoCell dispositivoBiometrico={row.original} />,
  },
  {
    Header: (props) => <CustomHeader tableProps={props} title='Conexión' className='min-w-150px' />,
    id: 'conexion',
    Cell: ({row}) => <ConnectionCell dispositivoBiometrico={row.original} />,
  },
  {
    Header: (props) => <CustomHeader tableProps={props} title='Serial' className='min-w-120px' />,
    accessor: 'serial',
    Cell: ({value}) => (
      <span className="fw-bold text-gray-800">{value}</span>
    ),
  },
  {
    Header: (props) => <CustomHeader tableProps={props} title='Ubicación' className='min-w-200px' />,
    id: 'ubicacion',
    Cell: ({row}) => (
      <div>
        <div className="text-gray-800 fw-bold">{row.original.ubicacion || 'No especificada'}</div>
        {row.original.ubicacion_descripcion && (
          <div className="text-muted fs-7">{row.original.ubicacion_descripcion}</div>
        )}
      </div>
    ),
  },
  {
    Header: (props) => <CustomHeader tableProps={props} title='Modelo/Firmware' className='min-w-150px' />,
    id: 'specs',
    Cell: ({row}) => (
      <div>
        {row.original.modelo && (
          <div className="text-gray-800 fw-bold fs-7">{row.original.modelo}</div>
        )}
        {row.original.firmware && (
          <div className="text-muted fs-8">v{row.original.firmware}</div>
        )}
        {row.original.platform && (
          <div className="badge badge-light-secondary fs-8 mt-1">{row.original.platform}</div>
        )}
      </div>
    ),
  },
  {
    Header: (props) => <CustomHeader tableProps={props} title='Estado' className='min-w-100px' />,
    id: 'estado',
    Cell: ({row}) => <StatusCell dispositivoBiometrico={row.original} />,
  },
]

export {Columns}