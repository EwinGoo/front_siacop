export * from './qrUtils'

// Re-export las funciones de parseID del módulo principal
export { parseCode, parseIDNumeric, extractCodeFromURL as parseExtractCode } from 'src/app/utils/parseID'
