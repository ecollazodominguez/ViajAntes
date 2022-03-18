import vuelosForm, { swap } from "./dataForm.js";

import { creacionFichaDeVuelos } from "./dataVuelos.js";

const buttonSwap = document.querySelector("button#cambio");
const buttonSubmit = document.querySelector("#viajar");

//Evento de cuando se hace el submit (Se le da al botón viajar);
vuelosForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (e.submitter === buttonSubmit) {
    try {
      await creacionFichaDeVuelos();

      /* console.log(datos); */
    } catch (error) {
      alert(error.message);
    }
    vuelosForm.elements.origen.value = "";
    vuelosForm.elements.destino.value = "";
  }
});

//Evento que cambia Origen/destino
buttonSwap.addEventListener("click", (e) => {
  swap();
});
