// Función para forzar la posición al inicio de la página
function forceScrollToTop() {
  // Eliminar cualquier hash de la URL para evitar scroll automático
  if (window.location.hash) {
    history.pushState("", document.title, window.location.pathname + window.location.search)
  }

  // Forzar la posición al inicio de múltiples maneras
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0 // Para Safari

  // Prevenir cualquier desplazamiento automático
  history.scrollRestoration = "manual"
}

// Aplicar inmediatamente
forceScrollToTop()

// Aplicar en varios momentos para asegurar que funcione
document.addEventListener("DOMContentLoaded", forceScrollToTop)
window.addEventListener("load", forceScrollToTop)

// Aplicar después de un pequeño retraso para capturar cualquier navegación automática tardía
setTimeout(forceScrollToTop, 100)
setTimeout(forceScrollToTop, 500)
setTimeout(forceScrollToTop, 1000)

// Menú móvil toggle
const menuToggle = document.querySelector(".menu-toggle")
const navMenu = document.querySelector(".nav-menu")

// Forzar la posición al inicio de la página cuando se carga
window.addEventListener("DOMContentLoaded", () => {
  // Eliminar cualquier hash de la URL para evitar scroll automático
  if (window.location.hash) {
    history.pushState("", document.title, window.location.pathname + window.location.search)
  }

  // Forzar la posición al inicio de múltiples maneras
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0 // Para Safari

  // Prevenir cualquier desplazamiento automático
  history.scrollRestoration = "manual"
})

// Modificar el evento load para forzar la posición al inicio de manera más agresiva
window.addEventListener("load", () => {
  // Forzar la posición al inicio de la página de múltiples maneras
  forceScrollToTop()

  // Desactivar temporalmente los eventos de scroll
  const disableScroll = (e) => {
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  // Aplicar la desactivación brevemente a varios eventos
  window.addEventListener("scroll", disableScroll, { passive: false })
  window.addEventListener("touchmove", disableScroll, { passive: false })
  window.addEventListener("wheel", disableScroll, { passive: false })

  // Reactivar después de un momento
  setTimeout(() => {
    window.removeEventListener("scroll", disableScroll)
    window.removeEventListener("touchmove", disableScroll)
    window.removeEventListener("wheel", disableScroll)

    // Aplicar una última vez para asegurar
    forceScrollToTop()
  }, 500)
})

// Implementar desplazamiento suave para todos los enlaces internos
document.addEventListener("DOMContentLoaded", () => {
  // Forzar la posición al inicio
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0

  // Seleccionar todos los enlaces que apuntan a anclas internas
  const internalLinks = document.querySelectorAll('a[href^="#"]')

  internalLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      // Obtener el destino del enlace
      const targetId = this.getAttribute("href")

      // Si es solo "#", ir al inicio de la página
      if (targetId === "#") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
        return
      }

      // Encontrar el elemento de destino
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        // Cerrar el menú móvil si está abierto
        if (navMenu.classList.contains("active")) {
          navMenu.classList.remove("active")
          menuToggle.classList.remove("active")

          // Resetear barras del menú
          const bars = document.querySelectorAll(".bar")
          bars[0].style.transform = "rotate(0)"
          bars[1].style.opacity = "1"
          bars[2].style.transform = "rotate(0)"

          // Permitir scroll nuevamente
          document.body.style.overflow = "auto"
        }

        // Calcular la posición de desplazamiento (considerando la altura de la navbar)
        const navbar = document.querySelector(".navbar")
        const navbarHeight = navbar ? navbar.offsetHeight : 0
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight

        // Desplazamiento suave
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })

        // Actualizar la URL (opcional)
        history.pushState(null, null, targetId)
      }
    })
  })

  // Resto del código existente para el manejo de enlaces de navegación
  // (Podemos eliminar el código duplicado de manejo de clics en navLinks)

  // Animación para el marco circular
  const circularFrame = document.querySelector(".circular-frame")
  if (circularFrame) {
    // Efecto de rotación suave al hacer hover
    circularFrame.addEventListener("mousemove", (e) => {
      const rect = circularFrame.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      // Limitar la rotación a un máximo de 10 grados
      const tiltX = (y / (rect.height / 2)) * 10
      const tiltY = (-x / (rect.width / 2)) * 10

      circularFrame.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
    })

    // Restablecer la rotación cuando el mouse sale
    circularFrame.addEventListener("mouseleave", () => {
      circularFrame.style.transform = "perspective(1000px) rotateX(0) rotateY(0)"
    })
  }

  // Actualizar el enlace de contacto en la navegación
  const contactLink = document.querySelector(".btn-contacto")
  if (contactLink) {
    contactLink.setAttribute("href", "#contact")
  }
})

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active")
  navMenu.classList.toggle("active")

  // Animación para las barras del menú hamburguesa
  const bars = document.querySelectorAll(".bar")
  if (menuToggle.classList.contains("active")) {
    bars[0].style.transform = "rotate(-45deg) translate(-5px, 6px)"
    bars[1].style.opacity = "0"
    bars[2].style.transform = "rotate(45deg) translate(-5px, -6px)"
    // Prevenir scroll cuando el menú está abierto
    document.body.style.overflow = "hidden"
  } else {
    bars[0].style.transform = "rotate(0)"
    bars[1].style.opacity = "1"
    bars[2].style.transform = "rotate(0)"
    // Permitir scroll cuando el menú está cerrado
    document.body.style.overflow = "auto"
  }
})

// Cerrar menú al hacer clic en un enlace - Ya no es necesario este bloque porque
// el manejo de clics en enlaces internos ya incluye esta funcionalidad

// Cambiar estilo de la navbar al hacer scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }
})

// Marcar enlace activo según la sección
function setActiveLink() {
  const sections = document.querySelectorAll("section")
  const navLinks = document.querySelectorAll(".nav-link")

  window.addEventListener("scroll", () => {
    let current = ""
    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active")
      }
    })
  })
}

// Inicializar cuando se agreguen secciones
setActiveLink()

// Ajustar menú en cambio de orientación
window.addEventListener("resize", () => {
  if (window.innerWidth > 820) {
    navMenu.classList.remove("active")
    menuToggle.classList.remove("active")
    document.body.style.overflow = "auto"

    const bars = document.querySelectorAll(".bar")
    bars[0].style.transform = "rotate(0)"
    bars[1].style.opacity = "1"
    bars[2].style.transform = "rotate(0)"
  }
})
