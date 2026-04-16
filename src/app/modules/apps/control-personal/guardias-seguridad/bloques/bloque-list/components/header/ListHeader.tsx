import {ListSearchComponent} from './ListSearchComponent'
import {ListToolbar} from './ListToolbar'

const ListHeader = () => (
  <div className='card-header border-0 pt-6'>
    <ListSearchComponent />
    <div className='card-toolbar'>
      <ListToolbar />
    </div>
  </div>
)

export {ListHeader}
