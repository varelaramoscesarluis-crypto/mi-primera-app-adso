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


/* ===== Formulario de contacto ===== */
const formulario = document.getElementById("formularioContacto");
const respuesta = document.getElementById("respuestaFormulario");
const botonEnviar = formulario.querySelector(".boton-enviar");

// Reglas de validación: devuelven el mensaje de error, o "" si el valor es correcto
const reglas = {
    nombre: (valor) =>
        valor.trim().length < 3 ? "Escribe tu nombre completo (mínimo 3 letras)." : "",
    correo: (valor) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())
            ? ""
            : "Escribe un correo válido, por ejemplo ejemplo@correo.com.",
    asunto: (valor) =>
        valor === "" ? "Selecciona un asunto." : "",
    mensajeContacto: (valor) =>
        valor.trim().length < 10 ? "El mensaje debe tener al menos 10 caracteres." : ""
};

// Valida un campo y muestra u oculta su mensaje de error
function validarCampo(campo) {
    const error = reglas[campo.id](campo.value);
    document.getElementById("error-" + campo.id).textContent = error;
    campo.closest(".campo").classList.toggle("con-error", error !== "");
    campo.setAttribute("aria-invalid", error !== "" ? "true" : "false");
    return error === "";
}

function mostrarRespuesta(texto, tipo) {
    respuesta.textContent = texto;
    respuesta.className = "respuesta-formulario " + tipo;
}

// Aquí se conectaría un servicio real (Formspree, EmailJS, tu propio servidor...).
// Por ahora simula el envío con una espera de 1,2 segundos.
function enviarFormulario(datos) {
    return new Promise((resolver) => setTimeout(resolver, 1200));
}

// Si un campo ya tenía error, se revalida mientras el usuario corrige
formulario.querySelectorAll("input, select, textarea").forEach((campo) => {
    campo.addEventListener("blur", () => validarCampo(campo));
    campo.addEventListener("input", () => {
        if (campo.closest(".campo").classList.contains("con-error")) {
            validarCampo(campo);
        }
    });
});

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault(); // evita que la página se recargue

    const campos = [...formulario.querySelectorAll("input, select, textarea")];
    const resultados = campos.map(validarCampo); // valida todos, no solo el primero
    const primerInvalido = campos[resultados.indexOf(false)];

    if (primerInvalido) {
        mostrarRespuesta("Revisa los campos marcados antes de enviar.", "error");
        primerInvalido.focus();
        return;
    }

    const datos = Object.fromEntries(new FormData(formulario));

    botonEnviar.disabled = true;
    botonEnviar.textContent = "Enviando...";
    respuesta.className = "respuesta-formulario";
    respuesta.textContent = "";

    try {
        await enviarFormulario(datos);
        const primerNombre = datos.nombre.trim().split(" ")[0];
        mostrarRespuesta(
            "¡Gracias, " + primerNombre + "! Tu mensaje fue enviado. Te responderé pronto.",
            "exito"
        );
        formulario.reset();
        campos.forEach((campo) => campo.removeAttribute("aria-invalid"));
    } catch (error) {
        mostrarRespuesta("No se pudo enviar el mensaje. Inténtalo de nuevo.", "error");
    } finally {
        botonEnviar.disabled = false;
        botonEnviar.textContent = "Enviar mensaje";
    }
});