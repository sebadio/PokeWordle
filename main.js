const body = document.querySelector("body");
const imagenPokemon = document.createElement("img");
const nombre = document.createElement("p");

let numeroRandom = Math.floor(Math.random() * 50);

function pokeLog(datos) {
  console.log(datos);
  imagenPokemon.src = datos.sprites.front_default;
  nombre.innerText = datos.name;
}

fetch(`https://pokeapi.co/api/v2/pokemon/${numeroRandom}/`)
  .then((respuesta) => respuesta.json())
  .then((datos) => pokeLog(datos));

body.appendChild(imagenPokemon);
body.appendChild(nombre);
