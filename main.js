const warning = "El intento actual no tiene las suficientes letras";
const danger = "Te quedaste sin intentos, el Pokemon era ";
const safe = "Adivinaste correctamente, Felicidades!";

const pokemon = document.querySelector(".pokemon");
const juegoContainer = document.querySelector(".juegoContainer");
const conteinerTipos = document.querySelector(".tipos");
const numeroDeTries = 6;
const tecladoInnerHTML = document.querySelector("#teclado").innerHTML;

let actualTry = [];
let nombre = "";
let triesRemaining = numeroDeTries;
let siguienteLetra = 0;

const spinner = document.querySelector(".spinner");

function showSpinner() {
  spinner.style.display = "block";
};

function hideSpinner() {
  spinner.style.display = "none";
};

async function jugar() {
  showSpinner();
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * 1000)}/`)
  if (!res || res.status === 404) jugar();
  const data = await res.json();
  if (!data) jugar();
  pokeLog(data);
}

function pokeLog(datos) {
  const imagenPokemon = document.getElementById("pokemon");

  nombre = datos.species.name;
  imagenPokemon.src = datos.sprites.front_default;
  imagenPokemon.id = "pokemon";
  imagenPokemon.style.filter = "contrast(0)";
  imagenPokemon.classList.remove("hide");
  pokemon.appendChild(imagenPokemon);
  hideSpinner();
  agregarTipos(datos);
  crearTabla();
}

function agregarTipos(datos) {
  datos.types.forEach((element) => {
    const typeName = element.type.name;
    const tipoImg = document.createElement("img");
    tipoImg.src = `media/tipos/${typeName}.webp`;
    tipoImg.alt = `${typeName} Type`
    tipoImg.width = "48";
    tipoImg.height = "18";
    conteinerTipos.appendChild(tipoImg);
  });
}

function crearTabla() {
  const tabla = document.createElement("div");
  tabla.id = "tabla";

  for (let i = 0; i < numeroDeTries; i++) {
    const row = document.createElement("div");
    row.className = "row-boxes";

    for (let j = 0; j < nombre.length; j++) {
      const box = document.createElement("div");
      box.className = "box";
      row.appendChild(box);
    }
    tabla.appendChild(row);
  }
  juegoContainer.appendChild(tabla);
}

function insertarLetra(key) {
  if (siguienteLetra === nombre.length) {
    return;
  }

  const row = document.getElementsByClassName("row-boxes")[6 - triesRemaining];
  const box = row.children[siguienteLetra];
  box.textContent = key;
  box.classList.add("box-rellena");
  actualTry.push(key);
  siguienteLetra += 1;
}

function borrarLetra() {
  const row = document.getElementsByClassName("row-boxes")[6 - triesRemaining];
  const box = row.children[siguienteLetra - 1];
  box.textContent = "";
  box.classList.remove("box-rellena");
  actualTry.pop();
  siguienteLetra -= 1;
}

function comprobarRespuesta() {
  const row = document.getElementsByClassName("row-boxes")[6 - triesRemaining];
  let intentoString = actualTry.join("");
  const correcto = nombre;
  const imagenPokemon = document.getElementById("pokemon");


  if (intentoString.length != nombre.length) {
    popup(
      warning,
      "warning",
      false
    );
    return;
  }

  for (let i = 0; i < nombre.length; i++) {
    handleLetter(i, correcto, row);
  }

  if (intentoString === nombre) {
    setTimeout(() => {
      popup(safe, "safe", true);
      imagenPokemon.style.filter = "contrast(1)";
    }, nombre.length * 250);

  } else {
    triesRemaining -= 1;
    actualTry = [];
    siguienteLetra = 0;
  }

  if (triesRemaining === 0) {
    setTimeout(() => {
      popup(
        danger + nombre.toUpperCase(),
        "danger",
        true
      );
      imagenPokemon.style.filter = "contrast(1)";
    }, nombre.length * 250);
  }
}

function colorearLetraTeclado(letra, color) {
  document.querySelectorAll(".teclado-boton").forEach((element) => {
    if (letra === element.textContent) {

      let colorAnterior = element;

      if (colorAnterior.classList.contains(color)) {
        return;
      }

      colorAnterior.classList.add(color)

      if (element.classList.contains("keyWarning") && color == "keySafe") {
        colorAnterior.classList.remove("keyWarning");
        colorAnterior.classList.add("keySafe");
      }
    }
  });
}

function borrarTablaYDatos() {
  document
    .querySelector("#tabla")
    .parentElement.removeChild(document.querySelector("#tabla"));
  document.getElementById("pokemon").classList.add("hide");

  Array.from(conteinerTipos.children).forEach((element) => {
    element.parentElement.removeChild(element);
  });

  document
    .querySelector("#popup")
    .parentElement.removeChild(document.querySelector("#popup"));
}

function playAgain() {
  borrarTablaYDatos();
  triesRemaining = numeroDeTries;
  siguienteLetra = 0;
  actualTry = [];
  document.querySelector("#teclado").innerHTML = tecladoInnerHTML;
  jugar();
}

const popup = (mensaje, type, juegoTerminado) => {
  const popup = document.createElement("div");
  popup.id = "popup";
  popup.className = `animacionPopup ${type}`
  popup.appendChild(document.createTextNode(mensaje));

  if (juegoTerminado) {
    const boton = document.createElement("button");
    boton.innerHTML = " Jugar de nuevo ";
    boton.addEventListener("click", playAgain)
    popup.appendChild(boton);
  }

  document.querySelector(".pokeWordle").appendChild(popup);

  if (!juegoTerminado) {
    setTimeout(() => {
      document
        .querySelector("#popup")
        .parentElement.removeChild(document.querySelector("#popup"));
    }, 2500);
  }
}

function handleKeyUp(e) {
  if (triesRemaining === 0) return;

  const pressedKey = String(e.key).toLowerCase();
  if (pressedKey === "backspace" && siguienteLetra !== 0) {
    borrarLetra();
    return;
  }

  if (pressedKey === "enter") {
    comprobarRespuesta();
    return;
  }

  let encontrada = pressedKey.match(/[a-z-]/gi);
  if (pressedKey.match(/f..?/gi || pressedKey === "capslock")) return;
  if (!encontrada || encontrada.length > 1) return;

  insertarLetra(pressedKey);
}

function handleScreenKeyboard(e) {
  const target = e.target;

  if (!target.classList.contains("teclado-boton")) return;
  let key = target.textContent;
  if (key === "Del") key = "Backspace";

  document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
}

function handleLetter(i, correcto, row) {
  const retraso = 200 * i;
  let colorDeLetra = "";
  const box = row.children[i];
  const letra = actualTry[i];
  let changed = false;

  const posicionLetra = correcto.indexOf(actualTry[i], i);
  if (posicionLetra === -1) {
    colorDeLetra = "keyWrong";
    changed = true;
  }

  if (!changed && actualTry[i] === correcto[i]) {
    colorDeLetra = "keySafe";
    changed = true;
  }

  if (!changed) {
    colorDeLetra = "keyWarning";
    changed = true;
  }


  setTimeout(() => {
    box.classList.add("animacion");
    setTimeout(() => {
      box.classList.add(colorDeLetra);
    }, 250);
    colorearLetraTeclado(letra, colorDeLetra);
  }, retraso);
}

// EVENT LISTENERS
document.addEventListener("keyup", handleKeyUp);
document.getElementById("teclado").addEventListener("click", handleScreenKeyboard);
window.onload = () => {
  jugar();
};