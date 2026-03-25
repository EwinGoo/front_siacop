import {TipoPermiso} from '../types'
import {QRModule} from './types'

class ModuleRegistry {
  private modules = new Map<TipoPermiso, QRModule>()

  register(module: QRModule): void {
    this.modules.set(module.tipo, module)
  }

  get(tipo: TipoPermiso): QRModule {
    const module = this.modules.get(tipo)
    if (!module) {
      throw new Error(`Módulo QR no registrado para tipo: "${tipo}"`)
    }
    return module
  }

  has(tipo: TipoPermiso): boolean {
    return this.modules.has(tipo)
  }

  getAll(): QRModule[] {
    return Array.from(this.modules.values())
  }
}

export const moduleRegistry = new ModuleRegistry()
