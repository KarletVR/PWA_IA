const URL_MODELO =
    "https://teachablemachine.withgoogle.com/models/MaCKnC-v3/";

let modelo = null;
let camaraStream = null;


// ========================================
// ELEMENTOS
// ========================================

const imagenInput =
    document.getElementById("imagenInput");

const imagenVista =
    document.getElementById("imagenVista");

const marcoImagen =
    document.getElementById("marcoImagen");

const activarCamara =
    document.getElementById("activarCamara");

const areaCamara =
    document.getElementById("areaCamara");

const video =
    document.getElementById("video");

const tomarFoto =
    document.getElementById("tomarFoto");

const cerrarCamara =
    document.getElementById("cerrarCamara");

const canvas =
    document.getElementById("canvas");

const estado =
    document.getElementById("estado");

const resultado =
    document.getElementById("resultado");

const porcentajeAle =
    document.getElementById("porcentajeAle");

const porcentajeNoAle =
    document.getElementById("porcentajeNoAle");

const barraAle =
    document.getElementById("barraAle");

const barraNoAle =
    document.getElementById("barraNoAle");

const conclusion =
    document.getElementById("conclusion");

const iconoConclusion =
    document.getElementById("iconoConclusion");

const textoConclusion =
    document.getElementById("textoConclusion");

const limpiar =
    document.getElementById("limpiar");


// ========================================
// CARGAR MODELO
// ========================================

async function cargarModelo() {

    estado.textContent =
        "Preparando inteligencia artificial...";


    try {

        modelo = await tmImage.load(
            URL_MODELO + "model.json",
            URL_MODELO + "metadata.json"
        );


        estado.textContent =
            "Modelo listo. Selecciona una fotografía para comenzar.";


        console.log(
            "Modelo cargado correctamente."
        );


    } catch (error) {

        console.error(
            "Error al cargar el modelo:",
            error
        );


        estado.textContent =
            "No se pudo cargar el modelo.";

    }

}


// ========================================
// ANALIZAR IMAGEN
// ========================================

async function analizarImagen(imagen) {


    if (!modelo) {

        estado.textContent =
            "El modelo todavía se está cargando.";

        return;

    }


    // Ocultar resultado anterior

    resultado.classList.add(
        "oculto"
    );


    // Mostrar animación

    estado.innerHTML =
        '<span class="cargando"></span> Analizando imagen...';


    // Pequeña espera para mostrar la animación

    await new Promise(
        function(resolve) {

            setTimeout(
                resolve,
                700
            );

        }
    );


    try {


        // Obtener predicciones

        const predicciones =
            await modelo.predict(imagen);


        let ale = 0;
        let noAle = 0;


        // Obtener porcentajes

        predicciones.forEach(
            function(prediccion) {


                if (
                    prediccion.className === "Ale"
                ) {

                    ale =
                        prediccion.probability * 100;

                }


                if (
                    prediccion.className === "No_Ale"
                ) {

                    noAle =
                        prediccion.probability * 100;

                }

            }
        );


        // ========================================
        // MOSTRAR PORCENTAJES
        // ========================================

        porcentajeAle.textContent =
            ale.toFixed(2) + "%";


        porcentajeNoAle.textContent =
            noAle.toFixed(2) + "%";


        // ========================================
        // REINICIAR BARRAS
        // ========================================

        barraAle.style.width =
            "0%";


        barraNoAle.style.width =
            "0%";


        // Mostrar resultado

        resultado.classList.remove(
            "oculto"
        );


        // Animar barras

        setTimeout(
            function() {

                barraAle.style.width =
                    ale + "%";


                barraNoAle.style.width =
                    noAle + "%";

            },
            100
        );


        // ========================================
        // CONCLUSIÓN
        // ========================================

        if (
            ale >= noAle
        ) {


            textoConclusion.textContent =
                "Es muy probable que sea Ale";


            iconoConclusion.textContent =
                "✓";


            conclusion.classList.remove(
                "conclusion-no"
            );


        } else {


            textoConclusion.textContent =
                "Es muy probable que no sea Ale";


            iconoConclusion.textContent =
                "✕";


            conclusion.classList.add(
                "conclusion-no"
            );

        }


        // ========================================
        // ESTADO FINAL
        // ========================================

        estado.textContent =
            "Análisis completado correctamente.";


        console.log(
            "Ale:",
            ale.toFixed(2) + "%"
        );


        console.log(
            "No_Ale:",
            noAle.toFixed(2) + "%"
        );


    } catch (error) {


        console.error(
            "Error al analizar la imagen:",
            error
        );


        estado.textContent =
            "Ocurrió un error al analizar la imagen.";

    }

}


