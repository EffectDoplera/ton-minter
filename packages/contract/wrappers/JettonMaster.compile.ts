import { CompilerConfig } from '@ton/blueprint'

export const compile: CompilerConfig = {
  lang: 'tact',
  target: 'contracts/jetton_master.tact',
  options: {
    debug: true,
    interfacesGetter: true,
  },
}
