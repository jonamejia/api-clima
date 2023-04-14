const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

const appId = '9c606a1731e5d14a33c69e9c7abb0702';

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e) {
    e.preventDefault();

    //Validar  ciudad y pais 
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if( ciudad === '' || pais === '') {

        mostrarError('Ambos campos son obligatorios');
        return;
    }
    //Consultar la api

    consultarAPI(ciudad, pais);

    // console.log('Ciudad: ', ciudad, 'Pais: ', pais);
}


//Mostrar las alertas o errores del que cometa el usuario
function mostrarError(mensaje) {
    const alert = document.querySelector('.bg-red-100');

    if(!alert ) {

        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'text-center', 'mt-6');
    
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${mensaje}</span>
        `;
    
        container.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

//Consultar a la api 
function consultarAPI(ciudad, pais) {

    //Se consulta primero la api de geocoding para extraer la latitud y longitud
    const urlApi = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    Spinner();

    fetch(urlApi)
        .then( respuesta => respuesta.json())
        .then( datos => {
            console.log(datos);
            limpiarHtml();

            if(datos.cod === '404'){
                mostrarError('Ciudad no encontrada');
                return;
            }
            
            mostrarClima( datos );
        });
}

function mostrarClima( datos ) {

    const { name, main: {temp, temp_max, temp_min} } = datos;
    const grados =  centigrados(temp);
    const max = centigrados(temp_max);
    const min = centigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const actual = document.createElement('p');
    actual.classList.add('font-bold', 'text-6xl');
    actual.innerHTML = `${grados} &#8451;`;

    //Mostrar Temperatura Maxima
    const tempMax = document.createElement('p');
    tempMax.classList.add('text-xl');
    tempMax.innerHTML = `Max: ${max} &#8451;`;

    //Mostrar Temperatura Minima
    const tempMinima = document.createElement('p');
    tempMinima.classList.add('text-xl');
    tempMinima.innerHTML = `Min: ${min} &#8451`;
    

    const contenedorDiv = document.createElement('div');
    contenedorDiv.classList.add('text-center', 'centigrados)neter', 'text-white');

    contenedorDiv.appendChild(nombreCiudad);
    contenedorDiv.appendChild(actual);
    contenedorDiv.appendChild(tempMax);
    contenedorDiv.appendChild(tempMinima);

    resultado.appendChild(contenedorDiv);
}


function limpiarHtml() {

    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

const centigrados = grados => Math.round(grados - 273.15);

function Spinner() {

    limpiarHtml();

    const divSpinner = document.createElement('div');
    divSpinner.innerHTML = `
    <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>
    `

    resultado.appendChild(divSpinner);
}
