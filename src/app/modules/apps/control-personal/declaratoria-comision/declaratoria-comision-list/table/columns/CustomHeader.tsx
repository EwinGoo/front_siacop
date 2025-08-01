import clsx from 'clsx';
import { FC, PropsWithChildren, useMemo } from 'react';
import { HeaderProps } from 'react-table';
import { initialQueryState } from '../../../../../../../../_metronic/helpers';
import { useQueryRequest } from '../../core/QueryRequestProvider';
import { DeclaratoriaComision } from '../../core/_models';

type Props = {
  className?: string;
  title?: string;
  tableProps: PropsWithChildren<HeaderProps<DeclaratoriaComision>>;
};

const CustomHeader: FC<Props> = ({ className, title, tableProps }) => {
  const id = tableProps.column.id;
  const { state, updateState } = useQueryRequest();

  const isSelectedForSorting = useMemo(() => {
    return state.sort && state.sort === id;
  }, [state, id]);

  const order: 'asc' | 'desc' | undefined = useMemo(() => state.order, [state]);

  const sortColumn = () => {
    // Evitar ordenamiento para estas columnas
    if (id === 'actions' || id === 'selection') {
      return;
    }

    if (!isSelectedForSorting) {
      // Habilitar orden ascendente
      console.log(initialQueryState);
      
      updateState({ sort: id, order: 'asc', ...initialQueryState });
      return;
    }

    if (isSelectedForSorting && order !== undefined) {
      if (order === 'asc') {
        // Habilitar orden descendente
        updateState({ sort: id, order: 'desc', ...initialQueryState });
        return;
      }

      // Deshabilitar ordenamiento
      updateState({ sort: undefined, order: undefined, ...initialQueryState });
    }
  };

  return (
    <th
      {...tableProps.column.getHeaderProps()}
      className={clsx(
        className,
        isSelectedForSorting && order !== undefined && `table-sort-${order}`
      )}
      style={{ cursor: 'pointer' }}
      onClick={sortColumn}
    >
      {title}
    </th>
  );
};

export { CustomHeader };