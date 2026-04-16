import {useEffect, useState} from 'react'
import {KTIcon} from '../../../../../../../../../_metronic/helpers'
import {useQueryRequest} from '../../core/QueryRequestProvider'

const ListSearchComponent = () => {
  const {updateState} = useQueryRequest()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      updateState({search: searchTerm || undefined, page: 1} as any)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  return (
    <div className='card-title'>
      <div className='d-flex align-items-center position-relative my-1'>
        <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
        <input
          type='text'
          className='form-control form-control-solid w-250px ps-14'
          placeholder='Buscar grupo...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  )
}

export {ListSearchComponent}
