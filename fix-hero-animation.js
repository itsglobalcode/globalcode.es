/**
 * Este script se encarga específicamente de arreglar la animación de escritura
 * en el orbe de la sección hero
 */
document.addEventListener("DOMContentLoaded", () => {
  // Esperar a que la página esté completamente cargada
  setTimeout(() => {
    // Obtener referencias a los elementos de texto
    const line1 = document.querySelector(".line-1")
    const line2 = document.querySelector(".line-2")

    if (line1 && line2) {
      // Asegurarse de que los elementos sean visibles
      line1.style.visibility = "visible"
      line2.style.visibility = "visible"
      line1.style.opacity = "1"
      line2.style.opacity = "1"

      // Reiniciar las animaciones
      line1.style.animation = "none"
      line2.style.animation = "none"

      // Forzar un reflow
      void line1.offsetWidth
      void line2.offsetWidth

      // Aplicar las animaciones con un pequeño retraso
      setTimeout(() => {
        // Restaurar las animaciones originales
        line1.style.animation = "typing 2s steps(20, end) forwards"
        line2.style.animation = "typing 1.5s steps(15, end) 2s forwards"

        // Añadir el cursor parpadeante al final
        setTimeout(() => {
          // Asegurarse de que el cursor esté visible
          const cursorStyle = document.createElement("style")
          cursorStyle.textContent = `
            .line-2::after {
              content: "|";
              position: absolute;
              right: -5px;
              animation: blink 0.75s step-end infinite, disappear 0.1s forwards 3.5s;
              opacity: 1;
            }
            
            @keyframes blink {
              from, to { opacity: 0; }
              50% { opacity: 1; }
            }
            
            @keyframes disappear {
              to { opacity: 0; }
            }
          `
          document.head.appendChild(cursorStyle)
        }, 2000)
      }, 100)
    }
  }, 1000) // Esperar 1 segundo después de DOMContentLoaded
})
