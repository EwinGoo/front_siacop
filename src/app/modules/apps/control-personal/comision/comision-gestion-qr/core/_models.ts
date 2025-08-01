export interface ComisionData {
  id: string;
  codigo: string;
  empleado: string;
  descripcion_comision?: string;
  fecha_comision: string;
  nombre_cargo: string;
  estado: string;
}

export interface QRResult {
  code: string;
  timestamp: number;
  rawData?: any;
}

export type ComisionActionResponse = {
  confirmed: boolean;
  action?: string;
  observacion?: string;
};

export type StatusColor = {
  background: string;
  color: string;
};