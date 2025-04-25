document.addEventListener("DOMContentLoaded", () => {
    // Funciones para manejar cookies
    const CookieManager = {
      // Establecer una cookie
      setCookie: (name, value, days) => {
        let expires = ""
        if (days) {
          const date = new Date()
          date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
          expires = "; expires=" + date.toUTCString()
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax"
      },
  
      // Obtener el valor de una cookie
      getCookie: (name) => {
        const nameEQ = name + "="
        const ca = document.cookie.split(";")
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i]
          while (c.charAt(0) === " ") c = c.substring(1, c.length)
          if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
        }
        return null
      },
  
      // Eliminar una cookie
      eraseCookie: (name) => {
        document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
      },
    }
  
    // Verificar si ya se han aceptado o rechazado las cookies
    const cookiesAccepted = CookieManager.getCookie("cookiesAccepted") || localStorage.getItem("cookiesAccepted")
  
    if (cookiesAccepted === null) {
      // Crear el contenedor del popup de cookies
      const cookiesPopup = document.createElement("div")
      cookiesPopup.className = "cookies-popup"
  
      // Estructura HTML para el popup
      cookiesPopup.innerHTML = `
        <div class="cookies-content">
          <div class="cookies-header">
            <i class="fas fa-cookie-bite"></i>
            <h3>Política de Cookies</h3>
          </div>
          <p>Utilizamos cookies propias y de terceros para mejorar nuestros servicios y mostrarle publicidad relacionada con sus preferencias mediante el análisis de sus hábitos de navegación.</p>
          <div class="cookies-options">
            <button class="btn-accept-all">Aceptar todas</button>
            <button class="btn-accept-necessary">Solo necesarias</button>
            <button class="btn-customize">Personalizar</button>
          </div>
          <div class="cookies-customize" style="display: none;">
            <div class="cookie-option">
              <label class="switch">
                <input type="checkbox" checked disabled>
                <span class="slider round"></span>
              </label>
              <div class="cookie-option-text">
                <h4>Cookies necesarias</h4>
                <p>Esenciales para el funcionamiento del sitio web.</p>
              </div>
            </div>
            <div class="cookie-option">
              <label class="switch">
                <input type="checkbox" id="analytics-cookies" checked>
                <span class="slider round"></span>
              </label>
              <div class="cookie-option-text">
                <h4>Cookies analíticas</h4>
                <p>Nos ayudan a entender cómo interactúas con el sitio web.</p>
              </div>
            </div>
            <div class="cookie-option">
              <label class="switch">
                <input type="checkbox" id="marketing-cookies" checked>
                <span class="slider round"></span>
              </label>
              <div class="cookie-option-text">
                <h4>Cookies de marketing</h4>
                <p>Utilizadas para rastrear a los visitantes en los sitios web.</p>
              </div>
            </div>
            <button class="btn-save-preferences">Guardar preferencias</button>
          </div>
        </div>
      `
  
      // Añadir al body
      document.body.appendChild(cookiesPopup)
  
      // Mostrar el popup con una animación
      setTimeout(() => {
        cookiesPopup.classList.add("show")
      }, 1000)
  
      // Manejar eventos de botones
      const btnAcceptAll = cookiesPopup.querySelector(".btn-accept-all")
      const btnAcceptNecessary = cookiesPopup.querySelector(".btn-accept-necessary")
      const btnCustomize = cookiesPopup.querySelector(".btn-customize")
      const btnSavePreferences = cookiesPopup.querySelector(".btn-save-preferences")
      const cookiesCustomize = cookiesPopup.querySelector(".cookies-customize")
  
      btnAcceptAll.addEventListener("click", () => {
        // Establecer cookies para todas las categorías
        CookieManager.setCookie("cookiesAccepted", "all", 365)
        CookieManager.setCookie("cookieNecessary", "true", 365)
        CookieManager.setCookie("cookieAnalytics", "true", 365)
        CookieManager.setCookie("cookieMarketing", "true", 365)
  
        // Guardar preferencias en localStorage como respaldo
        localStorage.setItem("cookiesAccepted", "all")
        localStorage.setItem(
          "cookiePreferences",
          JSON.stringify({
            necessary: true,
            analytics: true,
            marketing: true,
          }),
        )
  
        closePopup()
        activateCookies("all")
      })
  
      btnAcceptNecessary.addEventListener("click", () => {
        // Establecer solo cookies necesarias
        CookieManager.setCookie("cookiesAccepted", "necessary", 365)
        CookieManager.setCookie("cookieNecessary", "true", 365)
        CookieManager.setCookie("cookieAnalytics", "false", 365)
        CookieManager.setCookie("cookieMarketing", "false", 365)
  
        // Guardar preferencias en localStorage como respaldo
        localStorage.setItem("cookiesAccepted", "necessary")
        localStorage.setItem(
          "cookiePreferences",
          JSON.stringify({
            necessary: true,
            analytics: false,
            marketing: false,
          }),
        )
  
        closePopup()
        activateCookies("necessary")
      })
  
      btnCustomize.addEventListener("click", () => {
        cookiesCustomize.style.display = "block"
        btnAcceptAll.style.display = "none"
        btnAcceptNecessary.style.display = "none"
        btnCustomize.style.display = "none"
      })
  
      btnSavePreferences.addEventListener("click", () => {
        const analyticsCookies = document.getElementById("analytics-cookies").checked
        const marketingCookies = document.getElementById("marketing-cookies").checked
  
        // Establecer cookies según las preferencias
        CookieManager.setCookie("cookiesAccepted", "custom", 365)
        CookieManager.setCookie("cookieNecessary", "true", 365)
        CookieManager.setCookie("cookieAnalytics", analyticsCookies.toString(), 365)
        CookieManager.setCookie("cookieMarketing", marketingCookies.toString(), 365)
  
        const preferences = {
          necessary: true,
          analytics: analyticsCookies,
          marketing: marketingCookies,
        }
  
        // Guardar preferencias en localStorage como respaldo
        localStorage.setItem("cookiesAccepted", "custom")
        localStorage.setItem("cookiePreferences", JSON.stringify(preferences))
  
        closePopup()
        activateCookies("custom", preferences)
      })
  
      function closePopup() {
        cookiesPopup.classList.remove("show")
        cookiesPopup.classList.add("hide")
  
        setTimeout(() => {
          cookiesPopup.remove()
        }, 500)
      }
    } else {
      // Las cookies ya han sido aceptadas, activar según las preferencias guardadas
      const cookieType = CookieManager.getCookie("cookiesAccepted") || localStorage.getItem("cookiesAccepted")
  
      if (cookieType === "all") {
        activateCookies("all")
      } else if (cookieType === "necessary") {
        activateCookies("necessary")
      } else if (cookieType === "custom") {
        const analyticsCookies =
          CookieManager.getCookie("cookieAnalytics") === "true" ||
          (localStorage.getItem("cookiePreferences") && JSON.parse(localStorage.getItem("cookiePreferences")).analytics)
        const marketingCookies =
          CookieManager.getCookie("cookieMarketing") === "true" ||
          (localStorage.getItem("cookiePreferences") && JSON.parse(localStorage.getItem("cookiePreferences")).marketing)
  
        activateCookies("custom", {
          necessary: true,
          analytics: analyticsCookies,
          marketing: marketingCookies,
        })
      }
    }
  
    // Función para activar las cookies según las preferencias
    function activateCookies(type, preferences = null) {
      console.log(`Cookies activadas: ${type}`)
  
      // Siempre activar cookies necesarias
      activateNecessaryCookies()
  
      if (type === "all") {
        activateAnalyticsCookies()
        activateMarketingCookies()
      } else if (type === "custom" && preferences) {
        if (preferences.analytics) activateAnalyticsCookies()
        if (preferences.marketing) activateMarketingCookies()
      }
    }
  
    // Funciones para activar diferentes tipos de cookies
    function activateNecessaryCookies() {
      console.log("Cookies necesarias activadas")
      // Aquí iría el código para activar cookies necesarias
      // Por ejemplo, cookies de sesión, preferencias básicas, etc.
    }
  
    function activateAnalyticsCookies() {
      console.log("Cookies analíticas activadas")
      // Aquí iría el código para activar Google Analytics u otras herramientas analíticas
      // Por ejemplo:
      // if (typeof ga === 'function') {
      //   ga('create', 'UA-XXXXX-Y', 'auto');
      //   ga('send', 'pageview');
      // }
    }
  
    function activateMarketingCookies() {
      console.log("Cookies de marketing activadas")
      // Aquí iría el código para activar cookies de marketing
      // Por ejemplo, Facebook Pixel, Google Ads, etc.
    }
  
    // Eliminamos el botón de gestión de cookies
    // No se añade el botón de gestión de cookies
  })
  