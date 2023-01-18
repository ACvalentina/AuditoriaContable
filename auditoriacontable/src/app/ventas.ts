export interface Ventas{
    uid:string,
    anio: string,
    mes: string,
    cuenta: string,
    nro:string,
    tipoDoc:string,
    tipoVenta:string,
    rutCliente:string,
    razonSocial:string,
    folio:string,
    fechaDocto:string,  
    fechaRecepcion:string, 
    fechaAcuse:string,
    fechaReclamo:string,
    montoExento:string,
    montoNeto:string,
    montoIVA:string,
    montoTotal:string,
    IVARetenidoTotal:string,
    IVARetenidoParcial:string,
    IVANoRetenido:string,
    IVAPropio:string,
    IVATerceros:string,
    RUTEmisorLF:string,
    netoComisionLF:string,
    exentoComisionLF:string,
    IVAComisionLF:string,
    IVAFueraDePlazo:string,
    tipoDoctoReferencia:string,
    folioDoctoReferencia:string,
    numIdRecExtranjero:string,
    nacionalidadExtranjero:string,
    creditoEmpresaConstructora:string,
    imptoZonaFranca:string,
    garantiaDepEnvases:string,
    indicadorVentaSinCosto:string,
    indicadorServicioPeriodico:string,
    montoNoFacturable:string,
    totalMontoPeriodo:string,
    ventaPasajeNacional:string,
    ventaPasajeInternacional:string,
    numeroInterno:string,
    codigoSucursal:string,
    NCE_NDE:string,
    codigoOtroImp:string,
    valorOtroImp:string,
    tasaOtroImp:string,
    detalleActivoFijo: Array<string>
}