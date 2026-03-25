import {Column} from 'react-table'
import {Vacacion} from 'src/app/modules/apps/control-personal/vacaciones/core/_models'
import {CustomHeader} from './CustomHeader'

const ESTADO_BADGE: Record<string, string> = {
  GENERADO:     'badge-light-primary',
  ENVIADO:      'badge-light-info',
  RECEPCIONADO: 'badge-light-warning',
  APROBADO:     'badge-light-success',
  OBSERVADO:    'badge-light-danger',
}

const Columns: ReadonlyArray<Column<Vacacion>> = [
  {
    Header: (props) => <CustomHeader tableProps={props} title='N°' className='w-30px text-center' />,
    id: 'numero',
    Cell: ({row}) => <span className='text-center d-block'>{row.index + 1}</span>,
  },
  {
    Header: (props) => <CustomHeader tableProps={props} title='CI' className='min-w-80px' />,
    accessor: 'ci',
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Nombre y Apellidos' className='min-w-200px' />
    ),
    accessor: 'nombre_generador',
  },
  {
    Header: (props) => <CustomHeader tableProps={props} title='Cargo' className='min-w-150px' />,
    accessor: 'nombre_cargo',
    Cell: ({value}) => <span className='fs-7'>{value}</span>,
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Tipo' className='min-w-100px text-center' />
    ),
    accessor: 'tipo_solicitud',
    Cell: ({value}) => <span className='text-center d-block'>{value}</span>,
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='F. Solicitud' className='min-w-110px text-center' />
    ),
    accessor: 'fecha_solicitud',
    Cell: ({value}) => (
      <span className='text-center d-block'>{value ? value.split(' ')[0] : ''}</span>
    ),
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='F. Inicio' className='min-w-110px text-center' />
    ),
    accessor: 'fecha_vacacion_inicio',
    Cell: ({value}) => <span className='text-center d-block'>{value}</span>,
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='F. Fin' className='min-w-110px text-center' />
    ),
    accessor: 'fecha_vacacion_fin',
    Cell: ({value}) => <span className='text-center d-block'>{value}</span>,
  },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Días Sol.' className='min-w-80px text-center' />
    ),
    accessor: 'dias_solicitado',
    Cell: ({value}) => <span className='text-center d-block'>{value}</span>,
  },
  // {
  //   Header: (props) => (
  //     <CustomHeader tableProps={props} title='Saldo' className='min-w-80px text-center' />
  //   ),
  //   accessor: 'dias_saldo',
  //   Cell: ({value}) => <span className='text-center d-block'>{value}</span>,
  // },
  {
    Header: (props) => (
      <CustomHeader tableProps={props} title='Estado' className='min-w-120px text-center' />
    ),
    accessor: 'estado_vacacion',
    Cell: ({value}) => (
      <div className='text-center'>
        <span className={`badge ${ESTADO_BADGE[value] ?? 'badge-light'}`}>{value}</span>
      </div>
    ),
  },
]

export {Columns}
