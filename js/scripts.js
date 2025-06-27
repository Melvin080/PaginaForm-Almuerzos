//Cuando se abre la pagina de formulario.
const elementoFormulario = document.getElementById('form-form');
const bebidasFlag = document.getElementById('div-bebidas');
const responseDiv = document.getElementById('respuesta');
let domActualizable = document.createDocumentFragment();

let divNormal = document.createElement('div');
divNormal.className = 'form-group options';

let divItemNo = document.createElement('div');
divItemNo.className = 'form-group';

let divSaludable = document.createElement('div');
divSaludable.className = 'form-group';

let divSopa = document.createElement('div');
divSopa.className = 'form-group';

let divCena = document.createElement('div');
divCena.className = 'form-group';

document.addEventListener("DOMContentLoaded", async () => {

    // Llamar a las variables
    let API_URL_GET;
    let API_URL_POST;

    try {
        const configResponse = await fetch('/api/config');
        if (!configResponse.ok) {
            throw new Error(`Error al obtener la configuración: ${configResponse.status} - ${configResponse.statusText}`);
        }
        const config = await configResponse.json();
        API_URL_GET = config.ENV_API_GET_URL;
        API_URL_POST = config.ENV_API_POST_URL;
        if (!API_URL_GET || !API_URL_POST) {
            throw new Error("Las URLs de la API no se cargaron correctamente desde la configuración.");
        }

    } catch (error) {
        console.error("Error crítico al cargar las URLs de la API:", error);
        responseDiv.innerHTML = `<p style="color: red; text-align: center;">Error al inicializar el formulario: ${error.message}</p>`;
        responseDiv.style.display = 'block';
        return;
    }

    let tablaGet; // Almacenar los datos del GET.

    try {
        // Realizar la solicitud GET al cargar la página.
        const respuestaGet = await fetch(API_URL_GET);
        if (!respuestaGet.ok) {
            throw new Error(`Error de HTTP al obtener datos: ${respuestaGet.status} - ${respuestaGet.statusText}`);
        }
        tablaGet = await respuestaGet.json();
        //console.log("Datos recibidos de la API GET:", tablaGet);

        // Construir el HTML del formulario con los datos recibidos.
        divNormal.innerHTML = `
            <p class="pregunta-titulo">4. ${tablaGet.NormalLabel} <span class="requerido">*</span></p>
            <div class="opciones-group">
                <label>
                    <input type="checkbox" name="normal" value="365890000"> No aplica
                </label>
                <label>
                    <input type="checkbox" name="normal" value="365890001"> ${tablaGet.OpcionesNormal[0].Opcion1}
                </label>
                <label>
                    <input type="checkbox" name="normal" value="365890002"> ${tablaGet.OpcionesNormal[0].Opcion2}
                </label>
                <label>
                    <input type="checkbox" name="normal" value="365890003"> ${tablaGet.OpcionesNormal[0].Opcion3}
                </label>
            </div>
            <span class="checkboxError">Debe seleccionar al menos una opción.</span>`;
        domActualizable.appendChild(divNormal);

        divItemNo.innerHTML = `
            <label for="no-acompañamiento"><p class="pregunta-titulo">5. Escriba el/los acompañamientos del almuerzo que <span>NO</span> quiere</p></label>
            <input type="text" id="no-acompañamiento" name="no-acompañamiento" placeholder="Escriba aquí">`;
        domActualizable.appendChild(divItemNo);

        divSaludable.innerHTML = `
            <p class="pregunta-titulo">6. ${tablaGet.SaludableLabel} <span class="requerido">*</span></p>
            <div class="opciones-group">
                <label>
                    <input type="radio" name="saludable" value="365890000" required> No aplica
                </label>
                <label>
                    <input type="radio" name="saludable" value="365890001" required> Completo
                </label>
                <label>
                    <input type="radio" name="saludable" value="365890002" required> ${tablaGet.OpcionesSaludable[0].Opcion1}
                </label>
                <label>
                    <input type="radio" name="saludable" value="365890003" required> ${tablaGet.OpcionesSaludable[0].Opcion2}
                </label>
            </div>`;
        domActualizable.appendChild(divSaludable);

        divSopa.innerHTML = `
            <p class="pregunta-titulo">7. ${tablaGet.SopaLabel} <span class="requerido">*</span></p>
            <div class="opciones-group">
                <label>
                    <input type="radio" name="sopa" value="false" required> No
                </label>
                <label>
                    <input type="radio" name="sopa" value="true" required> Si
                </label>
            </div>`;
        domActualizable.appendChild(divSopa);

        divCena.innerHTML = `
            <p class="pregunta-titulo">8. Menú Cenas <span class="requerido">*</span></p>
            <div class="opciones-group">
                <label>
                    <input type="radio" name="cena" value="365890000" required> No aplica
                </label>
                <label>
                    <input type="radio" name="cena" value="365890001" required> ${tablaGet.OpcionesCena[0].Opcion1}
                </label>
                <label>
                    <input type="radio" name="cena" value="365890002" required> ${tablaGet.OpcionesCena[0].Opcion2}
                </label>
                <label>
                    <input type="radio" name="cena" value="365890003" required> ${tablaGet.OpcionesCena[0].Opcion3}
                </label>
                <label>
                    <input type="radio" name="cena" value="365890004" required> ${tablaGet.OpcionesCena[0].Opcion4}
                </label>
            </div>`;
        domActualizable.appendChild(divCena);

        elementoFormulario.insertBefore(domActualizable, bebidasFlag);

        // Validación de checkboxes checked.
        const grupoCheckbox = $(divNormal).find(':checkbox');
        const mensajeError = $(divNormal).find('.checkboxError');

        function validateCheckboxes() {
            if (grupoCheckbox.is(':checked')) {
                mensajeError.hide();
                return true;
            } else {
                mensajeError.show();
                return false;
            }
        }

        grupoCheckbox.on('change', validateCheckboxes);

        // envío del formulario POST.
        elementoFormulario.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (!validateCheckboxes()) {
                console.log("Validación de checkboxes fallida. Envío prevenido.");
                return;
            }

            responseDiv.innerHTML = '<p style="color: gray; text-align: center;">Enviando datos...</p>';
            responseDiv.style.display = 'block';

            const formData = new FormData(elementoFormulario);
            const dataToPost = {};

            // Se construye JSON, par llave : valor.
            for (const [key, value] of formData.entries()) {
                if (dataToPost[key]) {
                    if (!Array.isArray(dataToPost[key])) {
                        dataToPost[key] = [dataToPost[key]];
                    }
                    dataToPost[key].push(value);
                } else {
                    dataToPost[key] = value;
                }
            }
            //Unir los datos array en string.
            for (const key in dataToPost) {
                if (Object.hasOwnProperty.call(dataToPost, key)) {
                    const value = dataToPost[key];
                    if (Array.isArray(value)) {
                        dataToPost[key] = value.join(', ');
                    } else {
                        dataToPost[key] = value;
                    }
                }
            }

            const jsonData = JSON.stringify(dataToPost);
            //console.log("JSON a enviar (POST):", jsonData);

            // Enviar el formulario.
            try {
                const responsePost = await fetch(API_URL_POST, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: jsonData
                });

                if (!responsePost.ok) {
                    throw new Error(`Error de HTTP al enviar datos: ${responsePost.status} - ${responsePost.statusText}`);
                }

                const result = await responsePost.json();
                //console.log("Respuesta de la API POST:", result);

                // Ocultar el formulario.
                elementoFormulario.style.display = 'none';
                const paginaTitulo = document.querySelector('h1');
                const paginaSubTitulo = document.querySelector('h3');
                if (paginaTitulo) {
                    paginaTitulo.style.display = 'none';
                }
                if (paginaSubTitulo) {
                    paginaSubTitulo.style.display = 'none';
                }

                // Mostrar mensaje de exito.
                responseDiv.innerHTML = `
                    <div class="mensajeExito">
                        <h2>¡Formulario Enviado con Éxito!</h2>
                        <p>Su menú a sido registrado.</p>
                        </div>
                `;

            } catch (error) {
                console.error("Error al enviar el formulario:", error);
                responseDiv.innerHTML = `<p style="color: red; text-align: center;">Error al enviar el formulario: ${error.message}</p>`;
                responseDiv.style.color = 'red';
            }
        });

        // Llamada a la validación inicial (para ocultar el mensaje de error si ya hay algo chequeado)
        validateCheckboxes();

    } catch (error) {
        console.error("Error al cargar los datos iniciales del formulario:", error);
        responseDiv.innerHTML = `<p style="color: red; text-align: center;">Error al cargar el formulario: ${error.message}</p>`;
        responseDiv.style.display = 'block';
    }
});