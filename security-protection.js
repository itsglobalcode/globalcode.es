/**
 * Security Protection System for Global Code Website
 * Protects against code inspection, debugging, and unauthorized access
 */

;(() => {
  // Configuration
  const CONFIG = {
    enableDevToolsProtection: true,
    enableRightClickProtection: true,
    enableKeyboardProtection: true,
    enableSourceProtection: true,
    enableConsoleProtection: true,
    enableDebuggerProtection: true,
    showNotification: true,
    warningMessage: "🔒 Código protegido - Inspección no permitida",
    disableDuringAnimation: true,
    animationDuration: 4000, // 4 segundos
  }

  const animationStartTime = Date.now()
  let protectionActive = false

  // Create beautiful notification system
  function createNotificationSystem() {
    const notificationContainer = document.createElement("div")
    notificationContainer.id = "security-notifications"
    notificationContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      pointer-events: none;
    `
    document.body.appendChild(notificationContainer)
    return notificationContainer
  }

  // Detect if intro animation is running - more comprehensive detection
  function isAnimationRunning() {
    // Check time-based detection first
    const timeSinceStart = Date.now() - animationStartTime
    if (timeSinceStart < CONFIG.animationDuration) {
      return true
    }

    // Check for animation elements
    const introAnimation = document.querySelector(".intro-animation")
    const animationOverlay = document.querySelector(".animation-overlay")
    const body = document.body

    // Check if animation elements exist and are visible
    if (introAnimation && introAnimation.offsetParent !== null) {
      return true
    }

    if (animationOverlay && animationOverlay.offsetParent !== null) {
      return true
    }

    // Check body classes
    if (
      body.classList.contains("animation-running") ||
      body.classList.contains("intro-animation-active") ||
      body.style.overflow === "hidden"
    ) {
      return true
    }

    // Check if chatbot is hidden (indicator of animation)
    const chatbot = document.querySelector(".chatbot-container")
    if (chatbot && chatbot.style.display === "none") {
      return true
    }

    // Check if navbar is hidden (indicator of animation)
    const navbar = document.querySelector(".navbar")
    if (navbar && (navbar.style.opacity === "0" || navbar.style.visibility === "hidden")) {
      return true
    }

    return false
  }

  function showBeautifulNotification(message, type = "warning") {
    if (!CONFIG.showNotification) return

    // STRICT: Don't show ANY notifications during intro animation
    if (CONFIG.disableDuringAnimation && isAnimationRunning()) {
      console.log("Notification blocked during animation:", message) // For debugging
      return
    }

    // Double check - if protection isn't active yet, don't show notifications
    if (!protectionActive) {
      return
    }

    const container = document.getElementById("security-notifications") || createNotificationSystem()

    const notification = document.createElement("div")
    notification.style.cssText = `
      background: ${type === "warning" ? "linear-gradient(135deg, #ff6b6b, #ee5a24)" : "linear-gradient(135deg, #4834d4, #686de0)"};
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      margin-bottom: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 300px;
      animation: slideIn 0.3s ease-out;
      pointer-events: auto;
      cursor: pointer;
    `

    const icon = type === "warning" ? "🛡️" : "ℹ️"
    notification.innerHTML = `
      <span style="font-size: 18px;">${icon}</span>
      <span>${message}</span>
      <span style="margin-left: auto; opacity: 0.7; font-size: 12px;">×</span>
    `

    // Add animation keyframes
    if (!document.getElementById("notification-styles")) {
      const style = document.createElement("style")
      style.id = "notification-styles"
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `
      document.head.appendChild(style)
    }

    container.appendChild(notification)

    // Auto remove after 4 seconds
    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease-in"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, 4000)

    // Click to dismiss
    notification.addEventListener("click", () => {
      notification.style.animation = "slideOut 0.3s ease-in"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    })
  }

  // Anti-debugging techniques
  const devtools = {
    open: false,
    orientation: null,
  }

  // Detect DevTools
  function detectDevTools() {
    if (CONFIG.enableDevToolsProtection) {
      const threshold = 160

      setInterval(() => {
        // Don't detect during animation
        if (CONFIG.disableDuringAnimation && isAnimationRunning()) {
          return
        }

        if (window.outerHeight - window.innerHeight > threshold || window.outerWidth - window.innerWidth > threshold) {
          if (!devtools.open) {
            devtools.open = true
            handleSecurityViolation("DevTools detectadas")
          }
        } else {
          devtools.open = false
        }
      }, 500)

      // Alternative detection method
      const devtools_check = () => {
        // Don't detect during animation
        if (CONFIG.disableDuringAnimation && isAnimationRunning()) {
          return
        }

        const before = new Date()
        debugger
        const after = new Date()
        if (after - before > 100) {
          handleSecurityViolation("Debugger detectado")
        }
      }

      setInterval(devtools_check, 1000)
    }
  }

  // Console protection
  function protectConsole() {
    if (CONFIG.enableConsoleProtection) {
      // Override console methods
      console.log =
        console.warn =
        console.error =
        console.info =
        console.debug =
          () => {
            // Don't trigger during animation
            if (CONFIG.disableDuringAnimation && isAnimationRunning()) {
              return
            }
            handleSecurityViolation("Intento de uso de consola")
          }

      // Detect console opening
      const devtools_detect = () => {
        // Don't detect during animation
        if (CONFIG.disableDuringAnimation && isAnimationRunning()) {
          return
        }

        const before = performance.now()
        console.clear()
        const after = performance.now()
        if (after - before > 1) {
          handleSecurityViolation("Consola abierta")
        }
      }

      setInterval(devtools_detect, 1000)
    }
  }

  // Keyboard protection
  function protectKeyboard() {
    if (CONFIG.enableKeyboardProtection) {
      document.addEventListener("keydown", (e) => {
        // Don't protect during animation
        if (CONFIG.disableDuringAnimation && isAnimationRunning()) {
          return
        }

        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
        if (
          e.keyCode === 123 ||
          (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
          (e.ctrlKey && e.keyCode === 85) ||
          (e.ctrlKey && e.shiftKey && e.keyCode === 67)
        ) {
          e.preventDefault()
          e.stopPropagation()
          handleSecurityViolation("Tecla de inspección bloqueada")
          return false
        }
      })
    }
  }

  // Smart right-click protection (blocks inspect even in form fields)
  function protectRightClick() {
    if (CONFIG.enableRightClickProtection) {
      document.addEventListener("contextmenu", (e) => {
        // Don't protect during animation
        if (CONFIG.disableDuringAnimation && isAnimationRunning()) {
          return
        }

        // Check if it's a chatbot or contact form field
        const isChatbotField =
          e.target.closest(".chatbot-container") ||
          e.target.closest(".chatbot-input") ||
          e.target.id === "chatbot-input"

        const isContactField =
          e.target.closest(".terminal-form") ||
          e.target.closest(".terminal-input") ||
          e.target.closest("#terminal-contact")

        // Block right-click completely on chatbot and contact form fields
        if (isChatbotField || isContactField) {
          e.preventDefault()
          handleSecurityViolation("Inspección en formularios bloqueada")
          return false
        }

        // Allow right-click on other text inputs and textareas for copy/paste
        const allowedElements = ["INPUT", "TEXTAREA"]
        const isTextSelected = window.getSelection().toString().length > 0

        if (allowedElements.includes(e.target.tagName) || isTextSelected) {
          // Allow context menu for text operations on non-protected fields
          return true
        }

        // Block context menu for everything else (prevents inspect element)
        e.preventDefault()
        handleSecurityViolation("Inspección por click derecho bloqueada")
        return false
      })

      // Protect against drag and drop of images/elements (but allow text)
      document.addEventListener("dragstart", (e) => {
        // Don't protect during animation
        if (CONFIG.disableDuringAnimation && isAnimationRunning()) {
          return
        }

        if (e.target.tagName === "IMG" || e.target.tagName === "VIDEO") {
          e.preventDefault()
          return false
        }
      })
    }
  }

  // Source code protection
  function protectSource() {
    if (CONFIG.enableSourceProtection) {
      // More restrictive text selection for chatbot and contact forms
      document.addEventListener("selectstart", (e) => {
        // Don't protect during animation
        if (CONFIG.disableDuringAnimation && isAnimationRunning()) {
          return
        }

        const isChatbotField =
          e.target.closest(".chatbot-container") ||
          e.target.closest(".chatbot-input") ||
          e.target.id === "chatbot-input"

        const isContactField =
          e.target.closest(".terminal-form") ||
          e.target.closest(".terminal-input") ||
          e.target.closest("#terminal-contact")

        // Block selection in chatbot and contact form areas completely
        if (isChatbotField || isContactField) {
          e.preventDefault()
          return false
        }

        // Block selection for images and videos
        if (e.target.tagName === "IMG" || e.target.tagName === "VIDEO") {
          e.preventDefault()
          return false
        }
      })

      // Disable print
      window.addEventListener("beforeprint", (e) => {
        // Don't protect during animation
        if (CONFIG.disableDuringAnimation && isAnimationRunning()) {
          return
        }

        e.preventDefault()
        handleSecurityViolation("Impresión bloqueada")
        return false
      })

      // Protect against view source
      if (window.location.href.includes("view-source:")) {
        handleSecurityViolation("View source detectado")
      }
    }
  }

  // Advanced anti-debugging
  function advancedProtection() {
    // Detect debugging tools
    const check = () => {
      // Don't detect during animation
      if (CONFIG.disableDuringAnimation && isAnimationRunning()) {
        return
      }

      function detectDebugger() {
        const start = performance.now()
        debugger
        const end = performance.now()
        if (end - start > 100) {
          handleSecurityViolation("Debugger avanzado detectado")
        }
      }

      detectDebugger()
    }

    setInterval(check, 1000)

    // Detect if running in iframe
    if (window.self !== window.top) {
      // Don't trigger during animation
      setTimeout(() => {
        if (!isAnimationRunning()) {
          handleSecurityViolation("Iframe detectado")
        }
      }, CONFIG.animationDuration + 1000)
    }

    // Detect automation tools
    if (navigator.webdriver) {
      // Don't trigger during animation
      setTimeout(() => {
        if (!isAnimationRunning()) {
          handleSecurityViolation("Automatización detectada")
        }
      }, CONFIG.animationDuration + 1000)
    }

    // Monitor DOM changes for injection attempts
    const observer = new MutationObserver((mutations) => {
      // Don't monitor during animation
      if (CONFIG.disableDuringAnimation && isAnimationRunning()) {
        return
      }

      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              // Element node
              if (node.tagName === "SCRIPT" && !node.src.includes(window.location.hostname)) {
                handleSecurityViolation("Script injection detectado")
              }
            }
          })
        }
      })
    })

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
    }
  }

  // Handle security violations (no redirect, just notification)
  function handleSecurityViolation(reason) {
    // NEVER show notifications during animation
    if (CONFIG.disableDuringAnimation && isAnimationRunning()) {
      return
    }

    // Show beautiful notification instead of alert
    showBeautifulNotification(CONFIG.warningMessage, "warning")

    // Log the violation (you can send this to your server)
    const violation = {
      reason: reason,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer,
    }

    // Optional: Send to server for logging
    // fetch('/api/security-log', { method: 'POST', body: JSON.stringify(violation) })

    // Clear console to hide any debug info
    setTimeout(() => {
      console.clear()
    }, 100)
  }

  // Disable common inspection methods
  function disableInspection() {
    // Override toString methods
    Function.prototype.toString = () => "function() { [native code] }"

    // Disable eval
    window.eval = () => {
      // Don't trigger during animation
      if (CONFIG.disableDuringAnimation && isAnimationRunning()) {
        return
      }
      handleSecurityViolation("Eval detectado")
    }

    // Override setTimeout and setInterval to detect debugging
    const originalSetTimeout = window.setTimeout
    const originalSetInterval = window.setInterval

    window.setTimeout = function (func, delay) {
      if (typeof func === "string") {
        // Don't trigger during animation
        if (CONFIG.disableDuringAnimation && isAnimationRunning()) {
          return originalSetTimeout.apply(this, arguments)
        }
        handleSecurityViolation("setTimeout con string detectado")
        return
      }
      return originalSetTimeout.apply(this, arguments)
    }

    window.setInterval = function (func, delay) {
      if (typeof func === "string") {
        // Don't trigger during animation
        if (CONFIG.disableDuringAnimation && isAnimationRunning()) {
          return originalSetInterval.apply(this, arguments)
        }
        handleSecurityViolation("setInterval con string detectado")
        return
      }
      return originalSetInterval.apply(this, arguments)
    }
  }

  // Network request monitoring
  function monitorNetworkRequests() {
    // Override fetch
    const originalFetch = window.fetch
    window.fetch = function (...args) {
      const url = args[0]
      if (typeof url === "string" && !url.includes(window.location.hostname)) {
        // External request detected - just log, don't block
        console.log("External request:", url)
      }
      return originalFetch.apply(this, arguments)
    }
  }

  // Activate protection after animation
  function activateProtection() {
    // Wait for animation to finish
    setTimeout(() => {
      protectionActive = true
      console.log("Security protection activated")
    }, CONFIG.animationDuration)
  }

  // Initialize protection
  function initProtection() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        startProtection()
      })
    } else {
      startProtection()
    }
  }

  function startProtection() {
    try {
      // Start all protection systems but they won't trigger notifications during animation
      detectDevTools()
      protectConsole()
      protectKeyboard()
      protectRightClick()
      protectSource()
      advancedProtection()
      disableInspection()
      monitorNetworkRequests()

      // Activate protection after animation
      activateProtection()

      // Additional protection layers
      setInterval(() => {
        // Don't monitor during animation
        if (CONFIG.disableDuringAnimation && isAnimationRunning()) {
          return
        }

        // Continuous monitoring
        if (window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200) {
          handleSecurityViolation("Ventana de desarrollo detectada")
        }
      }, 2000)
    } catch (error) {
      // Silently handle errors to avoid revealing protection methods
    }
  }

  // Start protection immediately
  initProtection()

  // Additional protection against tampering
  Object.freeze(CONFIG)

  // Hide this script from inspection
  if (document.currentScript) {
    document.currentScript.remove()
  }
})()

// Additional obfuscation layer
;(() => {
  // Create fake functions to confuse reverse engineering
  window.fakeFunction1 = () => Math.random()
  window.fakeFunction2 = () => new Date()
  window.fakeFunction3 = () => navigator.userAgent

  // Create fake variables
  window.fakeVar1 = "fake_data_" + Math.random()
  window.fakeVar2 = { fake: true, data: Math.random() }
  window.fakeVar3 = [1, 2, 3, Math.random()]
})()
