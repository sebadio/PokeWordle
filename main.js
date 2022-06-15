const pokemon = document.querySelector(".pokemon");
const imagenPokemon = document.createElement("img");
const juegoContainer = document.querySelector(".juegoContainer");
const conteinerTipos = document.querySelector(".tipos");
const numeroDeTries = 6;

let actualTry = [];
let nombre = "";
let triesRemaining = numeroDeTries;
let siguienteLetra = 0;
let numeroRandom = Math.floor(Math.random() * 898);

window.onload = () => {
  jugar();
};

function jugar() {
  fetch(`https://pokeapi.co/api/v2/pokemon/${numeroRandom}/`)
    .then((respuesta) => respuesta.json())
    .then((datos) => pokeLog(datos));
}

function pokeLog(datos) {
  nombre = datos.name;
  imagenPokemon.src = datos.sprites.front_default;
  imagenPokemon.id = "pokemon";
  pokemon.appendChild(imagenPokemon);
  agregarTipos(datos);
  crearTabla();
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
      return "media/tipos/Tipo_acero.webp";
    case "water":
      return "media/tipos/Tipo_agua.webp";
    case "bug":
      return "media/tipos/Tipo_bicho.webp";
    case "dragon":
      return "media/tipos/Tipo_dragon.webp";
    case "electric":
      return "media/tipos/Tipo_electrico.webp";
    case "ghost":
      return "media/tipos/Tipo_fantasma.webp";
    case "fire":
      return "media/tipos/Tipo_fuego.webp";
    case "fairy":
      return "media/tipos/Tipo_hada.webp";
    case "ice":
      return "media/tipos/Tipo_hielo.webp";
    case "fighting":
      return "media/tipos/Tipo_lucha.webp";
    case "normal":
      return "media/tipos/Tipo_normal.webp";
    case "grass":
      return "media/tipos/Tipo_planta.webp";
    case "psychic":
      return "media/tipos/Tipo_psiquico.webp";
    case "rock":
      return "media/tipos/Tipo_roca.webp";
    case "dark":
      return "media/tipos/Tipo_siniestro.webp";
    case "ground":
      return "media/tipos/Tipo_tierra.webp";
    case "poison":
      return "media/tipos/Tipo_veneno.webp";
    case "flying":
      return "media/tipos/Tipo_volador.webp";

    default:
      break;
  }
}

function crearTabla() {
  let tabla = document.createElement("div");
  tabla.id = "tabla";

  for (let i = 0; i < numeroDeTries; i++) {
    let row = document.createElement("div");
    row.className = "row-boxes";

    for (let z = 0; z < nombre.length; z++) {
      let box = document.createElement("div");
      box.className = "box";
      row.appendChild(box);
    }
    tabla.appendChild(row);
  }
  juegoContainer.appendChild(tabla);
}

document.addEventListener("keyup", (e) => {
  if (triesRemaining === 0) {
    return;
  }

  let pressedKey = String(e.key);
  if (pressedKey === "Backspace" && siguienteLetra !== 0) {
    borrarLetra();
    return;
  }

  if (pressedKey === "Enter") {
    comprobarRespuesta();
    return;
  }

  let encontrada = pressedKey.match(/[a-z]/gi);
  if (!encontrada || encontrada.length > 1) {
    return;
  } else {
    insertarLetra(pressedKey);
  }
});

function insertarLetra(key) {
  if (siguienteLetra === nombre.length) {
    return;
  }

  let row = document.getElementsByClassName("row-boxes")[6 - triesRemaining];
  let box = row.children[siguienteLetra];
  box.textContent = key;
  box.classList.add("box-rellena");
  actualTry.push(key);
  siguienteLetra += 1;
}

function borrarLetra() {
  let row = document.getElementsByClassName("row-boxes")[6 - triesRemaining];
  let box = row.children[siguienteLetra - 1];
  box.textContent = "";
  box.classList.remove("box-rellena");
  actualTry.pop();
  siguienteLetra -= 1;
}

function comprobarRespuesta() {
  let row = document.getElementsByClassName("row-boxes")[6 - triesRemaining];
  let intentoString = "";
  let correcto = Array.from(nombre);

  for (const val of actualTry) {
    intentoString += val;
  }

  if (intentoString.length != nombre.length) {
    popup("El intento actual no tiene las suficientes letras", "#dec254");
    setTimeout(() => {
      document.querySelector("body").removeChild(document.querySelector("#popup"));
    }, 2500);
    return;
  }

  for (let i = 0; i < nombre.length; i++) {
    let colorDeLetra = "";
    let box = row.children[i];
    let letra = actualTry[i];

    let posicionLetra = correcto.indexOf(actualTry[i]);
    if (posicionLetra === -1) {
      colorDeLetra = "#818384";
    } else {
      if (actualTry[i] === correcto[i]) {
        colorDeLetra = "#6aaa64";
      } else {
        colorDeLetra = "#c9b458";
      }
    }

    correcto[posicionLetra] = "#";

    let retraso = 300 * i;
    setTimeout(() => {
      box.style.backgroundColor = colorDeLetra;
    }, retraso);
  }

  if (intentoString === nombre) {
    popup("Adivinaste correctamente, Felicidades!", "green");
    imagenPokemon.style.filter = "contrast(1)";
    triesRemaining = 0;
    return;
  } else {
    triesRemaining -= 1;
    actualTry = [];
    siguienteLetra = 0;

    if (triesRemaining === 0) {
      popup(`Te quedaste sin intentos, el Pokemon era ${nombre.toUpperCase()}`, "red");
      imagenPokemon.style.filter = "contrast(1)";
    }
  }
}

document.getElementById("teclado").addEventListener("click", (e) => {
  const target = e.target;

  if (!target.classList.contains("teclado-boton")) {
    return;
  }
  let key = target.textContent;

  if (key === "Del") {
    key = "Backspace";
  }

  document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});
