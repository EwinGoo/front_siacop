/**
 * Formatea un array de objetos a opciones de select
 * @param data - Array de datos a formatear
 * @param config - Configuración de mapeo de campos
 * @returns Array de opciones formateadas para select
 */
export interface SelectOption {
  label: string
  value: string
}

export interface FormatConfig {
  labelField: string
  valueField: string
  /** Si true, convierte el valor a string. Por defecto: true */
  stringifyValue?: boolean
  /** Función personalizada para transformar el label */
  labelTransform?: (label: any) => string
  /** Función personalizada para transformar el value */
  valueTransform?: (value: any) => string
}

/**
 * Función principal para formatear datos a opciones de select
 */
export function formatToSelectOptions<T>(data: T[], config: FormatConfig): SelectOption[] {
  const {labelField, valueField, stringifyValue = true, labelTransform, valueTransform} = config

  return data.map((item: any) => {
    let label = item[labelField]
    let value = item[valueField]

    // Aplicar transformaciones personalizadas
    if (labelTransform) {
      label = labelTransform(label)
    }

    if (valueTransform) {
      value = valueTransform(value)
    } else if (stringifyValue) {
      value = value?.toString() || ''
    }

    return {
      label: label || '',
      value: value,
    }
  })
}

// Funciones de conveniencia para casos comunes
export const formatUtils = {
  /**
   * Para casos donde el ID es el value y nombre es el label
   */
  unidades: <T>(data: T[]) =>
    formatToSelectOptions(data, {
      valueField: 'id_unidad_sede',
      labelField: 'unidad',
    }),
  /**
   * Para casos donde el ID es el value y nombre es el label
   */
  idNombre: <T>(data: T[]) =>
    formatToSelectOptions(data, {
      labelField: 'nombre',
      valueField: 'id',
    }),

  /**
   * Para permisos específicamente
   */
  tiposPermisos: <T>(data: T[]) =>
    formatToSelectOptions(data, {
      labelField: 'nombre',
      valueField: 'id_tipo_permiso',
    }),

  /**
   * Para usuarios
   */
  usuarios: <T>(data: T[]) =>
    formatToSelectOptions(data, {
      labelField: 'nombre_completo',
      valueField: 'id_usuario',
    }),

//   /**
//    * Para departamentos/unidades
//    */
//   unidades: <T>(data: T[]) =>
//     formatToSelectOptions(data, {
//       labelField: 'descripcion_cua',
//       valueField: 'id_unidad_sede',
//     }),

  /**
   * Combinando campos para el label
   */
  nombreCompleto: <T>(data: T[]) =>
    formatToSelectOptions(data, {
      labelField: 'nombre',
      valueField: 'id',
      labelTransform: (item: any) => `${item.nombre} ${item.apellido || ''}`.trim(),
    }),

  /**
   * Para casos donde necesitas mostrar código + nombre
   */
  codigoNombre: <T>(data: T[]) =>
    formatToSelectOptions(data, {
      labelField: 'nombre',
      valueField: 'id',
      labelTransform: (item: any) =>
        item.codigo ? `${item.codigo} - ${item.nombre}` : item.nombre,
    }),
}

// Ejemplos de uso:

/*
// Uso básico
const tiposPermisosOptions = formatToSelectOptions(tiposPermisos, {
  labelField: 'nombre',
  valueField: 'id_tipo_permiso'
});

// Usando funciones de conveniencia
const tiposPermisosOptions = formatUtils.tiposPermisos(tiposPermisos);
const unidadesOptions = formatUtils.unidades(unidades);
const usuariosOptions = formatUtils.usuarios(usuarios);

// Con transformación personalizada
const permisosConCodigo = formatToSelectOptions(tiposPermisos, {
  labelField: 'nombre',
  valueField: 'id_tipo_permiso',
  labelTransform: (item) => `${item.codigo} - ${item.nombre}`
});

// En tu componente React:
options={formatUtils.tiposPermisos(tiposPermisos)}

// O con la función principal:
options={formatToSelectOptions(tiposPermisos, {
  labelField: 'nombre',
  valueField: 'id_tipo_permiso'
})}
*/
