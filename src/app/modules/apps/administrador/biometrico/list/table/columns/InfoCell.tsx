import {FC} from 'react'
import {DispositivoBiometrico} from '../../core/_models'

type Props = {
  dispositivoBiometrico: DispositivoBiometrico
}

const InfoCell: FC<Props> = ({dispositivoBiometrico}) => (
  <div className='d-flex flex-column'>
    <div className='text-gray-800 text-hover-primary mb-1 fw-bold fs-6'>
      {dispositivoBiometrico.nombre_dispositivo}
    </div>
  </div>
)

export {InfoCell}
