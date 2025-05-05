document.addEventListener("DOMContentLoaded", () => {
  // Elementos del slider
  const slider = document.querySelector(".tech-slider")
  const slides = document.querySelectorAll(".tech-slide")
  const prevBtn = document.querySelector(".prev-btn")
  const nextBtn = document.querySelector(".next-btn")
  const dots = document.querySelectorAll(".slider-dot")
  const techCards = document.querySelectorAll(".tech-card")

  // Verificar que todos los elementos existen
  if (!slider || !slides.length || !prevBtn || !nextBtn) {
    console.error("Elementos del slider no encontrados")
    return
  }

  let currentIndex = 0

  // Función para mostrar un slide específico
  function showSlide(index) {
    // Validar el índice
    if (index < 0) index = slides.length - 1
    if (index >= slides.length) index = 0

    currentIndex = index

    // Ocultar todos los slides
    slides.forEach((slide) => {
      slide.style.display = "none"
    })

    // Mostrar el slide actual
    slides[currentIndex].style.display = "block"

    // Actualizar los dots
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex)
    })

    console.log("Mostrando slide", currentIndex)
  }

  // Configurar eventos para los botones
  nextBtn.addEventListener("click", () => {
    showSlide(currentIndex + 1)
  })

  prevBtn.addEventListener("click", () => {
    showSlide(currentIndex - 1)
  })

  // Configurar eventos para los dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index)
    })
  })

  // Implementación del efecto flip para las tarjetas - OPTIMIZED
  techCards.forEach((card) => {
    card.addEventListener("click", function () {
      const inner = this.querySelector(".tech-card-inner")

      // Remove any existing flip timeout
      if (this.flipTimeout) {
        clearTimeout(this.flipTimeout)
      }

      // Toggle the flipped class
      inner.classList.toggle("flipped")

      // If flipped, set a timeout to flip back
      if (inner.classList.contains("flipped")) {
        this.flipTimeout = setTimeout(() => {
          // Add a class for smoother transition back
          inner.classList.add("returning")
          inner.classList.remove("flipped")

          // Remove the returning class after transition completes
          setTimeout(() => {
            inner.classList.remove("returning")
          }, 300)
        }, 3000) // Reduced from 5000ms to 3000ms for better UX
      }
    })
  })

  // Iniciar el slider
  showSlide(0)
})
