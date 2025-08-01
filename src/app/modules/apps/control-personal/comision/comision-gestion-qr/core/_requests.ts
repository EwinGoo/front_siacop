import {
  getComisionById,
  procesarEstadoComision,
} from '../../comision-list/core/_requests';
import { ComisionData } from './_models';

export const fetchComisionData = async (codigo: string): Promise<ComisionData> => {
  const id = Number(codigo);
  if (isNaN(id)) {
    throw new Error('El código QR no es válido. Debe contener un ID numérico.');
  }

  const response = await getComisionById(id);
  
  const mostrarDestino = () => {
    if (response.descripcion_comision?.trim()) {
      return response.descripcion_comision;
    }
    if (response.recorrido_de && response.recorrido_a) {
      return `${response.recorrido_de} → ${response.recorrido_a}`;
    }
    return 'Destino no especificado';
  };

  return {
    id: response.id_comision?.toString() || codigo,
    codigo,
    empleado: response.nombre_generador || 'Nombre no disponible',
    nombre_cargo: response.nombre_cargo || 'Cargo no disponible',
    descripcion_comision: mostrarDestino(),
    fecha_comision: response.fecha_comision || '2024-01-01',
    estado: response.estado_boleta_comision || 'Pendiente',
  };
};

export const procesarRecepcion = async (codigo: string) => {
  return await procesarEstadoComision({ code: parseInt(codigo), action: 'receive' });
};

export const aprobarComision = async (codigo: string) => {
  return await procesarEstadoComision({ code: parseInt(codigo), action: 'approve' });
};

export const registrarObservacion = async (codigo: string, observacion: string) => {
  return await procesarEstadoComision({ 
    code: parseInt(codigo), 
    action: 'observe', 
    observacion 
  });
};