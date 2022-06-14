const pokemon = document.querySelector(".pokemon");
const imagenPokemon = document.createElement("img");
const form = document.querySelector("form");
const input = document.querySelector("#guessing");
const juegoContainer = document.querySelector(".juegoContainer");
const conteinerTipos = document.querySelector(".tipos");
const tries = document.querySelector(".tries");

let nombre = "";
let intentoNumero = 0;

let numeroRandom = Math.floor(Math.random() * 898);

fetch(`https://pokeapi.co/api/v2/pokemon/${numeroRandom}/`)
  .then((respuesta) => respuesta.json())
  .then((datos) => pokeLog(datos));

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let intentoDato = document.createElement("p");
  intentoDato.innerText = input.value.toUpperCase();
  if (intentoNumero === 5) {
    tries.appendChild(intentoDato);
    form.removeChild(input);
  } else {
    if (input.value.toUpperCase() === nombre.toUpperCase()) {
      intentoDato.id = "correcto";
      imagenPokemon.style.filter = "brightness(1)";
      juegoContainer.appendChild(intentoDato);
      form.removeChild(input);
      input.value = "";
    } else {
      tries.appendChild(intentoDato);
      intentoNumero += 1;
      input.value = "";
    }
  }
});

function pokeLog(datos) {
  nombre = datos.name;
  imagenPokemon.src = datos.sprites.front_default;
  imagenPokemon.id = "pokemon";
  pokemon.appendChild(imagenPokemon);
  agregarTipos(datos);
}

function agregarTipos(datos) {
  datos.types.forEach((element) => {
    let tipo = document.createElement("img");
    tipo.src = fotosTipo(element);
    conteinerTipos.appendChild(tipo);
  });
}

function fotosTipo(element) {
  switch (element.type.name) {
    case "steel":
      return "/media/tipos/Tipo_acero.webp";
    case "water":
      return "/media/tipos/Tipo_agua.webp";
    case "bug":
      return "/media/tipos/Tipo_bicho.webp";
    case "dragon":
      return "/media/tipos/Tipo_dragon.webp";
    case "electric":
      return "/media/tipos/Tipo_electrico.webp";
    case "ghost":
      return "/media/tipos/Tipo_fantasma.webp";
    case "fire":
      return "/media/tipos/Tipo_fuego.webp";
    case "fairy":
      return "/media/tipos/Tipo_hada.webp";
    case "ice":
      return "/media/tipos/Tipo_hielo.webp";
    case "fighting":
      return "/media/tipos/Tipo_lucha.webp";
    case "normal":
      return "/media/tipos/Tipo_normal.webp";
    case "grass":
      return "/media/tipos/Tipo_planta.webp";
    case "psychic":
      return "/media/tipos/Tipo_psiquico.webp";
    case "rock":
      return "/media/tipos/Tipo_roca.webp";
    case "dark":
      return "/media/tipos/Tipo_siniestro.webp";
    case "ground":
      return "/media/tipos/Tipo_tierra.webp";
    case "poison":
      return "/media/tipos/Tipo_veneno.webp";
    case "flying":
      return "/media/tipos/Tipo_volador.webp";

    default:
      break;
  }
}
