import { ID } from "src/_metronic/helpers";
import { ModalidadPermiso } from "../modules/apps/control-personal/gestion-qr";

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
 * Extrae el primer carácter del código y determina el tipo de permiso
 * C = hora, P = dia
 * 
 * @param code Código QR completo
 * @returns Tipo de permiso basado en el primer carácter
 */
export function parseCode(code: string): 'hora' | 'dia' {
  const firstChar = code[0]; // 🔧 CAMBIO: usar primer carácter en lugar del último
  
  // Si el primer carácter es una letra
  if (/^[a-zA-Z]$/.test(firstChar)) {
    const upperChar = firstChar.toUpperCase();
    switch (upperChar) {
      case 'C':
        return 'hora';
      case 'P':
        return 'dia';
      default:
        return 'hora'; // Por defecto
    }
  }
  
  // Si es un dígito, usar lógica numérica (opcional)
  if (/^[0-9]$/.test(firstChar)) {
    const digit = parseInt(firstChar, 10);
    // Ejemplo: pares = hora, impares = dia
    return digit % 2 === 0 ? 'hora' : 'dia';
  }
  
  // Por defecto retorna 'hora'
  return 'hora';
}

/**
 * Convierte un ID numérico de vuelta a su formato con prefijo según el tipo
 * 
 * @param id ID numérico (ej: 6)
 * @param tipoPermiso Tipo de permiso ('hora' o 'dia')
 * @returns Código con prefijo (ej: 'C6' o 'P6')
 */
export function buildCode(id: string | number | ID, tipoPermiso: ModalidadPermiso): string {
  const numericId = typeof id === 'string' ? id : id!.toString();
  
  switch (tipoPermiso) {
    case 'hora':
      return `C${numericId}`;
    case 'dia':
      return `P${numericId}`;
    default:
      return `C${numericId}`; // Por defecto usa C
  }
}

/**
 * Función auxiliar para verificar si un string es numérico
 */
function isNumeric(value: string): boolean {
  return !isNaN(Number(value)) && !isNaN(parseFloat(value));
}

// Para usar en tu hook, importa así:
// import { parseID, parseIDNumeric, parseCode, buildCode } from './utils/parseID';

// Ejemplos de uso parseCode (ACTUALIZADOS):
/*
console.log(parseCode("C123"));    // "hora" ✅
console.log(parseCode("P456"));    // "dia" ✅  
console.log(parseCode("c789"));    // "hora" (case insensitive)
console.log(parseCode("p012"));    // "dia" (case insensitive)
console.log(parseCode("2345"));    // "hora" (dígito par al inicio)
console.log(parseCode("3456"));    // "dia" (dígito impar al inicio)
console.log(parseCode("X123"));    // "hora" (letra desconocida, default)

// Casos de tus logs:
console.log(parseCode("P1"));      // "dia" ✅
console.log(parseCode("C1"));      // "hora" ✅ (ahora correcto)

// Ejemplos de uso buildCode:
console.log(buildCode("6", "hora"));    // "C6" ✅
console.log(buildCode("6", "dia"));     // "P6" ✅
console.log(buildCode(123, "hora"));    // "C123" ✅
console.log(buildCode(456, "dia"));     // "P456" ✅
*/