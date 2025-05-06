import {KTIcon} from '../../../../../../../../../_metronic/helpers'
import {FC} from 'react'

type Props = {
  descripcion: string
}

const DescripcionCell: FC<Props> = ({descripcion}) => (
  // <div className='badge badge-light fw-bolder'>{descricion}</div>
  <span className='text-muted fw-bold'>
    <KTIcon iconName='document' className='fs-5 mx-1' />
    {/* {descripcion.substring(0, 100)} */}
    {descripcion}
  </span>
)

export {DescripcionCell}
