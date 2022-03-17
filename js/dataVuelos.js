"use strict"

import { getDataForm } from "./dataForm.js";

//Función que a través de una petición API comprobamos si el IATA code escrito en el form existe
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
  
    //Como recibimos distintos aeropuertos filtramos por la coincidencia de iataCode.
    const airport = airports.data.filter((airport) => {
      return airport.iataCode === iataCode.toUpperCase();
    });

    //Si la longitud del filtro que hicimos es 0 quiere decir que el iataCode es incorrecto.
    if (airport.length === 0) {
      const errorIata = new Error();
      errorIata.code = iataCode.toUpperCase();
      errorIata.message = ` El codigo ${iataCode} es incorrecto`;
      throw errorIata;
    };
  };


//Función que nos devuelve la ACCESS TOKEN para hacer peticiones en la API AMADEUS.
//Hacemos un fetch a una URL que en vez de GET usamos POST y les mandamos la APIKEY y la SECRETKEY para que nos respondan con el ACCESS TOKEN
const auth = async() => {
    const url = "https://test.api.amadeus.com/v1/security/oauth2/token";
    const APIKEY = "u62cK2HAlJEDhnRFgQu5ben48h99NNUw";
    const SECRETKEY ="E4brhJhcTFe99rwb";

    const response = await fetch(url, {
        method: 'POST',
        headers:{
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body:`grant_type=client_credentials&client_id=${APIKEY}&client_secret=${SECRETKEY}`
    });

    const token = await response.json();
    return token.access_token;
};


//Función que busca los vuelos en la API en función de los parámetros dados
const searchAPI = async() => {
    const dataForm = await getDataForm();
    const [origen,destino,pasajeros,fechaSalida] = Object.values(dataForm);

    const accessToken = await auth();
    const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origen.toUpperCase()}&destinationLocationCode=${destino.toUpperCase()}&departureDate=${fechaSalida}&adults=${pasajeros}&nonStop=true&max=250`;

    //Usamos fetch para hacer la petición y en este caso en los headers del fetch ponemos el access Token para mostrar que estamos autorizados
    const response = await fetch(url, {
        method: "GET",
        headers:{
            "Authorization":`Bearer ${accessToken}` 
        }
    });

    const vuelos = await response.json();

    //Si no hay datos salta error
    if(vuelos.data.length === 0){
        throw new Error("Ha ocurrido un error. Vuelva a intentarlo");
    };
    //Devolvemos todos los vuelos
    return vuelos;


};

const getVuelos = async() =>{
    //Llamamos a la función que nos hace la petición a la API y recogemos la respuesta que son los vuelos.
    const vuelos = await searchAPI();

    //Hacemos un filtrado de los datos, cogiendo solo los vuelos en que los billetes SE PUEDEN COMPRAR,
    // luego ordenamos los datos según el precio de menor a mayor
    // por último mapeamos los datos a nuestro gusto, recogiendo lo que nos interesa
    const datos = vuelos.data.filter((vuelo) =>{
        return vuelo.pricingOptions.fareType[0] === "PUBLISHED";
    }).sort((a , b)=>{
        return a.price.total - b.price.total;
    }).map((vuelo) =>{
        
        //Tiempo de salida se representa como "fechaThora" para recoger bien los datos directamente dividimon el string por "T" y tendremos fecha y hora separados.
        const tiempoSalida = vuelo.itineraries[0].segments[0].departure.at.split("T");
        //Duración se representa como "PT14H20M" para recoger bien los datos eliminamos los 2 primeros caracteres "PT" y asi tener "14H20M";
        const duracion = vuelo.itineraries[0].duration.slice(2);
        //Tiempo de llegada es lo mismo que el de salida pero como la fecha ya la tenemos (es el mismo día) solo nos interesa la hora, así que obviamos la fecha.
        const [, tiempoLlegada] = vuelo.itineraries[0].segments[0].arrival.at.split("T");
        const codigoAerolinea = vuelo.itineraries[0].segments[0].carrierCode;
        //aerolinea no está en "vuelos.data" así que accedo a los datos con la variable de fuera (Quizá no es buena idea?)
        //el objeto "carriers" tiene como keys el codigo de aerolinea y como valor el nombre de la aerolia así que
        //usamos el codigo de la aerolinea para indicar la key y así obtener el valor
        //EJ: codigo es "UX", aerolinea contiene "[UX:Air Europa, IB: Iberia]" con .carriers["UX"] accedo al valor "Air Europa"-
        const aerolinea = vuelos.dictionaries.carriers[codigoAerolinea];

        return {
            //devuelvo un Objeto con los datos qu eme interesan.
            precio: vuelo.price.total,
            duracion,
            fechaSalida: tiempoSalida[0],
            tiempoSalida: tiempoSalida[1],
            terminalSalida: vuelo.itineraries[0].segments[0].departure.terminal,
            tiempoLlegada,
            terminalLlegada: vuelo.itineraries[0].segments[0].arrival.terminal,
            tipoBillete: vuelo.travelerPricings[0].fareDetailsBySegment[0].cabin,
            facturacion: vuelo.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity,
            codigoAerolinea,
            aerolinea    
        };

    });

     return datos;
     
};
    //COMO ACCEDER A CADA DATO MANUALMENTE

    // console.log("precio ",vuelos.data[0].price.total);
    // console.log("precio Grand",vuelos.data[0].price.grandTotal);
    // console.log("duración",vuelos.data[0].itineraries[0].duration);
    // console.log("Salida",vuelos.data[0].itineraries[0].segments[0].departure.at);
    // console.log("terminalSalida",vuelos.data[0].itineraries[0].segments[0].departure.terminal);
    // console.log("llegada",vuelos.data[0].itineraries[0].segments[0].arrival.at);
    // console.log("terminalLlegada",vuelos.data[0].itineraries[0].segments[0].arrival.terminal);
    
    // console.log("Ticket a la venta?",vuelos.data[0].pricingOptions.fareType[0]);

    // console.log("Opciones viajero cabina",vuelos.data[0].travelerPricings[0].fareDetailsBySegment[0].cabin);
    // console.log("Facturación maleta",vuelos.data[0].travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity);
    // const aerolineaCode = vuelos.data[0].itineraries[0].segments[0].carrierCode;
    // console.log("Aerolínea ",vuelos.data[0].itineraries[0].segments[0].carrierCode);


    // console.log(vuelos.dictionaries.carriers[aerolineaCode]);


export { checkIataCode, getVuelos };
