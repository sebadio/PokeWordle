const info = document.querySelector("#info");
const body = document.querySelector("body");
const colores = ["#6aaa64", "#c9b458", "#818384"];
const nombreEjemplo = Array.from("Gible");

const fondoNegro = document.createElement("div");
fondoNegro.id = "fondoNegro";

const explicacionDiv = document.createElement("div");
explicacionDiv.classList.add("animacionInfo");
explicacionDiv.id = "explicacion";
fondoNegro.appendChild(explicacionDiv);

const explicacionParagrafo = document.createElement("p");
explicacionParagrafo.innerText =
  "Adivina el Pokemon oculto en seis intentos. Despues de cada intento las letras cambian de color para mostrate que tan cerca estas de la respuesta:";
explicacionDiv.appendChild(explicacionParagrafo);

const divBoxes = document.createElement("div");
divBoxes.style.display = "flex";
divBoxes.style.flexDirection = "column";
divBoxes.style.justifyContent = "space-evenly";
divBoxes.style.padding = "1rem";
explicacionDiv.appendChild(divBoxes);

info.addEventListener("click", () => {
  body.appendChild(fondoNegro);
  // setTimeout(() => {
  //   explicacionDiv.classList.add("animacionInfo");
  // }, 250);
});

fondoNegro.addEventListener("click", () => {
  fondoNegro.parentElement.removeChild(fondoNegro);
});

dibujarEjemplo();

function dibujarEjemplo() {
  colores.forEach((element) => {
    let containerExplicacion = document.createElement("div");
    containerExplicacion.style.display = "flex";
    containerExplicacion.style.justifyContent = "center";
    containerExplicacion.style.alignItems = "center";
    containerExplicacion.style.flexDirection = "column";
    containerExplicacion.style.padding = "1.1rem";

    let row = document.createElement("div");
    row.style.display = "flex";
    row.style.flexDirection = "row";

    let textoDescriptivo = document.createElement("p");
    textoDescriptivo.innerText = descripcionColores(element);
    textoDescriptivo.style.padding = "10px 0px";

    for (let i = 0; i < 5; i++) {
      let box = document.createElement("div");
      box.className = "box";
      if (i === 2) {
        box.style.backgroundColor = element;
      } else {
        box.style.backgroundColor = "#1e1e1e";
      }
      box.textContent = nombreEjemplo[i];

      row.appendChild(box);

      containerExplicacion.appendChild(row);
    }
    divBoxes.appendChild(containerExplicacion);
    containerExplicacion.appendChild(textoDescriptivo);
  });
}

function descripcionColores(element) {
  switch (element) {
    case "#6aaa64":
      return "Si la letra esta en verde significa que tanto la posicion como la letra son correctas.";

    case "#c9b458":
      return "Si la letra esta en amarillo significa que la letra esta en la palabra pero no esta en la posicion correcta.";

    case "#818384":
      return "Si la letra esta gris significa que la letra no esta dentro de la palabra.";

    default:
      break;
  }
}
