import { ComisionData, StatusColor } from './_models';

export const getStatusColor = (estado: string): StatusColor => {
  const colors: Record<string, StatusColor> = {
    APROBADO: { background: '#e8f5e9', color: '#2e7d32' },
    RECEPCIONADO: { background: '#fff3e0', color: '#f57c00' },
    OBSERVADO: { background: '#ffebee', color: '#c62828' },
    GENERADO: { background: '#e3f2fd', color: '#1565c0' },
  };
  return colors[estado.toUpperCase()] || { background: '#f5f5f5', color: '#424242' };
};

export const getComisionHtmlContent = (comisionData: ComisionData, formatDate: (date: string) => string) => {
  return `
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
      <h6 style="color: #495057; margin-bottom: 10px; font-weight: 600;">
        <i class="bi bi-person-badge" style="margin-right: 8px;"></i>Información del Empleado
      </h6>
      <p style="margin: 5px 0;"><strong>Empleado:</strong> ${comisionData.empleado}</p>
      <p style="margin: 5px 0;"><strong>Departamento:</strong> ${comisionData.nombre_cargo || 'N/A'}</p>
    </div>
    
    <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
      <h6 style="color: #1976d2; margin-bottom: 10px; font-weight: 600;">
        <i class="bi bi-geo-alt" style="margin-right: 8px;"></i>Detalles de la comisión
      </h6>
      <p style="margin: 5px 0;"><strong>Código:</strong> ${comisionData.codigo}</p>
      <p style="margin: 5px 0;"><strong>Fecha comisión:</strong> ${formatDate(comisionData.fecha_comision)}</p>
      <p style="margin: 5px 0;"><strong>Motivo:</strong> ${comisionData.descripcion_comision}</p>
    </div>
    
    <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
      <h6 style="color: #7b1fa2; margin-bottom: 10px; font-weight: 600;">
        <i class="bi bi-info-circle" style="margin-right: 8px;"></i>Estado
      </h6>
      <p style="margin: 5px 0;"><strong>Estado:</strong> 
        <span style="background: ${getStatusColor(comisionData.estado).background}; 
          color: ${getStatusColor(comisionData.estado).color}; 
          padding: 2px 8px; border-radius: 4px; font-size: 12px;">
          ${comisionData.estado}
        </span>
      </p>
    </div>
  `;
};