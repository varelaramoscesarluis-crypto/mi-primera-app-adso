// Referencias a los elementos del HTML
const boton = document.getElementById("botonMensaje");
const mensaje = document.getElementById("mensaje");
 
// Guardamos el texto original (sin saltos de línea ni espacios de más)
const textoCompleto = mensaje.textContent.replace(/\s+/g, " ").trim();
 
// Textos del botón según el estado
const TEXTO_MOSTRAR = "Conoce mi propósito";
const TEXTO_OCULTAR = "Ocultar mi propósito";
 
// Respeta a quienes tienen desactivadas las animaciones en su sistema
const sinAnimaciones = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 
let temporizador = null; // controla el efecto de escritura
 
function detenerEscritura() {
    clearInterval(temporizador);
    temporizador = null;
    mensaje.classList.remove("escribiendo");
}
 
function escribirMensaje() {
    detenerEscritura();
 
    if (sinAnimaciones) {
        mensaje.textContent = textoCompleto;
        return;
    }
 
    mensaje.textContent = "";
    mensaje.classList.add("escribiendo");
 
    let i = 0;
    temporizador = setInterval(() => {
        mensaje.textContent = textoCompleto.slice(0, ++i);
        if (i >= textoCompleto.length) {
            detenerEscritura();
        }
    }, 25);
}
 
function mostrarMensaje() {
    mensaje.classList.remove("oculto");
    boton.textContent = TEXTO_OCULTAR;
    boton.setAttribute("aria-expanded", "true");
    escribirMensaje();
}
 
function ocultarMensaje() {
    detenerEscritura();
    mensaje.classList.add("oculto");
    boton.textContent = TEXTO_MOSTRAR;
    boton.setAttribute("aria-expanded", "false");
}
 
// Estado inicial y evento del botón
boton.setAttribute("aria-expanded", "false");
boton.setAttribute("aria-controls", "mensaje");
 
boton.addEventListener("click", () => {
    const estaOculto = mensaje.classList.contains("oculto");
    if (estaOculto) {
        mostrarMensaje();
    } else {
        ocultarMensaje();
    }
});