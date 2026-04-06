// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Efecto de resaltado al usar el menú lateral
    const menuLinks = document.querySelectorAll('.list-group-item a');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Obtener el id de la sección (ej: #escritura)
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            // Aplicar una clase de resaltado temporal
            if (targetSection) {
                targetSection.style.transition = "background-color 0.5s ease";
                targetSection.style.backgroundColor = "#e7f1ff";
                
                // Quitar el resaltado después de 1 segundo
                setTimeout(() => {
                    targetSection.style.backgroundColor = "white";
                }, 1000);
            }
        });
    });

    // 2. Interactividad en la sección de pago (Feedback al usuario)
    const pagoSection = document.querySelector('#pago');
    const botonPago = document.createElement('button');
    
    botonPago.innerHTML = "¡Entendido! Ir a comprar";
    botonPago.className = "btn btn-primary mt-3";
    
    pagoSection.appendChild(botonPago);

    botonPago.addEventListener('click', () => {
        alert("🎉 ¡Gracias por leer el tutorial! Ahora estás listo para realizar tu compra segura en nuestra papelería.");
    });

    // 3. Log de consola para depuración (Buenas prácticas)
    console.log("Componentes de Papelería Online cargados correctamente.");
});