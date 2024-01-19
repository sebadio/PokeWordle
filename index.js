const warning="El intento actual no tiene las suficientes letras",danger="Te quedaste sin intentos, el Pokemon era ",safe="Adivinaste correctamente, Felicidades!",pokemon=document.querySelector(".pokemon"),juegoContainer=document.querySelector(".juegoContainer"),conteinerTipos=document.querySelector(".tipos"),numeroDeTries=6,tecladoInnerHTML=document.querySelector("#teclado").innerHTML;let actualTry=[],nombre="",triesRemaining=6,siguienteLetra=0;const spinner=document.querySelector(".spinner");function showSpinner(){spinner.style.display="block"}function hideSpinner(){spinner.style.display="none"}async function jugar(){showSpinner();let e=await fetch(`https://pokeapi.co/api/v2/pokemon/${Math.floor(1e3*Math.random())}/`);e&&404!==e.status||jugar();let t=await e.json();t||jugar(),pokeLog(t)}function pokeLog(e){let t=document.getElementById("pokemon");nombre=e.species.name,t.src=e.sprites.front_default,t.id="pokemon",t.style.filter="contrast(0)",t.classList.remove("hide"),pokemon.appendChild(t),hideSpinner(),agregarTipos(e),crearTabla()}function agregarTipos(e){e.types.forEach(e=>{let t=e.type.name,n=document.createElement("img");n.src=`media/tipos/${t}.webp`,n.alt=`${t} Type`,n.width="48",n.height="18",conteinerTipos.appendChild(n)})}function crearTabla(){let e=document.createElement("div");e.id="tabla";for(let t=0;t<6;t++){let n=document.createElement("div");n.className="row-boxes";for(let a=0;a<nombre.length;a++){let r=document.createElement("div");r.className="box",n.appendChild(r)}e.appendChild(n)}juegoContainer.appendChild(e)}function insertarLetra(e){if(siguienteLetra===nombre.length)return;let t=document.getElementsByClassName("row-boxes")[6-triesRemaining],n=t.children[siguienteLetra];n.textContent=e,n.classList.add("box-rellena"),actualTry.push(e),siguienteLetra+=1}function borrarLetra(){let e=document.getElementsByClassName("row-boxes")[6-triesRemaining],t=e.children[siguienteLetra-1];t.textContent="",t.classList.remove("box-rellena"),actualTry.pop(),siguienteLetra-=1}function comprobarRespuesta(){let e=document.getElementsByClassName("row-boxes")[6-triesRemaining],t=actualTry.join(""),n=nombre,a=document.getElementById("pokemon");if(t.length!=nombre.length){popup("El intento actual no tiene las suficientes letras","warning",!1);return}for(let r=0;r<nombre.length;r++)handleLetter(r,n,e);t===nombre?setTimeout(()=>{popup("Adivinaste correctamente, Felicidades!","safe",!0),a.style.filter="contrast(1)"},250*nombre.length):(triesRemaining-=1,actualTry=[],siguienteLetra=0),0===triesRemaining&&setTimeout(()=>{popup("Te quedaste sin intentos, el Pokemon era "+nombre.toUpperCase(),"danger",!0),a.style.filter="contrast(1)"},250*nombre.length)}function colorearLetraTeclado(e,t){document.querySelectorAll(".teclado-boton").forEach(n=>{if(e===n.textContent){let a=n;!a.classList.contains(t)&&(a.classList.add(t),n.classList.contains("keyWarning")&&"keySafe"==t&&(a.classList.remove("keyWarning"),a.classList.add("keySafe")))}})}function borrarTablaYDatos(){document.querySelector("#tabla").parentElement.removeChild(document.querySelector("#tabla")),document.getElementById("pokemon").classList.add("hide"),Array.from(conteinerTipos.children).forEach(e=>{e.parentElement.removeChild(e)}),document.querySelector("#popup").parentElement.removeChild(document.querySelector("#popup"))}function playAgain(){borrarTablaYDatos(),triesRemaining=6,siguienteLetra=0,actualTry=[],document.querySelector("#teclado").innerHTML=tecladoInnerHTML,jugar()}const popup=(e,t,n)=>{let a=document.createElement("div");if(a.id="popup",a.className=`animacionPopup ${t}`,a.appendChild(document.createTextNode(e)),n){let r=document.createElement("button");r.innerHTML=" Jugar de nuevo ",r.addEventListener("click",playAgain),a.appendChild(r)}document.querySelector(".pokeWordle").appendChild(a),n||setTimeout(()=>{document.querySelector("#popup").parentElement.removeChild(document.querySelector("#popup"))},2500)};function handleKeyUp(e){if(0===triesRemaining)return;let t=String(e.key).toLowerCase();if("backspace"===t&&0!==siguienteLetra){borrarLetra();return}if("enter"===t){comprobarRespuesta();return}let n=t.match(/[a-z-]/gi);!t.match(/f..?/gi)&&n&&!(n.length>1)&&insertarLetra(t)}function handleScreenKeyboard(e){let t=e.target;if(!t.classList.contains("teclado-boton"))return;let n=t.textContent;"Del"===n&&(n="Backspace"),document.dispatchEvent(new KeyboardEvent("keyup",{key:n}))}function handleLetter(e,t,n){let a="",r=n.children[e],o=actualTry[e],i=!1,l=t.indexOf(actualTry[e],e);-1===l&&(a="keyWrong",i=!0),i||actualTry[e]!==t[e]||(a="keySafe",i=!0),i||(a="keyWarning",i=!0),setTimeout(()=>{r.classList.add("animacion"),setTimeout(()=>{r.classList.add(a)},250),colorearLetraTeclado(o,a)},200*e)}document.addEventListener("keyup",handleKeyUp),document.getElementById("teclado").addEventListener("click",handleScreenKeyboard),window.onload=()=>{jugar()};