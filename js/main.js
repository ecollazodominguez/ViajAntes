import vuelosForm, { swap } from "./dataForm.js";

import { creacionFichaDeVuelos } from "./dataVuelos.js";

const buttonSwap = document.querySelector("button#cambio");
const buttonSubmit = document.querySelector("#viajar");
const { body } = document;
const botonModo = document.querySelector("#modo");
const html = document.querySelector("html");

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

//funcion que segun si tiene la clase "collapsed" el article se expande o se colapsa
const collapseDetallesBillete = (e) => {
  const articleToggle = e.target.querySelector("article#collapse");
  articleToggle.classList.toggle("collapsed");
};

//función que recoge todos los elementos LI.BILLETE y los recorre agregandole el evento con la funcion collapse
const handlerCollapse = (billetes) => {
  for (let i = 0; i < billetes.length; i++) {
    billetes[i].addEventListener("click", collapseDetallesBillete);
  }
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
      alert(error.message);
    }

    //Creamos el evento cuando los elementos están creados y asi poder hacer el collapse
    const liBillete = document.querySelectorAll("li.billete");
    handlerCollapse(liBillete);

    removePanel(sectionLoading);
    resetInputs();
    toggleDisableButton(buttonSubmit);
  }
});

//Evento que cambia Origen/destino
buttonSwap.addEventListener("click", (e) => {
  swap();
});

botonModo.addEventListener("click", (e) => {
  botonModo.classList.toggle("noche");
  html.classList.toggle("noche");
});
