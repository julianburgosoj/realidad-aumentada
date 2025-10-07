// Elementos del DOM
const startButton = document.getElementById('start-button');
const loadingOverlay = document.getElementById('loading-overlay');
const arScene = document.getElementById('ar-scene');
const errorMessage = document.getElementById('error-message');

/**
 * Función para iniciar la escena MindAR
 * Se llama después de que el usuario hace click en el botón.
 */
const startAR = async () => {
    loadingOverlay.style.display = 'none'; // Oculta el overlay de inicio
    
    // Obtenemos el componente MindAR de la escena
    const mindarComponent = arScene.components['mindar-image'];

    if (!mindarComponent) {
        // En teoría, esto no debería pasar si A-Frame cargó correctamente.
        displayError("El componente MindAR no se encontró. Revisa la carga de librerías.");
        return;
    }
    
    try {
        // Solicitamos permiso y comenzamos la cámara y el seguimiento
        await mindarComponent.start();
        console.log("MindAR iniciado con éxito. ¡Busca la imagen objetivo!");
    } catch (err) {
        // Manejo de errores de cámara (permisos, conexión, etc.)
        handleStartError(err);
    }
};

/**
 * Muestra un mensaje de error legible al usuario y revela el overlay.
 * @param {string} msg - El mensaje de error a mostrar.
 */
const displayError = (msg) => {
    loadingOverlay.style.display = 'flex'; // Vuelve a mostrar el overlay
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
    startButton.textContent = "Error, Toca para Reintentar";
    startButton.classList.add('bg-red-600', 'hover:bg-red-700');
    console.error("Error AR:", msg);
};


/**
 * Diagnóstico de errores de inicio de la Realidad Aumentada.
 */
const handleStartError = (err) => {
    let title = "Error de Cámara Desconocido";
    let message = "Ocurrió un error al iniciar la cámara. Asegúrate de que tu dispositivo y navegador sean compatibles.";

    if (err && (err.name === 'NotAllowedError' || (err.message && err.message.includes('permission')))) {
        title = "¡Permiso de Cámara Denegado!";
        message = "Tu navegador ha bloqueado el acceso a la cámara. Debes cambiar el permiso manualmente en la configuración del navegador para este sitio y recargar la página.";
    } else if (window.location.protocol === 'file:') {
        title = "¡Error de Seguridad!";
        message = "Para acceder a la cámara, debes ejecutar esta aplicación usando un **servidor web** (HTTPS es mejor, o Live Server). No funciona abriendo el archivo localmente.";
    } else if (err && err.message.includes('No devices found')) {
        title = "No se Encontró Dispositivo";
        message = "Asegúrate de tener una cámara conectada y que no esté siendo utilizada por otra aplicación.";
    }

    displayError(`⚠️ ${title}: ${message}`);
};

// 1. Evento principal que inicia todo al hacer clic en el botón
startButton.addEventListener('click', startAR);
