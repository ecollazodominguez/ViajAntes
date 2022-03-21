"use strict";

import { checkIataCode } from "./dataVuelos.js";

//formulario
const vuelosForm = document.forms.formulario_vuelos;

//Creamos una funcion de retardo.
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

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
  let escala = vuelosForm.elements.escala.checked;
  const pasajeros = "1";
  const fecha = getNextDay();

  //comprobamos que los inputs tengan los requisitos que pedimos e incluso si es un codigo IATA
  checkSameInput(origen, destino);
  await checkIataCode(origen);
  //provocamos un pequeño retardo para que no se apilen las peticiones y de error.
  await delay();
  await checkIataCode(destino);

  return {
    origen,
    destino,
    pasajeros,
    fecha,
    escala,
  };
}

export default vuelosForm;
export { getDataForm, swap };
