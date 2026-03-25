import React from 'react'
import {UnifiedData} from '../../../types'

interface Props {
  data: UnifiedData
}

const EmpleadoInfo: React.FC<Props> = ({data}) => (
  <div className='bg-light p-3 rounded mb-3'>
    <h6 className='text-gray-700 mb-2 fw-semibold'>
      <i className='bi bi-person-badge me-2'></i>Información del Empleado
    </h6>
    <div className='row g-1 small'>
      <div className='col-4 fw-bold'>Nombre</div>
      <div className='col-8'>: {data.nombre_generador}</div>

      {data.ci && (
        <>
          <div className='col-4 fw-bold'>CI</div>
          <div className='col-8'>: {data.ci}</div>
        </>
      )}
      {data.nombre_cargo && (
        <>
          <div className='col-4 fw-bold'>Cargo</div>
          <div className='col-8'>: {data.nombre_cargo}</div>
        </>
      )}
      {data.tipo_personal && (
        <>
          <div className='col-4 fw-bold'>Tipo</div>
          <div className='col-8'>: {data.tipo_personal}</div>
        </>
      )}
      {data.unidad && (
        <>
          <div className='col-4 fw-bold'>Unidad</div>
          <div className='col-8'>: {data.unidad}</div>
        </>
      )}
    </div>
  </div>
)

export default EmpleadoInfo
