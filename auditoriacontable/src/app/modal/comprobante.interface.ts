export interface Comprobante{
    id: number
    numComprobante?: string
    tipoComprobante: string //cambiar esto a tipo select
    fecha: Date
    tipoDocumento: string //cambiar esto a tipo select
    glosaIndex: string
    datosCuenta: ComprobanteDatosCuenta[]
}

export interface ComprobanteDatosCuenta {
    cuentaInput:string
    glosaInput: string
    centroInput: string
    sucursalInput: string
    debeInput: string //cambiar a tipo array
    haberInput: string //cambiar a tipo array
  }