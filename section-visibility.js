/**
 * Este script controla la visibilidad de las secciones
 * para evitar que se muestren secciones incorrectas al cargar la página
 */
document.addEventListener("DOMContentLoaded", () => {
    // Ocultar todas las secciones EXCEPTO hero inicialmente
    const sections = document.querySelectorAll("section:not(.hero)")
    sections.forEach((section) => {
      section.style.visibility = "hidden"
      section.style.opacity = "0"
    })
  
    // Configurar un observador de intersección para mostrar secciones cuando son visibles
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Hacer visible la sección cuando entra en el viewport
            entry.target.style.visibility = "visible"
            entry.target.style.opacity = "1"
            entry.target.classList.add("visible")
  
            // Opcional: dejar de observar después de hacerla visible
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    ) // Mostrar cuando al menos 10% de la sección es visible
  
    // Comenzar a observar todas las secciones después de un breve retraso
    setTimeout(() => {
      sections.forEach((section) => {
        observer.observe(section)
      })
    }, 1000) // Esperar 1 segundo para asegurarse de que la página está estable
  })
  