// ========================================
// SUBIR FOTOGRAFÍA
// ========================================

imagenInput.addEventListener(
    "change",
    function(event) {


        const archivo =
            event.target.files[0];


        if (!archivo) {

            return;

        }


        // Detener cámara

        detenerCamara();


        areaCamara.classList.add(
            "oculto"
        );


        // Leer imagen

        const lector =
            new FileReader();


        lector.onload =
            function(e) {


                imagenVista.src =
                    e.target.result;


                marcoImagen.classList.remove(
                    "oculto"
                );


                imagenVista.onload =
                    function() {


                        analizarImagen(
                            imagenVista
                        );


                    };

            };


        lector.readAsDataURL(
            archivo
        );

    }
);


// ========================================
// ACTIVAR CÁMARA
// ========================================

activarCamara.addEventListener(
    "click",
    async function() {


        try {


            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
            ) {


                estado.textContent =
                    "Tu navegador no permite acceder a la cámara.";


                return;

            }


            camaraStream =
                await navigator.mediaDevices.getUserMedia({

                    video: {

                        facingMode: "user"

                    },

                    audio: false

                });


            video.srcObject =
                camaraStream;


            areaCamara.classList.remove(
                "oculto"
            );


            marcoImagen.classList.add(
                "oculto"
            );


            resultado.classList.add(
                "oculto"
            );


            estado.textContent =
                "Cámara activada. Coloca tu rostro frente a la cámara.";

        }


        catch (error) {


            console.error(
                "Error al acceder a la cámara:",
                error
            );


            estado.textContent =
                "No se pudo acceder a la cámara. Verifica los permisos.";

        }

    }
);


// ========================================
// TOMAR FOTOGRAFÍA
// ========================================

tomarFoto.addEventListener(
    "click",
    function() {


        if (!camaraStream) {


            estado.textContent =
                "Primero debes activar la cámara.";


            return;

        }


        canvas.width =
            video.videoWidth;


        canvas.height =
            video.videoHeight;


        const contexto =
            canvas.getContext("2d");


        contexto.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );


        // Mostrar fotografía

        imagenVista.src =
            canvas.toDataURL(
                "image/png"
            );


        marcoImagen.classList.remove(
            "oculto"
        );


        // Analizar

        analizarImagen(
            canvas
        );

    }
);


// ========================================
// CERRAR CÁMARA
// ========================================

cerrarCamara.addEventListener(
    "click",
    function() {


        detenerCamara();


        areaCamara.classList.add(
            "oculto"
        );


        estado.textContent =
            "Cámara cerrada.";

    }
);


// ========================================
// DETENER CÁMARA
// ========================================

function detenerCamara() {


    if (camaraStream) {


        camaraStream
            .getTracks()
            .forEach(
                function(track) {

                    track.stop();

                }
            );


        camaraStream = null;

    }


    video.srcObject =
        null;

}


// ========================================
// ANALIZAR OTRA IMAGEN
// ========================================

limpiar.addEventListener(
    "click",
    function() {


        detenerCamara();


        imagenInput.value =
            "";


        imagenVista.src =
            "";


        marcoImagen.classList.add(
            "oculto"
        );


        areaCamara.classList.add(
            "oculto"
        );


        resultado.classList.add(
            "oculto"
        );


        barraAle.style.width =
            "0%";


        barraNoAle.style.width =
            "0%";


        porcentajeAle.textContent =
            "0.00%";


        porcentajeNoAle.textContent =
            "0.00%";


        conclusion.classList.remove(
            "conclusion-no"
        );


        estado.textContent =
            "Esperando una imagen...";

    }
);


// ========================================
// INICIAR
// ========================================

cargarModelo();