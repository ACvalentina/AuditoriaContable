import { DatosCuenta } from "./datos-cuenta";

export interface InfoComprobante {
    datosCuenta: DatosCuenta,
    fecha: string,
    glosaIndex:string,
    numComprobante:string,
    tipoComprobante:string,
    tipoDocumento:string
}
