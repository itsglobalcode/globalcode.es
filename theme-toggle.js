/**
 * Script para manejar el cambio de tema claro/oscuro
 * Permite cambio manual y también detecta preferencias del sistema
 */
document.addEventListener("DOMContentLoaded", () => {
  // Función para cambiar el tema
  function toggleTheme() {
    const currentTheme =
      document.documentElement.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    const newTheme = currentTheme === "light" ? "dark" : "light"

    // Actualizar el atributo en el HTML
    document.documentElement.setAttribute("data-theme", newTheme)

    // Guardar la preferencia en localStorage
    localStorage.setItem("theme", newTheme)

    // Actualizar el ícono del botón
    updateThemeIcon(newTheme)
  }

  // Función para actualizar el ícono según el tema
  function updateThemeIcon(theme) {
    const sunIcon = document.querySelector(".theme-toggle .sun")
    const moonIcon = document.querySelector(".theme-toggle .moon")

    if (sunIcon && moonIcon) {
      if (theme === "dark") {
        sunIcon.style.transform = "translateY(-40px)"
        moonIcon.style.transform = "translateY(0)"
      } else {
        sunIcon.style.transform = "translateY(0)"
        moonIcon.style.transform = "translateY(40px)"
      }
    }
  }

  // Obtener el tema guardado o usar el predeterminado del sistema
  const savedTheme = localStorage.getItem("theme")
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches

  // Aplicar el tema guardado o el del sistema
  if (savedTheme) {
    // Si hay una preferencia guardada, usarla
    document.documentElement.setAttribute("data-theme", savedTheme)
    updateThemeIcon(savedTheme)
  } else {
    // Si no hay preferencia guardada, usar la del sistema
    const systemTheme = prefersDarkMode ? "dark" : "light"
    document.documentElement.setAttribute("data-theme", systemTheme)
    updateThemeIcon(systemTheme)
  }

  // Agregar evento al botón de cambio de tema
  const themeToggle = document.getElementById("theme-toggle")
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme)
  }
})
