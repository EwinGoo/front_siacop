import {moduleRegistry} from './registry'
import {permisoModule} from './permisoModule'
import {comisionModule} from './comisionModule'
import {vacacionModule} from './vacacionModule'

// Registro de módulos QR disponibles
// Para agregar un nuevo módulo en el futuro: crear su archivo y registrarlo aquí
moduleRegistry.register(comisionModule)
moduleRegistry.register(permisoModule)
moduleRegistry.register(vacacionModule)

export {moduleRegistry}
export type {QRModule, ModuleModalProps, ModuleModalResult, AccionQR, QRModuleConfig} from './types'
