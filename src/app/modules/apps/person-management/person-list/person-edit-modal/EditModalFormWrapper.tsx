import { useQuery } from 'react-query';
import { EditModalForm } from './EditModalForm';
import { isNotEmpty, QUERIES } from '../../../../../../_metronic/helpers';
import { useListView } from '../core/ListViewProvider';
import { getPersonaById } from '../core/_requests';

const EditModalFormWrapper = ({onClose}) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate);
  const {
    isLoading,
    data: persona,
    error,
  } = useQuery(
    `${QUERIES.PERSONAS_LIST}-persona-${itemIdForUpdate}`,
    () => {
      return getPersonaById(itemIdForUpdate);
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIdForUpdate(undefined);
        console.error(err);
      },
    }
  );

  if (!itemIdForUpdate) {
    return <EditModalForm onClose={onClose} isPersonaLoading={isLoading} persona={{ id: undefined }} />;
  }

  if (!isLoading && !error && persona) {
    return <EditModalForm onClose={onClose} isPersonaLoading={isLoading} persona={persona} />;
  }

  return null;
};

export { EditModalFormWrapper };