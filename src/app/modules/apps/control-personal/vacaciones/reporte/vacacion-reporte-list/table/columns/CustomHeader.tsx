import clsx from 'clsx'
import {FC, PropsWithChildren, useMemo} from 'react'
import {HeaderProps} from 'react-table'
import {initialQueryState} from 'src/_metronic/helpers'
import {useQueryRequest} from '../../core/QueryRequestProvider'
import {Vacacion} from 'src/app/modules/apps/control-personal/vacaciones/core/_models'

type Props = {
  className?: string
  title?: string
  tableProps: PropsWithChildren<HeaderProps<Vacacion>>
}

const CustomHeader: FC<Props> = ({className, title, tableProps}) => {
  const id = tableProps.column.id
  const {state, updateState} = useQueryRequest()

  const isSelectedForSorting = useMemo(() => state.sort && state.sort === id, [state, id])
  const order: 'asc' | 'desc' | undefined = useMemo(() => state.order, [state])

  const sortColumn = () => {
    if (id === 'actions' || id === 'numero') return

    if (!isSelectedForSorting) {
      updateState({sort: id, order: 'asc', ...initialQueryState})
      return
    }

    if (isSelectedForSorting && order !== undefined) {
      if (order === 'asc') {
        updateState({sort: id, order: 'desc', ...initialQueryState})
        return
      }
      updateState({sort: undefined, order: undefined, ...initialQueryState})
    }
  }

  return (
    <th
      {...tableProps.column.getHeaderProps()}
      className={clsx(className, isSelectedForSorting && order !== undefined && `table-sort-${order}`)}
      style={{cursor: id === 'actions' || id === 'numero' ? 'default' : 'pointer'}}
      onClick={sortColumn}
    >
      {title}
    </th>
  )
}

export {CustomHeader}
