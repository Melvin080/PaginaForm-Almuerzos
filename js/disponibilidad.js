document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('form-container');
    const mensajeDisponible = document.getElementById('disponibilidad');
    const hora = new Date();
    let horaActual = hora.getUTCHours();
    let minutosActual = hora.getUTCMinutes();
    let horaMinima = 11.30;
    let horaMaxima = 13.45;
    
    let utcHora = horaActual+(minutosActual/100);
    if (horaMinima != utcHora && utcHora != horaMaxima) {
        formulario.style.display = 'block';
        mensajeDisponible.style.display = 'none';
    }else {
        formulario.style.display = 'none';
        mensajeDisponible.style.display = 'block';
    }
})