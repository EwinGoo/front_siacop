import Swal from 'sweetalert2';
import { ComisionData, ComisionActionResponse } from '../core/_models';
import { getComisionHtmlContent } from '../core/_utils';
import { handleAprobadoState, handleDefaultState, handleGeneradoState, handleObservadoState, handleRecepcionadoState } from './stateHandlers';

export const showComisionData = async (
  comisionData: ComisionData,
  formatDate: (date: string) => string
): Promise<ComisionActionResponse> => {
  const swalConfig: any = {
    title: 'Datos de la Comisión',
    html: getComisionHtmlContent(comisionData, formatDate),
    icon: 'info',
    width: '600px',
    customClass: { popup: 'animated fadeInDown' },
  };

  switch (comisionData.estado.toUpperCase()) {
    case 'APROBADO':
      return handleAprobadoState(swalConfig);
    case 'GENERADO':
      return handleGeneradoState(swalConfig);
    case 'RECEPCIONADO':
      return handleRecepcionadoState(swalConfig);
    case 'OBSERVADO':
      return handleObservadoState(swalConfig);
    default:
      return handleDefaultState(swalConfig);
  }
};

// Implementar las funciones handle...State similares a las que ya tienes