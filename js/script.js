import vuelosForm, { swap } from "./dataForm.js";

import { creacionFichaDeVuelos } from "./dataVuelos.js";

const buttonSwap = document.querySelector("button#cambio");
const buttonSubmit = document.querySelector("#viajar");
const { body } = document;

const toggleDisableButton = (button) => {
  button.toggleAttribute("disabled");
};

const resetInputs = () => {
  vuelosForm.elements.origen.value = "";
  vuelosForm.elements.destino.value = "";
};

const panelLoading = () => {
  const sectionLoading = document.createElement("section");
  sectionLoading.innerHTML = `<h1>Cargando vuelos...</h1>`;
  sectionLoading.classList.add("loading");
  body.prepend(sectionLoading);

  return sectionLoading;
};

const removePanel = (panel) => {
  panel.remove();
};

//Evento de cuando se hace el submit (Se le da al botón viajar);
vuelosForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (e.submitter === buttonSubmit) {
    toggleDisableButton(buttonSubmit);
    const sectionLoading = panelLoading();
    try {
      await creacionFichaDeVuelos();
    } catch (error) {
      alert(error);
    }
    removePanel(sectionLoading);
    resetInputs();
    toggleDisableButton(buttonSubmit);
  }
});

//Evento que cambia Origen/destino
buttonSwap.addEventListener("click", (e) => {
  swap();
});
