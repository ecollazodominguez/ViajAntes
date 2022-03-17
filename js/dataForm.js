"use strict";

import { checkIataCode } from "./dataVuelos.js";

//formulario
const vuelosForm = document.forms.formulario_vuelos;

//función que comprueba que las longitudes son correctas.
function checkLength(numero, origen, destino) {
  if (origen.length !== numero && destino.length !== numero) {
    throw new Error("Origen y Destino no son 3 letras, Intentalo de nuevo.");
  } else if (origen.length !== numero) {
    throw new Error("Origen no son 3 letras, Intentalo de nuevo.");
  } else if (destino.length !== numero) {
    throw new Error("Destino no son 3 letras, Intentalo de nuevo.");
  }
}

//función que comprueba que origen y destino sean iguales o no.
function checkSameInput(origen, destino) {
  if (origen.toUpperCase() === destino.toUpperCase()) {
    throw new Error("El Origen y el destino no puede ser el mismo");
  }
}

//Función para conseguir el día siguiente
function getNextDay() {
  //cojo la fecha de hoy
  const fechaHoy = new Date();
  //cojo el Día (numero) de hoy
  const diaActual = fechaHoy.getDate();
  //cojo otra vez la fecha de hoy para luego añadirle 1 día más
  const fechaManiana = new Date();
  fechaManiana.setDate(diaActual + 1);

  let formatFecha = fechaManiana.toISOString();
  //formateamos el string en ISO (YYY-MM-DD HH:MM:SS) y recortamos para solo coger la fecha
  return formatFecha.slice(0, 10);
}

//función que cambia valores Origen/Destino entre sí, usamos una variable auxiliar para no perder un valor.
function swap() {
  const aux = vuelosForm.elements.origen.value;
  vuelosForm.elements.origen.value = vuelosForm.elements.destino.value;
  vuelosForm.elements.destino.value = aux;
}

//Función que recoge los datos del form y los devuelve como objeto.
async function getDataForm() {
  let origen = vuelosForm.elements.origen.value;
  let destino = vuelosForm.elements.destino.value;
  const pasajeros = "1";
  const fecha = getNextDay();

  //comprobamos que los inputs tengan los requisitos que pedimos e incluso si es un codigo IATA
  checkSameInput(origen, destino);
  checkLength(3, origen, destino);
  await checkIataCode(origen);
  await checkIataCode(destino);

  return {
    origen,
    destino,
    pasajeros,
    fecha,
  };
}

export default vuelosForm;
export { getDataForm, swap };
