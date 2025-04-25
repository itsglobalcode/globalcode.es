document.addEventListener("DOMContentLoaded", () => {
    // Verificar si existe el terminal
    const terminal = document.getElementById("terminal-contact")
    if (!terminal) return
  
    const terminalContent = terminal.querySelector(".terminal-content")
    const terminalBody = terminal.querySelector(".terminal-body")
    const terminalForm = terminal.querySelector(".terminal-form")
  
    // Limpiar cualquier contenido existente
    terminalContent.innerHTML = ""
  
    // Pasos del formulario
    const steps = [
      { prompt: "> Ingresa tu nombre:", type: "text", name: "name" },
      { prompt: "> Ingresa tu email:", type: "email", name: "email" },
      { prompt: "> Cuéntanos sobre tu proyecto:", type: "textarea", name: "message" },
    ]
  
    let currentStep = 0
    const formData = {}
  
    // Función para añadir mensaje
    function addMessage(text, className) {
      const message = document.createElement("div")
      message.className = className || "terminal-message"
      message.textContent = text
      terminalContent.appendChild(message)
      terminalBody.scrollTop = terminalBody.scrollHeight
      return message
    }
  
    // Función para iniciar la terminal
    function bootTerminal() {
      addMessage("$ Iniciando asistente de proyectos Global Code...", "boot-message")
  
      setTimeout(() => {
        addMessage("$ Preparando propuesta personalizada...", "boot-message")
  
        setTimeout(() => {
          addMessage("$ Conectando con nuestros expertos...", "boot-message")
  
          setTimeout(() => {
            addMessage("$ Listo para transformar tu idea en realidad.", "boot-message")
  
            setTimeout(() => {
              showNextStep()
            }, 500)
          }, 500)
        }, 500)
      }, 500)
    }
  
    // Función para mostrar el siguiente paso
    function showNextStep() {
      // Verificar si hemos terminado todos los pasos
      if (currentStep >= steps.length) {
        showFinalStep()
        return
      }
  
      const step = steps[currentStep]
  
      // Crear contenedor
      const container = document.createElement("div")
      container.className = "terminal-input-container"
      container.style.display = "flex" // Asegurar que sea visible
  
      // Añadir prompt
      const prompt = document.createElement("div")
      prompt.className = "terminal-prompt"
      prompt.textContent = step.prompt
      container.appendChild(prompt)
  
      // Crear input
      const isTextarea = step.type === "textarea"
      const input = document.createElement(isTextarea ? "textarea" : "input")
      input.className = "terminal-input"
      input.type = isTextarea ? "text" : step.type
      input.name = step.name
      input.style.opacity = "1" // Hacer visible el input
  
      if (isTextarea) {
        input.rows = 3
  
        // Añadir mensaje de ayuda
        const helpText = document.createElement("div")
        helpText.className = "input-help-text"
        helpText.textContent = "Presiona Ctrl+Enter o Cmd+Enter para enviar"
        container.appendChild(helpText)
      }
  
      container.appendChild(input)
      terminalContent.appendChild(container)
  
      // Añadir el contenedor de respuesta (inicialmente oculto)
      const responseContainer = document.createElement("div")
      responseContainer.className = "terminal-response"
      responseContainer.style.display = "none"
      terminalContent.appendChild(responseContainer)
  
      // Enfocar el input
      setTimeout(() => {
        input.focus()
        terminalBody.scrollTop = terminalBody.scrollHeight
      }, 100)
  
      // Manejar envío
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          if (!isTextarea || (isTextarea && (e.ctrlKey || e.metaKey))) {
            e.preventDefault()
            const value = input.value.trim()
  
            if (!value) {
              input.classList.add("error")
              const errorMsg = addMessage(
                "$ Error: Este campo es importante para ofrecerte la mejor solución",
                "terminal-error",
              )
  
              setTimeout(() => {
                input.classList.remove("error")
                errorMsg.remove()
                input.focus()
              }, 2000)
              return
            }
  
            // Guardar el valor en formData
            formData[step.name] = value
  
            // Deshabilitar input
            input.disabled = true
            input.classList.add("completed")
  
            // Mostrar respuesta
            responseContainer.textContent = value
            responseContainer.style.display = "block"
  
            // Siguiente paso
            currentStep++
            setTimeout(showNextStep, 300)
          }
        }
      })
    }
  
    // Función para mostrar el paso final
    function showFinalStep() {
      // Crear contenedor
      const container = document.createElement("div")
      container.className = "terminal-submit"
      container.style.display = "flex" // Asegurar que sea visible
  
      // Añadir prompt
      const prompt = document.createElement("div")
      prompt.className = "terminal-prompt"
      prompt.textContent = "> ¡Excelente! ¿Listo para dar el primer paso hacia tu proyecto ideal?"
      container.appendChild(prompt)
  
      // Añadir botón
      const button = document.createElement("button")
      button.className = "submit-button"
      button.textContent = "COMENZAR MI PROYECTO"
      button.type = "button" // Cambiado a button para manejar manualmente
      container.appendChild(button)
  
      terminalContent.appendChild(container)
      terminalBody.scrollTop = terminalBody.scrollHeight
  
      // Crear contenedores para mensajes de éxito/error (inicialmente ocultos)
      const successContainer = document.createElement("div")
      successContainer.className = "terminal-success"
      successContainer.style.display = "none"
      terminalContent.appendChild(successContainer)
  
      const restartContainer = document.createElement("div")
      restartContainer.className = "terminal-restart"
      restartContainer.style.display = "none"
      terminalContent.appendChild(restartContainer)
  
      // Manejar clic en botón
      button.addEventListener("click", () => {
        button.disabled = true
        button.innerHTML = `<span class="loader"></span> Procesando...`
  
        // Crear FormData para enviar
        const formDataToSend = new FormData()
  
        // Añadir los datos recopilados
        for (const key in formData) {
          formDataToSend.append(key, formData[key])
        }
  
        // Enviar datos a Formspree
        fetch("https://formspree.io/f/myzwzepp", {
          method: "POST",
          body: formDataToSend,
          headers: {
            Accept: "application/json",
          },
        })
          .then((response) => {
            if (response.ok) {
              return response.json()
            }
            throw new Error("Error al enviar el formulario")
          })
          .then(() => {
            // Mensaje de éxito
            successContainer.textContent =
              "$ ¡Perfecto! Hemos recibido tu información. Uno de nuestros expertos se pondrá en contacto contigo en las próximas 24 horas para discutir cómo podemos hacer realidad tu proyecto."
            successContainer.style.display = "block"
  
            setTimeout(() => {
              restartContainer.textContent =
                "$ Mientras tanto, puedes explorar nuestro portafolio o revisar nuestros servicios para más inspiración."
              restartContainer.style.display = "block"
              terminalBody.scrollTop = terminalBody.scrollHeight
            }, 1000)
          })
          .catch((error) => {
            console.error("Error:", error)
            button.disabled = false
            button.textContent = "COMENZAR MI PROYECTO"
            addMessage(
              "$ Ha ocurrido un error al enviar tu información. Por favor, intenta nuevamente o contáctanos directamente a info@globalcode.com",
              "terminal-error",
            )
          })
      })
    }
  
    // Iniciar la terminal
    bootTerminal()
  })
  