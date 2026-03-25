// @ts-nocheck
import clsx from 'clsx'
import {FC} from 'react'
import {Row} from 'react-table'
import {Vacacion} from 'src/app/modules/apps/control-personal/vacaciones/core/_models'

type Props = {
  row: Row<Vacacion>
}

const CustomRow: FC<Props> = ({row}) => (
  <tr {...row.getRowProps()}>
    {row.cells.map((cell) => (
      <td
        {...cell.getCellProps()}
        className={clsx({'': cell.column.id === 'actions'})}
      >
        {cell.render('Cell')}
      </td>
    ))}
  </tr>
)

export {CustomRow}
