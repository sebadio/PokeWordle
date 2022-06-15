function popup(mensaje, color) {
  let popup = document.createElement("div");
  popup.id = "popup";
  popup.style.backgroundColor = color;

  popup.textContent = mensaje;
  document.querySelector("body").appendChild(popup);
}
