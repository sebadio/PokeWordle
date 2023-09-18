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

const showSpinner = () => {
  spinner.style.display = "block";
};

const hideSpinner = () => {
  spinner.style.display = "none";
};

const jugar = () => {
  showSpinner();
  fetch(`https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * 898)}/`)
    .then((respuesta) => respuesta.json())
    .then((datos) => checkPokemon(datos)).catch(err => {
      if (err) {
        console.log(err);
        jugar();
      }
    })
}

const checkPokemon = (datos) => {
  if (window.innerWidth <= 500) {
    if (datos.name.length > 8) {
      jugar();
    } else {
      pokeLog(datos);
    }
  } else {
    pokeLog(datos);
  }
}

const pokeLog = (datos) => {
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

const agregarTipos = (datos) => {
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

const crearTabla = () => {
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

const insertarLetra = (key) => {
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

const borrarLetra = () => {
  const row = document.getElementsByClassName("row-boxes")[6 - triesRemaining];
  const box = row.children[siguienteLetra - 1];
  box.textContent = "";
  box.classList.remove("box-rellena");
  actualTry.pop();
  siguienteLetra -= 1;
}

const comprobarRespuesta = () => {
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

const colorearLetraTeclado = (letra, color) => {
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

const borrarTablaYDatos = () => {
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

const playAgain = () => {
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

  if (juegoTerminado === true) {
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

const handleKeyUp = (e) => {
  if (triesRemaining === 0) {
    return;
  }

  const pressedKey = String(e.key);
  if (pressedKey === "Backspace" && siguienteLetra !== 0) {
    borrarLetra();
    return;
  }

  if (pressedKey === "Enter") {
    comprobarRespuesta();
    return;
  }

  let encontrada = pressedKey.match(/[a-z-]/gi);
  if (
    pressedKey === "F2" ||
    pressedKey === "F3" ||
    pressedKey === "F4" ||
    pressedKey === "F5" ||
    pressedKey === "F6" ||
    pressedKey === "F7" ||
    pressedKey === "F8" ||
    pressedKey === "F9" ||
    pressedKey === "F10" ||
    pressedKey === "F11" ||
    pressedKey === "F12"
  ) {
    return;
  } else {
    if (!encontrada || encontrada.length > 1) {
      return;
    } else {
      insertarLetra(pressedKey);
    }
  }
}

const handleScreenKeyboard = (e) => {
  const target = e.target;

  if (!target.classList.contains("teclado-boton")) {
    return;
  }
  let key = target.textContent;

  if (key === "Del") {
    key = "Backspace";
  }

  document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
}

const handleLetter = (i, correcto, row) => {
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

document.addEventListener("keyup", (e) => {
  handleKeyUp(e)
});

document.getElementById("teclado").addEventListener("click", (e) => {
  handleScreenKeyboard(e);
});

window.onload = () => {
  jugar();
};