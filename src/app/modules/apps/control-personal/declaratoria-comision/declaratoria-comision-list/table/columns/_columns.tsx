// @ts-nocheck
import {Column} from 'react-table'
import {ActionsCell} from './ActionsCell'
import {CustomHeader} from './CustomHeader'
import {DeclaratoriaComision} from '../../core/_models'

const Columns: ReadonlyArray<Column<DeclaratoriaComision>> = [
  {
    Header: (props) => <CustomHeader tableProps={props} title='Nro' className='min-w-50px' />,
    id: 'rowNumber',
    Cell: ({row}) => <span>{row.index + 1}</span>,
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Solicitante' className='min-w-150px' />
    ),
    accessor: 'nombre_generador',
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='CI' className='min-w-100px' />
    ),
    accessor: 'id_de',
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='CI' className='min-w-100px' />
    ),
    accessor: 'ci',
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Periodo' className='min-w-200px' />
    ),
    id: 'periodo',
    Cell: ({row}) => {
      const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-')
        return `${day}/${month}/${year}`
      }
      return (
        <span className='fw-bold'>
          {formatDate(row.original.fecha_inicio)} - {formatDate(row.original.fecha_fin)}
        </span>
      )
    },
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Destino' className='min-w-150px' />
    ),
    accessor: 'destino',
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Viático' className='min-w-100px' />
    ),
    accessor: 'tipo_viatico',
    Cell: ({value}) => (
      <span className={`badge badge-light-${value === 'con_viatico' ? 'success' : 'primary'}`}>
        {value === 'con_viatico' ? 'Con viático' : 'Sin viático'}
      </span>
    ),
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='HR N°' className='min-w-100px' />
    ),
    accessor: 'rrhh_hoja_ruta_numero',
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Motivo' className='min-w-250px' />
    ),
    accessor: 'motivo',
    Cell: ({value}) => (
      <div className='text-truncate' style={{maxWidth: '250px'}} title={value}>
        {value}
      </div>
    ),
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Elaboración' className='min-w-120px' />
    ),
    accessor: 'fecha_elaboracion',
    Cell: ({value}) => {
      const [year, month, day] = value.split('-')
      return `${day}/${month}/${year}`
    },
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Acciones' className='text-end min-w-150px' />
    ),
    id: 'actions',
    Cell: ({...props}) => (
      <ActionsCell
        id={props.data[props.row.index].id_declaratoria_comision}
      />
    ),
  },
]

export {Columns}