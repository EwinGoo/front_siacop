import { useState } from 'react';
import Swal from 'sweetalert2';
import { ComisionData, ComisionActionResponse } from '../core/_models';
import { fetchComisionData, procesarRecepcion, aprobarComision, registrarObservacion } from '../core/_requests';

export const useComisionActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComisionAction = async (action: string, codigo: string, observacion?: string) => {
    setLoading(true);
    try {
      switch (action) {
        case 'reception':
          await procesarRecepcion(codigo);
          break;
        case 'approve':
          await aprobarComision(codigo);
          break;
        case 'observe':
          if (observacion) {
            await registrarObservacion(codigo, observacion);
          }
          break;
        default:
          break;
      }
      return true;
    } catch (err) {
      setError('Error al procesar la acción');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleComisionAction,
    fetchComisionData
  };
};