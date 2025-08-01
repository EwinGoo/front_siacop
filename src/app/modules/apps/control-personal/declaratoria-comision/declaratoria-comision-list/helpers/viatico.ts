import { TipoViatico } from "../core/_models"

export const parseTipoViaticoFromApi = (valor: string): boolean => valor === 'con_viatico'

export const parseTipoViaticoToApi = (valor: boolean): string =>
  valor ? ('con_viatico' as TipoViatico) : ('sin_viatico' as TipoViatico)
