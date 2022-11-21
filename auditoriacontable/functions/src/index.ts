import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import { event } from "firebase-functions/v1/analytics";
admin.initializeApp();

exports.updateIndex = functions.firestore.document('Cuentas/{cuentaId}').onCreate(event => {
    const cuentaId = event.data().cuentaId;
    const cuenta = event.data();

    const searchableIndex = createIndex(cuenta.nombre)

    const indexedCuenta = { ...cuenta, searchableIndex}

    const db = admin.firestore()
    return db.collection('Cuentas').doc(cuentaId).set(indexedCuenta, {merge: true})
})

function createIndex(nombre: string){
    const arr = nombre.toLowerCase().split('');
    const searchableIndex: {[key:string]:boolean} = {};

    let prevKey = '';
    
    for (const char of arr){
        const key = prevKey + char;
        searchableIndex[key] = true
        prevKey = key
    }

    return searchableIndex
}

