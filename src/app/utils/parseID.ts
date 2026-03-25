import { ID } from "src/_metronic/helpers";

interface ParseIDOptions {
  validate_numeric?: boolean;  // Validar que el resultado sea numérico
  return_int?: boolean;        // Retornar como entero
}

/**
 * Quita el primer carácter del ID solo si es una letra
 * 
 * @param id ID desde ruta (:alphanum)
 * @param options Opciones adicionales
 * @returns ID procesado
 */
export function parseID(id: string, options: ParseIDOptions = {}): string | number {
  // Configuración por defecto
  const config: Required<ParseIDOptions> = {
    validate_numeric: false,
    return_int: false,
    ...options
  };

  // Verificar si el primer carácter es una letra
  const firstChar = id[0] ?? '';
  const isLetter = /^[a-zA-Z]$/.test(firstChar);

  // Solo quitar el primer carácter si es una letra
  const processedId = isLetter ? id.substring(1) : id;

  // Validar que sea numérico si se requiere
  if (config.validate_numeric && !isNumeric(processedId)) {
    throw new Error(`ID procesado debe ser numérico: ${processedId}`);
  }

  // Retornar como entero si se requiere
  if (config.return_int && isNumeric(processedId)) {
    return parseInt(processedId, 10);
  }

  return processedId;
}

/**
 * Versión que garantiza retorno numérico
 */
export function parseIDNumeric(id: string): number {
  return parseID(id, {
    validate_numeric: true,
    return_int: true
  }) as number;
}

/**
 * Extrae el prefijo del código QR
 * 
 * @param code Código QR completo (ej: 'P123', 'C456', 'V789')
 * @returns Prefijo en mayúscula ('P', 'C', 'V')
 */
export function extractPrefix(code: string): string {
  const firstChar = code[0]?.toUpperCase() ?? '';
  return /^[A-Z]$/.test(firstChar) ? firstChar : '';
}

/**
 * ⭐ NUEVO: Determina el tipo de permiso basado en el prefijo del código
 * 
 * C = hora (Comisiones)
 * P = dia (Permisos)
 * V = vacacion (Vacaciones)
 * 
 * @param code Código QR completo (ej: 'C123', 'P456', 'V789')
 * @returns Tipo de permiso ('hora', 'dia', 'vacacion')
 */
export function parseCode(code: string): 'hora' | 'dia' | 'vacacion' {
  const prefix = extractPrefix(code);
  
  switch (prefix) {
    case 'C':
      return 'hora';
    case 'P':
      return 'dia';
    case 'V':
      return 'vacacion';
    default:
      // Por defecto retorna 'hora' si no reconoce el prefijo
      return 'hora';
  }
}

/**
 * ⭐ NUEVO: Extrae el código limpio de una URL o texto
 * 
 * Ejemplos:
 * - 'https://app.com/qr/C123' → 'C123'
 * - 'C123?param=value' → 'C123'
 * - 'C123' → 'C123'
 * 
 * @param input URL o texto que contiene el código
 * @returns Código limpio
 */
export function extractCodeFromURL(input: string): string {
  try {
    let code = input.trim();
    
    // Si contiene '/', obtener la última parte
    if (code.includes('/')) {
      const parts = code.split('/');
      code = parts[parts.length - 1];
    }
    
    // Si contiene '?', obtener solo la parte antes de los parámetros
    if (code.includes('?')) {
      code = code.split('?')[0];
    }
    
    return code.trim();
  } catch (error) {
    console.error('Error al extraer código:', error);
    return input;
  }
}

/**
 * Convierte un ID numérico a código con prefijo
 * 
 * @param id ID numérico (ej: 123)
 * @param prefix Prefijo ('P', 'C', 'V', 'p', 'c', 'v')
 * @returns Código con prefijo (ej: 'P123', 'C456', 'V789')
 */
export function buildCode(id: string | number | ID, prefix: string): string {
  const numericId = typeof id === 'string' ? id : id!.toString();
  const upperPrefix = prefix.toUpperCase();
  
  return `${upperPrefix}${numericId}`;
}

/**
 * Función auxiliar para verificar si un string es numérico
 */
function isNumeric(value: string): boolean {
  return !isNaN(Number(value)) && !isNaN(parseFloat(value));
}