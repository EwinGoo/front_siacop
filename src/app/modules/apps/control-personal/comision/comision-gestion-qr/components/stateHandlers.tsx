import Swal from 'sweetalert2';
import { ComisionData, ComisionActionResponse } from '../core/_models';

export const handleAprobadoState = (config: any): Promise<ComisionActionResponse> => {
  Object.assign(config, {
    showConfirmButton: true,
    showCancelButton: false,
    confirmButtonText: '<i class="bi bi-eye me-2"></i> Visto',
    confirmButtonColor: '#198754',
  });
  return Swal.fire(config).then((result) => ({confirmed: result.isConfirmed, action: 'view'}));
};

export const handleGeneradoState = (config: any): Promise<ComisionActionResponse> => {
  Object.assign(config, {
    showCancelButton: true,
    confirmButtonText: '<i class="bi bi-check-circle me-2"></i> Recepcionar',
    cancelButtonText: '<i class="bi bi-x-circle me-2"></i> Cerrar',
    confirmButtonColor: '#198754',
    cancelButtonColor: '#6c757d',
  });

  return Swal.fire(config).then((result) => ({
    confirmed: result.isConfirmed,
    action: result.isConfirmed ? 'reception' : undefined
  }));
};

export const handleRecepcionadoState = (config: any): Promise<ComisionActionResponse> => {
  Object.assign(config, {
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: '<i class="bi bi-check-circle me-2"></i> Aprobar',
    denyButtonText: '<i class="bi bi-exclamation-triangle me-2"></i> Observar',
    cancelButtonText: '<i class="bi bi-x-circle me-2"></i> Cerrar',
    confirmButtonColor: '#198754',
    denyButtonColor: '#ffc107',
    cancelButtonColor: '#6c757d',
  });

  return Swal.fire(config).then((result) => ({
    confirmed: result.isConfirmed || result.isDenied,
    action: result.isConfirmed ? 'approve' : result.isDenied ? 'observe' : undefined
  }));
};

export const handleObservadoState = (config: any): Promise<ComisionActionResponse> => {
  Object.assign(config, {
    showConfirmButton: true,
    showCancelButton: false,
    confirmButtonText: '<i class="bi bi-eye me-2"></i> Visto',
    confirmButtonColor: '#dc3545',
  });
  return Swal.fire(config).then((result) => ({confirmed: result.isConfirmed, action: 'view'}));
};

export const handleDefaultState = (config: any): Promise<ComisionActionResponse> => {
  Object.assign(config, {
    showConfirmButton: false,
    confirmButtonText: 'Cerrar',
  });
  return Swal.fire(config).then(() => ({confirmed: false}));
};

export const handleObservacionModal = async (comisionData: ComisionData): Promise<ComisionActionResponse> => {
  const {value: formValues} = await Swal.fire({
    title: 'Registrar Observación',
    html: `
    <div style="text-align: left;">
      <p><strong>Comisión:</strong> ${comisionData.codigo}</p>
      <p><strong>Empleado:</strong> ${comisionData.empleado}</p>
      <textarea id="observacion" class="swal2-textarea m-0" 
        placeholder="Ingrese los motivos de la observación..." 
        required style="width: 100%; min-height: 100px; margin-top: 10px;"></textarea>
    </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: '<i class="bi bi-send me-2"></i> Enviar Observación',
    cancelButtonText: '<i class="bi bi-x-circle me-2"></i> Cancelar',
    width: '600px',
    preConfirm: () => {
      const observacion = (document.getElementById('observacion') as HTMLTextAreaElement)?.value;
      if (!observacion?.trim()) {
        Swal.showValidationMessage('La observación es requerida');
        return false;
      }
      return {observacion};
    },
  });

  if (formValues) {
    return {
      confirmed: true,
      action: 'observe',
      observacion: formValues.observacion,
    };
  }
  return {confirmed: false};
};