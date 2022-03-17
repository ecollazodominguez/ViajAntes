import vuelosForm, { swap } from "./dataForm.js";

import { getVuelos } from "./dataVuelos.js";

const buttonSwap = document.querySelector("button#cambio");

//Evento de cuando se hace el submit (Se le da al botón viajar);
vuelosForm.addEventListener('submit', async(e) => {
        e.preventDefault();
        try {
            const datos = await getVuelos();
            
            console.log(datos);
        } catch (error) {
            alert(error.message);
        };
        vuelosForm.elements.origen.value = "";
        vuelosForm.elements.destino.value = "";
    
});

//Evento que cambia Origen/destino
buttonSwap.addEventListener('click',(e) =>{
    swap();
});


