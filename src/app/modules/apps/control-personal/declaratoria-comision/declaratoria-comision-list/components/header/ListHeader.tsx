import {useListView} from '../../core/ListViewProvider'
import {ListToolbar} from './ListToolbar'
import {ListGrouping} from './ListGrouping'
import {ListSearchComponent} from './ListSearchComponent'
import {ListColumnVisibilitySelector} from './ListColumnVisibilitySelector'

interface ListHeaderProps {
  columnConfig?: Array<{
    id: string
    title: string
    isVisible: boolean
    isRequired: boolean
  }>
  onToggleColumn?: (columnId: string) => void
  onShowAllColumns?: () => void
  onHideAllColumns?: () => void
  onResetColumns?: () => void
}

const ListHeader: React.FC<ListHeaderProps> = ({
  columnConfig,
  onToggleColumn,
  onShowAllColumns,
  onHideAllColumns,
  onResetColumns,
}) => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6'>
      {/* <ListColumnVisibilitySelector/> */}
      <ListSearchComponent
        columnConfig={columnConfig}
        onToggleColumn={onToggleColumn}
        onShowAllColumns={onShowAllColumns}
        onHideAllColumns={onHideAllColumns}
        onResetColumns={onResetColumns}
      />
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {selected.length > 0 ? <ListGrouping /> : <ListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {ListHeader}
