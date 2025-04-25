/**
 * SOLUCIÓN RADICAL PARA PREVENIR CUALQUIER SCROLL AUTOMÁTICO
 * Este script debe cargarse lo antes posible en el head
 */

// Ejecutar inmediatamente como IIFE para máxima prioridad
;(() => {
    // Función para forzar la posición al inicio de la página
    function forceScrollToTop() {
      // Eliminar cualquier hash de la URL para evitar scroll automático
      if (window.location.hash) {
        history.replaceState(null, document.title, window.location.pathname + window.location.search)
      }
  
      // Forzar la posición al inicio de múltiples maneras
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0 // Para Safari
  
      // Prevenir cualquier desplazamiento automático
      if (history.scrollRestoration) {
        history.scrollRestoration = "manual"
      }
    }
  
    // Aplicar inmediatamente
    forceScrollToTop()
  
    // Función para desactivar completamente el scroll
    function disableScroll(e) {
      e.preventDefault()
      e.stopPropagation()
      return false
    }
  
    // Bloquear TODOS los eventos de scroll posibles
    window.addEventListener("scroll", disableScroll, { passive: false, capture: true })
    window.addEventListener("touchmove", disableScroll, { passive: false, capture: true })
    window.addEventListener("wheel", disableScroll, { passive: false, capture: true })
    window.addEventListener("mousewheel", disableScroll, { passive: false, capture: true })
    window.addEventListener("DOMMouseScroll", disableScroll, { passive: false, capture: true })
  
    // Bloquear también el uso de las teclas de flecha y espacio para scroll
    window.addEventListener(
      "keydown",
      (e) => {
        // Teclas que pueden causar scroll: flechas, espacio, inicio, fin, Re Pág, Av Pág
        if ([32, 33, 34, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
          e.preventDefault()
          return false
        }
      },
      { passive: false, capture: true },
    )
  
    // Reactivar el scroll después de que la página esté completamente cargada
    window.addEventListener("load", () => {
      // Aplicar una última vez para asegurar que estamos en la parte superior
      forceScrollToTop()
  
      // Esperar un poco más para asegurarnos de que la animación de intro ha comenzado
      setTimeout(() => {
        // Eliminar los bloqueos de scroll
        window.removeEventListener("scroll", disableScroll, { capture: true })
        window.removeEventListener("touchmove", disableScroll, { capture: true })
        window.removeEventListener("wheel", disableScroll, { capture: true })
        window.removeEventListener("mousewheel", disableScroll, { capture: true })
        window.removeEventListener("DOMMouseScroll", disableScroll, { capture: true })
  
        // Nota: Mantenemos el bloqueo de teclas activo hasta que la animación termine
        // Se eliminará en intro-animation.js
      }, 500) // Reducido a 500ms para permitir que las animaciones comiencen antes
    })
  
    // Exponer funciones para que otros scripts puedan usarlas
    window.scrollFix = {
      forceScrollToTop: forceScrollToTop,
      disableScroll: disableScroll,
    }
  })()
  