"use strict";

const ulVuelos = document.querySelector("ul");

/* Creación de ficha de Vuelo, para el DOM */

const creacionFichaDeVuelos = (array) => {
  const datosDelArray = array.map((datoSacado) => {
    return ` 
        <img src="" alt="Imagen de avión placeholder">
        <h3>${datoSacado.precio} " " ${datoSacado.tipoBillete}</h3> 
        <p>¿Incluye facturación?${datoSacado.facturacion}</p>
        <article>${datoSacado.fechaSalida}" "${datoSacado.tiempoSalida} " "${datoSacado.terminal} </article>
        <article>${datoSacado.aerolinea} ${datoSacado.codigoAerolinea} </article>
        `;
  });

  ulVuelos.innerHTML = `<li>${datosDelArray}</li>`;
};
