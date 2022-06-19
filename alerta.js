function popup(mensaje, color, juegoTerminado) {
  let popup = document.createElement("div");
  popup.id = "popup";
  popup.classList.add("animacionPopup");
  popup.style.backgroundColor = color;

  if (juegoTerminado === true) {
    popup.innerHTML = mensaje + ` <button onclick="location.reload()"> Volver a Jugar </button>`;
  } else {
    popup.innerHTML = mensaje;
  }

  document.querySelector(".pokeWordle").appendChild(popup);
}
