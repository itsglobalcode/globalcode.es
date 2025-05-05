document.addEventListener("DOMContentLoaded", () => {
  // Asegurarse de que estamos en la parte superior antes de cualquier cosa
  if (window.scrollFix && window.scrollFix.forceScrollToTop) {
    window.scrollFix.forceScrollToTop()
  } else {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  // Eliminar la verificación de sessionStorage para que la animación se muestre siempre
  // Crear el contenedor de la animación de intro
  const introContainer = document.createElement("div")
  introContainer.className = "intro-animation"

  // Estructura HTML para la animación
  introContainer.innerHTML = `
      <div class="intro-overlay"></div>
      <div class="intro-content">
        <div class="logo-container">
          <div class="logo-circle"></div>
          <img src="ChatGPT Image Apr 24, 2025 at 08_55_23 PM.png" alt="Global Code Logo" class="intro-logo">
        </div>
        <div class="tagline-container">
          <div class="tagline-line">TRANSFORMAMOS</div>
          <div class="tagline-line">IDEAS EN</div>
          <div class="tagline-line highlight">REALIDAD</div>
        </div>
        <div class="code-elements">
          <div class="code-element">&lt;/&gt;</div>
          <div class="code-element">{ }</div>
          <div class="code-element">&lt;/&gt;</div>
          <div class="code-element">{ }</div>
          <div class="code-element">&lt;/&gt;</div>
        </div>
        <div class="tech-words">
          <span>INNOVACIÓN</span>
          <span>TECNOLOGÍA</span>
          <span>FUTURO</span>
          <span>DESARROLLO</span>
          <span>SOLUCIONES</span>
        </div>
        <div class="loading-bar">
          <div class="loading-progress"></div>
        </div>
      </div>
    `

  // Añadir al body antes que cualquier otro contenido
  document.body.prepend(introContainer)

  // Prevenir scroll durante la animación
  document.body.style.overflow = "hidden"

  // Ocultar el chatbot durante la animación
  const chatbotContainer = document.querySelector(".chatbot-container")
  if (chatbotContainer) {
    chatbotContainer.style.display = "none"
  }

  // Iniciar la secuencia de animación
  setTimeout(() => {
    introContainer.classList.add("animation-started")

    // Añadir el porcentaje a la barra de carga
    const loadingProgress = document.querySelector(".loading-progress")
    const loadingBar = document.querySelector(".loading-bar")

    // Crear el elemento para mostrar el porcentaje
    const percentageElement = document.createElement("div")
    percentageElement.className = "loading-percentage"
    percentageElement.textContent = "0%"
    loadingBar.appendChild(percentageElement)

    // Animar la barra de progreso con actualización de porcentaje
    let progress = 0
    const progressInterval = setInterval(() => {
      progress += 1
      if (progress <= 100) {
        loadingProgress.style.width = `${progress}%`
        percentageElement.textContent = `${progress}%`
      } else {
        clearInterval(progressInterval)
      }
    }, 35) // 3.5 segundos total (100 * 35ms = 3500ms)

    // Secuencia de finalización
    setTimeout(() => {
      introContainer.classList.add("animation-ending")

      // Eliminar la animación y restaurar el scroll
      setTimeout(() => {
        // Asegurarse de que estamos en la parte superior
        if (window.scrollFix && window.scrollFix.forceScrollToTop) {
          window.scrollFix.forceScrollToTop()
        } else {
          window.scrollTo(0, 0)
          document.documentElement.scrollTop = 0
          document.body.scrollTop = 0
        }

        // Ahora eliminar la animación
        introContainer.remove()
        document.body.style.overflow = "auto"

        // Mostrar el chatbot después de la animación
        if (chatbotContainer) {
          chatbotContainer.style.display = "block"
        }

        // Iniciar la animación del hero después de la intro
        const heroContent = document.querySelector(".hero-content")
        if (heroContent) {
          heroContent.classList.add("hero-visible")
        }

        // Reactivar el scroll normal después de un momento
        setTimeout(() => {
          // Eliminar cualquier bloqueo de teclas que quedara del script scroll-fix.js
          window.removeEventListener("keydown", window.scrollFix && window.scrollFix.disableScroll, { capture: true })

          // Restaurar el comportamiento de scroll suave si es necesario
          document.body.style.scrollBehavior = "smooth"
        }, 500)
      }, 1000)
    }, 4000) // Duración total de la animación principal
  }, 500)

  // Permitir saltar la animación con un clic
  introContainer.addEventListener("click", () => {
    // Asegurarse de que estamos en la parte superior
    if (window.scrollFix && window.scrollFix.forceScrollToTop) {
      window.scrollFix.forceScrollToTop()
    } else {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    // Iniciar la animación de salida
    introContainer.classList.add("animation-ending")

    setTimeout(() => {
      // Eliminar la animación
      introContainer.remove()
      document.body.style.overflow = "auto"

      // Mostrar el chatbot después de la animación
      if (chatbotContainer) {
        chatbotContainer.style.display = "block"
      }

      // Iniciar la animación del hero
      const heroContent = document.querySelector(".hero-content")
      if (heroContent) {
        heroContent.classList.add("hero-visible")
      }

      // Reactivar el scroll normal después de un momento
      setTimeout(() => {
        // Eliminar cualquier bloqueo de teclas que quedara del script scroll-fix.js
        window.removeEventListener("keydown", window.scrollFix && window.scrollFix.disableScroll, { capture: true })

        // Restaurar el comportamiento de scroll suave si es necesario
        document.body.style.scrollBehavior = "smooth"
      }, 500)
    }, 500)
  })
})
