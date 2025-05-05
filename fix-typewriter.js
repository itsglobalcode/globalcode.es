/**
 * Solución definitiva para la animación de escritura - versión mejorada
 * Este script debe cargarse después de que la página esté completamente cargada
 */
document.addEventListener("DOMContentLoaded", () => {
  // Esperar a que la animación de intro termine (tiempo reducido)
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

      // Eliminar cualquier animación existente
      line1.style.animation = "none"
      line2.style.animation = "none"

      // Restablecer el contenido y estilos
      const line1Text = line1.textContent
      const line2Text = line2.textContent
      line1.textContent = ""
      line2.textContent = ""
      line1.style.width = "0"
      line2.style.width = "0"

      // Forzar un reflow
      void line1.offsetWidth
      void line2.offsetWidth

      // Restaurar el contenido
      line1.textContent = line1Text
      line2.textContent = line2Text

      // Aplicar animación manualmente con JavaScript - VELOCIDAD AUMENTADA
      let width1 = 0
      let width2 = 0
      const maxWidth1 = 100
      const maxWidth2 = 100
      const steps1 = 20
      const steps2 = 15
      const duration1 = 1000 // Reducido a 1000ms para mayor velocidad
      const duration2 = 800 // Reducido a 800ms para mayor velocidad
      const delay2 = 1100 // Reducido a 1100ms para mayor velocidad

      // Animación para la primera línea
      const interval1 = setInterval(() => {
        width1 += maxWidth1 / steps1
        if (width1 >= maxWidth1) {
          width1 = maxWidth1
          clearInterval(interval1)

          // Iniciar la segunda línea después del retraso
          setTimeout(() => {
            const interval2 = setInterval(() => {
              width2 += maxWidth2 / steps2
              if (width2 >= maxWidth2) {
                width2 = maxWidth2
                clearInterval(interval2)

                // Añadir cursor parpadeante al final
                const cursor = document.createElement("span")
                cursor.className = "cursor"
                cursor.textContent = "|"
                cursor.style.position = "absolute"
                cursor.style.right = "-5px"
                cursor.style.animation = "blink 0.75s step-end infinite"
                line2.appendChild(cursor)

                // Ocultar el cursor después de un tiempo más corto
                setTimeout(() => {
                  cursor.style.opacity = "0"
                  cursor.style.display = "none" // Asegurar que desaparezca completamente
                }, 800) // Reducido a 800ms
              }
              line2.style.width = `${width2}%`
            }, duration2 / steps2)
          }, delay2)
        }
        line1.style.width = `${width1}%`
      }, duration1 / steps1)

      // Añadir estilos para el cursor
      const style = document.createElement("style")
      style.textContent = `
        @keyframes blink {
          from, to { opacity: 0; }
          50% { opacity: 1; }
        }
        
        .line-1, .line-2 {
          white-space: nowrap;
          overflow: hidden;
          display: inline-block;
          position: relative;
        }
      `
      document.head.appendChild(style)
    }
  }, 2500) // Reducido a 2500ms para iniciar antes
})
