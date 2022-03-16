"use strict";
const loginForm = document.forms.formulario_vuelos;

function checkLength(numero, origen, destino) {
  if (origen.length !== numero && destino.length !== numero) {
    throw new Error("Origen y Destino no son 3 letras, Intentalo de nuevo.");
  } else if (origen.length !== numero) {
    throw new Error("Origen no son 3 letras, Intentalo de nuevo.");
  } else if (destino.length !== numero) {
    throw new Error("Destino no son 3 letras, Intentalo de nuevo.");
  }
}

function swap() {
  const aux = loginForm.elements.origen.value;
  loginForm.elements.origen.value = loginForm.elements.destino.value;
  loginForm.elements.destino.value = aux;
}

async function getDataForm() {
  const origen = loginForm.elements.origen.value;
  const destino = loginForm.elements.destino.value;

  try {
    checkLength(3, origen, destino);
    await checkIataCode(origen);
    await checkIataCode(destino);
  } catch (error) {
    alert(error.message);
  }
  return {
    origen,
    destino,
  };
}

//Función que nos devuelve la ACCESS TOKEN para hacer peticiones en la API AMADEUS.
//Hacemos un fetch a una URL que en vez de GET usamos POST y les mandamos la APIKEY y la SECRETKEY para que nos respondan con el ACCESS TOKEN
const auth = async () => {
  const url = "https://test.api.amadeus.com/v1/security/oauth2/token";
  const APIKEY = "u62cK2HAlJEDhnRFgQu5ben48h99NNUw";
  const SECRETKEY = "E4brhJhcTFe99rwb";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${APIKEY}&client_secret=${SECRETKEY}`,
  });

  const token = await response.json();
  console.log(token);
  return token.access_token;
};

async function checkIataCode(iataCode) {
  const accessToken = await auth();
  const url = `https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=${iataCode.toUpperCase()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const airports = await response.json();

  const airport = airports.data.filter((airport) => {
    return airport.iataCode === iataCode.toUpperCase();
  });
  if (airport.length === 0) {
    const errorIata = new Error();
    errorIata.code = iataCode.toUpperCase();
    errorIata.message = ` El codigo ${iataCode} es incorrecto`;
    throw errorIata;
  }
}
