document.addEventListener("DOMContentLoaded", () => {
  // Añadir detección de tema al inicio del script, justo después de "document.addEventListener("DOMContentLoaded", () => {"
  // Crear el contenedor del chatbot si no existe
  if (!document.querySelector(".chatbot-container")) {
    // Detectar preferencia de tema del usuario de manera segura
    try {
      const prefersDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      if (document.documentElement) {
        document.documentElement.setAttribute("data-theme", prefersDarkMode ? "dark" : "light")
      }
    } catch (error) {
      console.log("Error al detectar preferencia de tema:", error)
    }

    // Escuchar cambios en la preferencia de tema de manera segura
    try {
      const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      if (darkModeMediaQuery.addEventListener) {
        darkModeMediaQuery.addEventListener("change", (event) => {
          if (document.documentElement) {
            document.documentElement.setAttribute("data-theme", event.matches ? "dark" : "light")
          }
        })
      }
    } catch (error) {
      console.log("Error al configurar listener de tema:", error)
    }

    const chatbotContainer = document.createElement("div")
    chatbotContainer.className = "chatbot-container"

    // HTML para el botón y panel del chatbot
    chatbotContainer.innerHTML = `
      <button class="chatbot-button" id="chatbot-toggle">
        <i class="fas fa-comment"></i>
      </button>
      <div class="chatbot-panel" style="display: none;">
        <div class="chatbot-header">
          <div class="chatbot-title">
            <img src="ChatGPT Image Apr 24, 2025 at 08_55_23 PM.png" alt="Global Code Logo" class="chatbot-logo">
            <span>Asistente Global Code</span>
          </div>
          <button class="chatbot-close" id="chatbot-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="chatbot-messages" id="chatbot-messages">
          <div class="chatbot-message assistant">
            ¡Hola! Soy el asistente virtual de Global Code. Puedo ayudarte con información sobre nuestros servicios, precios, metodología de trabajo y más. ¿En qué puedo ayudarte hoy?
          </div>
        </div>
        <div class="chatbot-input-container">
          <textarea class="chatbot-input" id="chatbot-input" placeholder="Escribe tu mensaje..." rows="1"></textarea>
          <button class="chatbot-send" id="chatbot-send">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    `

    // Añadir el chatbot al body
    document.body.appendChild(chatbotContainer)

    // Referencias a elementos del chatbot
    const chatbotToggle = document.getElementById("chatbot-toggle")
    const chatbotClose = document.getElementById("chatbot-close")
    const chatbotPanel = document.querySelector(".chatbot-panel")
    const chatbotInput = document.getElementById("chatbot-input")
    const chatbotSend = document.getElementById("chatbot-send")
    const chatbotMessages = document.getElementById("chatbot-messages")

    // Store conversation history
    const conversationHistory = [
      {
        role: "system",
        content: `Eres un asistente virtual de Global Code, una empresa de desarrollo de software. 
        Eres amable, profesional y conciso. Ayudas a los usuarios con información sobre servicios, 
        proyectos y consultas generales. Si no sabes algo, indícalo honestamente y ofrece alternativas de contacto.
        
        Información sobre Global Code:
        - Servicios: Desarrollo Web, Web Apps, Apps Móviles, Automatizaciones con IA
        - Ubicación: Barcelona, España
        - Contacto: itsglobalcodeinfo@gmail.com, +34 628 38 32 04
        - Tecnologías: React, Angular, Vue.js, Node.js, Python, React Native, Flutter, AWS, Google Cloud
        - Proceso de desarrollo: Metodologías ágiles, desarrollo iterativo, comunicación constante
        - Precios: Varían según el proyecto, pero una app básica comienza desde 15.000€, sitios web desde 3.000€
        - Tiempo de desarrollo: 2-3 meses para proyectos básicos, 4-6 meses para proyectos complejos
        
        Responde en español y sé útil, amable y profesional.`,
      },
      {
        role: "assistant",
        content:
          "¡Hola! Soy el asistente virtual de Global Code. Puedo ayudarte con información sobre nuestros servicios, precios, metodología de trabajo y más. ¿En qué puedo ayudarte hoy?",
      },
    ]

    // Event listeners
    chatbotToggle.addEventListener("click", () => {
      chatbotPanel.style.display = "flex" // Cambio de block a flex para mantener la estructura
      chatbotInput.focus()
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight

      // Ocultar el botón cuando el panel está visible
      chatbotToggle.style.display = "none"

      // En móviles, añadir clase al body para prevenir scroll
      if (window.innerWidth <= 576) {
        document.body.style.overflow = "hidden"
      }
    })

    chatbotClose.addEventListener("click", () => {
      chatbotPanel.style.display = "none"

      // Mostrar el botón cuando el panel está oculto
      chatbotToggle.style.display = "flex"

      // Restaurar scroll
      document.body.style.overflow = "auto"
    })

    chatbotSend.addEventListener("click", sendMessage)

    chatbotInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault() // Evitar el salto de línea por defecto
        sendMessage()
      }
    })

    // Adjust the height of the textarea dynamically when the user types
    chatbotInput.addEventListener("input", () => {
      chatbotInput.style.height = "auto"
      chatbotInput.style.height = Math.min(chatbotInput.scrollHeight, 100) + "px"
    })

    // Prevent zoom on focus for mobile devices
    chatbotInput.addEventListener("focus", () => {
      // Add a class to the body to help with styling
      document.body.classList.add("chatbot-focused")

      // On iOS, scroll the panel into view
      setTimeout(() => {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight
      }, 300)

      // Detectar si es un dispositivo móvil
      if (window.innerWidth <= 768) {
        // Ajustar la altura del panel cuando se abre el teclado
        chatbotPanel.style.height = "50vh"
        chatbotMessages.style.maxHeight = "30vh"
      }
    })

    chatbotInput.addEventListener("blur", () => {
      document.body.classList.remove("chatbot-focused")

      // Restaurar altura normal cuando se cierra el teclado
      if (window.innerWidth <= 768) {
        chatbotPanel.style.height = "70vh"
        chatbotMessages.style.maxHeight = "50vh"
      }
    })

    // Handle window resize and keyboard appearance on mobile
    window.addEventListener("resize", () => {
      if (chatbotPanel.style.display !== "none") {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight

        // Adjust for mobile keyboard
        if (window.innerWidth <= 768) {
          // Check if keyboard is likely open (significant height reduction)
          const isKeyboardOpen = window.innerHeight < window.outerHeight * 0.75

          if (isKeyboardOpen) {
            chatbotPanel.style.height = "50vh" // Reduce height when keyboard is open
            chatbotMessages.style.maxHeight = "30vh"
            document.body.classList.add("chatbot-focused")
          } else {
            chatbotPanel.style.height = "70vh" // Normal height
            chatbotMessages.style.maxHeight = "50vh"
            document.body.classList.remove("chatbot-focused")
          }

          document.body.style.overflow = "hidden"
        } else {
          document.body.style.overflow = "auto"
          chatbotPanel.style.height = ""
          chatbotMessages.style.maxHeight = ""
        }
      }
    })

    // Base de conocimiento para el chatbot
    const knowledgeBase = {
      // Información General sobre la Empresa
      general: {
        keywords: [
          "empresa",
          "ubicación",
          "contacto",
          "horario",
          "quiénes",
          "quién",
          "donde",
          "dónde",
          "cuando",
          "cuándo",
          "ubicados",
          "dirección",
          "teléfono",
          "email",
          "correo",
          "información",
          "info",
          "acerca",
          "sobre",
          "ustedes",
          "vosotros",
          "global code",
          "globalcode",
        ],
        responses: [
          {
            question: ["servicios", "ofrecen", "hacen", "realizan", "desarrollan", "qué hacen", "a qué se dedican"],
            answer:
              "En Global Code ofrecemos servicios de desarrollo web, aplicaciones móviles, web apps y automatizaciones con IA. Nuestro enfoque es crear soluciones tecnológicas a medida que impulsen tu negocio.",
          },
          {
            question: ["ubicados", "ubicación", "dirección", "donde", "dónde", "oficina", "sede", "encuentran"],
            answer:
              "Nuestra oficina principal está ubicada en Barcelona, España. También trabajamos de forma remota con clientes de todo el mundo.",
          },
          {
            question: ["contacto", "contactar", "comunicar", "teléfono", "email", "correo", "llamar", "escribir"],
            answer:
              "Puedes contactarnos por email a itsglobalcodeinfo@gmail.com, por teléfono al +34 628 38 32 04, o completando el formulario de contacto en nuestra web. También puedes agendar una reunión directamente desde nuestra página principal.",
          },
          {
            question: ["horario", "atención", "disponibles", "atienden", "cuando", "cuándo", "horas"],
            answer:
              "Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00 (hora de España). Sin embargo, nuestro equipo de soporte está disponible 24/7 para emergencias técnicas.",
          },
          {
            question: [
              "casos",
              "éxito",
              "portafolio",
              "portfolio",
              "proyectos",
              "clientes",
              "trabajos",
              "realizados",
              "ejemplos",
            ],
            answer:
              "Contamos con más de 50 proyectos exitosos en diversos sectores como fintech, e-commerce, salud y educación. Algunos de nuestros casos de éxito incluyen aplicaciones con millones de usuarios y plataformas que han transformado industrias enteras. Podemos compartir ejemplos específicos en una reunión personalizada.",
          },
          {
            question: ["quiénes son", "historia", "fundación", "fundadores", "equipo", "staff", "personal"],
            answer:
              "Global Code es una empresa de desarrollo de software fundada por expertos en tecnología con más de 10 años de experiencia en el sector. Nuestro equipo está formado por desarrolladores, diseñadores UX/UI, project managers y especialistas en IA, todos comprometidos con la excelencia técnica y la satisfacción del cliente.",
          },
          {
            question: ["valores", "misión", "visión", "filosofía", "cultura", "principios"],
            answer:
              "Nuestra misión es democratizar el acceso a tecnología de calidad para empresas de todos los tamaños. Nos guiamos por valores como la transparencia, la innovación continua, la excelencia técnica y el compromiso con el éxito de nuestros clientes. Creemos en construir relaciones a largo plazo basadas en la confianza y resultados tangibles.",
          },
        ],
        fallback:
          "Global Code es una empresa de desarrollo de software de nueva generación fundada por expertos apasionados por la tecnología y la innovación. ¿Te gustaría conocer algo específico sobre nosotros?",
      },

      // Servicios de Desarrollo
      servicios: {
        keywords: [
          "servicios",
          "desarrollo",
          "aplicaciones",
          "apps",
          "web",
          "móvil",
          "móviles",
          "software",
          "tecnologías",
          "tecnología",
          "desarrollan",
          "crean",
          "hacen",
          "ofrecen",
          "programación",
          "soluciones",
          "productos",
        ],
        responses: [
          {
            question: [
              "aplicaciones",
              "móviles",
              "móvil",
              "apps",
              "android",
              "ios",
              "celular",
              "smartphone",
              "teléfono",
            ],
            answer:
              "Desarrollamos aplicaciones móviles nativas y multiplataforma para iOS y Android. Utilizamos tecnologías como React Native, Flutter, Swift y Kotlin para crear experiencias móviles de alta calidad con interfaces intuitivas y alto rendimiento. Nuestras apps incluyen funcionalidades como geolocalización, notificaciones push, pagos in-app, y sincronización offline.",
          },
          {
            question: ["web", "página", "sitio", "website", "landing", "ecommerce", "tienda", "online"],
            answer:
              "Desarrollamos todo tipo de soluciones web, desde sitios corporativos y landing pages hasta complejas aplicaciones web y plataformas SaaS. Utilizamos las últimas tecnologías como React, Angular, Vue.js y Next.js para crear experiencias web modernas, responsivas y optimizadas para SEO. También implementamos sistemas de gestión de contenidos personalizados y tiendas online con pasarelas de pago seguras.",
          },
          {
            question: ["escritorio", "desktop", "windows", "mac", "linux", "aplicación local"],
            answer:
              "Desarrollamos aplicaciones de escritorio para Windows, macOS y Linux utilizando tecnologías como Electron, .NET y Java. Estas soluciones son ideales para software que requiere acceso profundo al sistema, procesamiento intensivo o funcionamiento sin conexión a internet. Ejemplos incluyen herramientas de productividad, software de gestión empresarial y aplicaciones de edición multimedia.",
          },
          {
            question: [
              "react",
              "angular",
              "vue",
              "next",
              "node",
              "javascript",
              "typescript",
              "python",
              "java",
              "swift",
              "kotlin",
              "flutter",
              "tecnologías",
              "stack",
              "lenguajes",
            ],
            answer:
              "Trabajamos con un amplio stack tecnológico que incluye React, Angular, Vue.js, Next.js para frontend; Node.js, Python, Java y .NET para backend; React Native, Flutter, Swift y Kotlin para desarrollo móvil; y AWS, Google Cloud y Azure para infraestructura cloud. Seleccionamos las tecnologías más adecuadas para cada proyecto según sus requisitos específicos, siempre priorizando soluciones robustas, escalables y mantenibles.",
          },
          {
            question: ["medida", "personalizado", "custom", "específico", "particular", "adaptado", "único"],
            answer:
              "Nos especializamos en desarrollo de software a medida. Creamos soluciones personalizadas que se adaptan perfectamente a las necesidades específicas de tu negocio, en lugar de utilizar plantillas o soluciones genéricas. Esto garantiza que obtengas exactamente lo que necesitas, con flujos de trabajo optimizados para tu operativa y una ventaja competitiva única en tu sector.",
          },
          {
            question: ["mantenimiento", "soporte", "actualización", "mejoras", "evolución", "después", "post"],
            answer:
              "Ofrecemos servicios completos de mantenimiento y soporte post-lanzamiento. Esto incluye corrección de errores, actualizaciones de seguridad, mejoras de rendimiento y la implementación de nuevas funcionalidades para mantener tu software siempre actualizado y funcionando de manera óptima. Nuestros planes de mantenimiento incluyen monitorización 24/7, copias de seguridad regulares y tiempos de respuesta garantizados.",
          },
          {
            question: ["inteligencia artificial", "ia", "ai", "machine learning", "ml", "automatización", "chatbot"],
            answer:
              "Implementamos soluciones de inteligencia artificial y machine learning para automatizar procesos, extraer insights de datos y mejorar la experiencia de usuario. Esto incluye chatbots inteligentes, sistemas de recomendación, análisis predictivo, procesamiento de lenguaje natural y visión por computadora. Nuestras soluciones de IA se integran perfectamente con tus sistemas existentes para maximizar su valor.",
          },
          {
            question: ["ecommerce", "tienda online", "comercio electrónico", "shop", "venta online", "marketplace"],
            answer:
              "Desarrollamos plataformas de ecommerce personalizadas y escalables que impulsan las ventas online. Nuestras soluciones incluyen catálogos de productos, carritos de compra, pasarelas de pago seguras, gestión de inventario, programas de fidelización, y análisis avanzado de ventas. Trabajamos con tecnologías como WooCommerce, Shopify, Magento o soluciones completamente a medida según tus necesidades.",
          },
          {
            question: ["cms", "gestor de contenidos", "wordpress", "drupal", "joomla", "blog", "noticias"],
            answer:
              "Creamos sistemas de gestión de contenidos (CMS) personalizados que facilitan la actualización y mantenimiento de tu web sin conocimientos técnicos. También implementamos y personalizamos plataformas como WordPress, optimizándolas para rendimiento, seguridad y SEO. Nuestras soluciones CMS incluyen editores visuales intuitivos, gestión de usuarios y flujos de aprobación de contenidos.",
          },
        ],
        fallback:
          "Ofrecemos servicios completos de desarrollo de software, incluyendo aplicaciones web, móviles, sistemas empresariales y soluciones de IA. Nuestro enfoque es crear tecnología a medida que resuelva problemas reales de negocio y proporcione una ventaja competitiva a nuestros clientes. ¿Hay algún servicio específico sobre el que te gustaría saber más?",
      },

      // Procesos y Metodología
      procesos: {
        keywords: [
          "proceso",
          "metodología",
          "tiempo",
          "duración",
          "etapas",
          "fases",
          "desarrollo",
          "scrum",
          "agile",
          "ágil",
          "cambios",
          "requisitos",
          "proyecto",
          "gestión",
          "administración",
          "planificación",
          "método",
          "trabajo",
        ],
        responses: [
          {
            question: ["proceso", "desarrollo", "etapas", "fases", "pasos", "cómo", "funciona", "trabajan"],
            answer:
              "Nuestro proceso de desarrollo sigue estas etapas: 1) Descubrimiento y análisis de requisitos, 2) Diseño de UX/UI, 3) Desarrollo iterativo, 4) Pruebas y control de calidad, 5) Despliegue, y 6) Soporte post-lanzamiento. Mantenemos una comunicación constante durante todo el proceso, con demostraciones regulares para recoger feedback y asegurar que el producto final cumple exactamente con tus expectativas.",
          },
          {
            question: [
              "tiempo",
              "duración",
              "plazo",
              "cuánto",
              "tarda",
              "demora",
              "entrega",
              "finalización",
              "termina",
            ],
            answer:
              "La duración de un proyecto depende de su complejidad y alcance. Típicamente, una aplicación móvil o web básica puede tomar entre 2-3 meses, mientras que proyectos más complejos pueden requerir 4-6 meses o más. Trabajamos con sprints de 2 semanas, lo que permite entregas incrementales y la posibilidad de lanzar versiones funcionales antes de la finalización completa del proyecto.",
          },
          {
            question: ["metodología", "scrum", "agile", "ágil", "kanban", "waterfall", "cascada", "método", "enfoque"],
            answer:
              "Utilizamos metodologías ágiles como Scrum y Kanban, adaptadas a las necesidades específicas de cada proyecto. Esto nos permite entregar valor de forma incremental, adaptarnos rápidamente a los cambios y mantener una alta calidad en el desarrollo. Nuestros sprints de 2 semanas incluyen planificación, desarrollo, pruebas, demostración y retrospectiva, asegurando un proceso de mejora continua.",
          },
          {
            question: [
              "cambios",
              "requisitos",
              "modificaciones",
              "ajustes",
              "alteraciones",
              "variaciones",
              "scope",
              "alcance",
            ],
            answer:
              "Entendemos que los requisitos pueden evolucionar durante el desarrollo. Nuestra metodología ágil nos permite adaptarnos a estos cambios. Gestionamos las modificaciones a través de un proceso estructurado que evalúa el impacto en tiempo y costos, asegurando transparencia y flexibilidad. Los cambios se priorizan y se incorporan en los siguientes sprints según su importancia y urgencia.",
          },
          {
            question: [
              "comunicación",
              "updates",
              "actualizaciones",
              "informes",
              "reportes",
              "avances",
              "progreso",
              "seguimiento",
            ],
            answer:
              "Mantenemos una comunicación constante a través de reuniones semanales, informes de progreso y una plataforma de gestión de proyectos donde puedes seguir el avance en tiempo real. Utilizamos herramientas como Jira, Trello o ClickUp para la gestión de tareas, y Slack o Microsoft Teams para comunicación diaria. Además, realizamos demostraciones al final de cada sprint para mostrar los avances tangibles.",
          },
          {
            question: ["equipo", "desarrolladores", "personas", "trabajan", "asignan", "dedicado", "exclusivo"],
            answer:
              "Asignamos equipos multidisciplinarios a cada proyecto, que pueden incluir desarrolladores frontend y backend, diseñadores UX/UI, QA testers, DevOps y un Project Manager dedicado. El tamaño del equipo varía según la complejidad del proyecto, pero siempre aseguramos la continuidad del personal clave durante todo el desarrollo para mantener el conocimiento y la visión del proyecto.",
          },
          {
            question: ["participación", "cliente", "involucración", "feedback", "opinión", "colaboración", "input"],
            answer:
              "Tu participación es fundamental para el éxito del proyecto. Te involucramos en todas las etapas clave: definición de requisitos, revisión de diseños, pruebas de usuario y aprobación de entregables. Valoramos tu feedback y conocimiento del negocio, que nos ayuda a crear un producto que realmente satisfaga tus necesidades. El nivel de involucración puede adaptarse a tu disponibilidad y preferencias.",
          },
          {
            question: ["documentación", "entregables", "manuales", "guías", "especificaciones", "técnica"],
            answer:
              "Proporcionamos documentación completa de todos los aspectos del proyecto, incluyendo especificaciones técnicas, manuales de usuario, guías de administración y documentación del código. Esto facilita el mantenimiento futuro y el onboarding de nuevos miembros del equipo. Toda la documentación se mantiene actualizada durante el desarrollo y se entrega en formatos accesibles al finalizar el proyecto.",
          },
        ],
        fallback:
          "Utilizamos metodologías ágiles para el desarrollo de nuestros proyectos, lo que nos permite ser flexibles y entregar valor de forma incremental. Nuestro proceso está diseñado para maximizar la transparencia, la calidad y la satisfacción del cliente. ¿Te gustaría conocer algún aspecto específico de nuestro proceso?",
      },

      // Precios y Presupuestos
      precios: {
        keywords: [
          "precio",
          "costo",
          "coste",
          "presupuesto",
          "inversión",
          "valor",
          "cuánto",
          "cuanto",
          "cuesta",
          "cobran",
          "tarifa",
          "pago",
          "dinero",
          "económico",
          "barato",
          "caro",
          "euros",
          "dólares",
          "€",
          "$",
        ],
        responses: [
          {
            question: [
              "cuánto",
              "cuanto",
              "cuesta",
              "precio",
              "costo",
              "coste",
              "valor",
              "app",
              "aplicación",
              "móvil",
              "web",
              "desarrollo",
            ],
            answer:
              "El costo de desarrollo varía según la complejidad, funcionalidades y plataformas. Una aplicación web básica puede comenzar desde 3.000€, una web corporativa profesional desde 5.000€, y aplicaciones móviles desde 15.000€. Proyectos más complejos como plataformas SaaS o sistemas empresariales pueden requerir inversiones desde 25.000€. Ofrecemos presupuestos personalizados basados en tus requisitos específicos.",
          },
          {
            question: [
              "presupuesto",
              "personalizado",
              "cotización",
              "estimación",
              "aproximado",
              "rango",
              "dan",
              "ofrecen",
              "hacen",
            ],
            answer:
              "Sí, ofrecemos presupuestos totalmente personalizados. Después de una reunión inicial para entender tus necesidades, te proporcionamos una estimación detallada que incluye desglose de costos, cronograma y entregables. Este presupuesto es sin compromiso y totalmente gratuito. Para proyectos complejos, podemos realizar un Discovery Workshop pagado que profundiza en los requisitos y reduce la incertidumbre.",
          },
          {
            question: ["hora", "proyecto", "cobran", "facturan", "pagan", "modalidad", "forma", "tipo", "pago"],
            answer:
              "Ofrecemos dos modalidades: precio cerrado por proyecto (recomendado para alcances bien definidos) y facturación por horas o sprints (ideal para proyectos que requieren mayor flexibilidad). Nuestras tarifas por hora varían entre 50-80€ dependiendo de los perfiles necesarios. En ambos casos, establecemos entregables claros y un proceso de aprobación transparente.",
          },
          {
            question: ["paquetes", "planes", "precios", "tarifas", "opciones", "alternativas", "diferentes", "varios"],
            answer:
              "Contamos con diferentes planes según las necesidades de tu proyecto. Nuestro plan 'Startup' para MVPs comienza desde 15.000€, el plan 'Business' para aplicaciones completas desde 25.000€, y soluciones 'Enterprise' desde 40.000€. También ofrecemos planes de mantenimiento mensual desde 500€ para soporte continuo post-lanzamiento, que incluyen horas de desarrollo, monitorización y soporte técnico.",
          },
          {
            question: [
              "pago",
              "forma",
              "método",
              "manera",
              "abono",
              "facturación",
              "factura",
              "plazos",
              "adelanto",
              "inicial",
            ],
            answer:
              "Nuestra estructura de pago típica incluye un 30% inicial para comenzar el proyecto, pagos intermedios del 30% al alcanzar hitos específicos, y un pago final del 40% a la entrega. Para proyectos largos, establecemos pagos mensuales o por sprint completado. Aceptamos transferencias bancarias, tarjetas de crédito y, en algunos casos, podemos establecer planes de financiación a 6-12 meses.",
          },
          {
            question: ["barato", "económico", "asequible", "accesible", "low cost", "bajo costo", "reducir", "ajustar"],
            answer:
              "Entendemos las limitaciones presupuestarias y podemos adaptar nuestras propuestas a diferentes niveles de inversión. Algunas estrategias para reducir costos incluyen: desarrollar un MVP con funcionalidades esenciales, implementar el proyecto en fases, utilizar componentes pre-construidos cuando sea posible, o considerar tecnologías open source. Siempre mantenemos un equilibrio entre costo, calidad y tiempo de desarrollo.",
          },
          {
            question: ["roi", "retorno", "inversión", "beneficio", "rentabilidad", "ganancias", "valor", "negocio"],
            answer:
              "Nos enfocamos en desarrollar soluciones que generen un ROI positivo para tu negocio. Esto puede manifestarse como aumento de ventas, reducción de costos operativos, mejora en la retención de clientes o acceso a nuevos mercados. Durante la fase de planificación, identificamos los KPIs relevantes para tu proyecto y diseñamos la solución para maximizar estos indicadores. Muchos de nuestros clientes recuperan su inversión en 6-12 meses.",
          },
        ],
        fallback:
          "Nuestros precios varían según las necesidades específicas de cada proyecto. Una aplicación web básica puede comenzar desde 3.000€, mientras que aplicaciones móviles desde 15.000€. Ofrecemos presupuestos personalizados después de entender en detalle tus requerimientos. ¿Te gustaría agendar una reunión para discutir tu proyecto y recibir una cotización?",
      },

      // Seguridad y Propiedad
      seguridad: {
        keywords: [
          "seguridad",
          "privacidad",
          "datos",
          "propiedad",
          "código",
          "fuente",
          "intelectual",
          "confidencialidad",
          "nda",
          "contrato",
          "legal",
          "derechos",
          "protección",
          "dueño",
          "propietario",
          "hackeo",
          "vulnerabilidad",
        ],
        responses: [
          {
            question: [
              "dueño",
              "propietario",
              "propiedad",
              "código",
              "fuente",
              "pertenece",
              "quién",
              "quien",
              "derechos",
            ],
            answer:
              "Tú eres el propietario completo del código fuente y todos los activos desarrollados. Una vez finalizado el proyecto y completados los pagos, transferimos todos los derechos de propiedad intelectual a tu nombre o empresa, incluyendo el código fuente, diseños y documentación. Esto te da libertad para modificar, extender o migrar el software en el futuro, ya sea con nosotros o con otro proveedor.",
          },
          {
            question: [
              "privacidad",
              "datos",
              "información",
              "personal",
              "usuarios",
              "clientes",
              "manejan",
              "tratan",
              "protegen",
              "gdpr",
              "rgpd",
              "lopd",
            ],
            answer:
              "Cumplimos estrictamente con el RGPD/GDPR y otras regulaciones de protección de datos. Implementamos medidas técnicas y organizativas para garantizar la seguridad de la información, incluyendo encriptación de datos sensibles, acceso restringido, auditorías regulares y políticas de retención de datos. Todos nuestros desarrollos incorporan privacy by design y privacy by default, con consentimientos explícitos y gestión transparente de datos personales.",
          },
          {
            question: [
              "nda",
              "confidencialidad",
              "secreto",
              "acuerdo",
              "firman",
              "firmar",
              "firmamos",
              "contrato",
              "legal",
            ],
            answer:
              "Sí, firmamos acuerdos de confidencialidad (NDA) antes de iniciar cualquier discusión detallada sobre tu proyecto. Esto garantiza que tus ideas, información comercial y detalles técnicos permanezcan protegidos. Podemos utilizar tu propio NDA o proporcionarte nuestro modelo estándar. Todo nuestro equipo está sujeto a acuerdos de confidencialidad y seguimos protocolos estrictos para el manejo de información sensible.",
          },
          {
            question: [
              "seguridad",
              "vulnerabilidades",
              "hackeo",
              "protección",
              "medidas",
              "prevención",
              "ataques",
              "ciberseguridad",
            ],
            answer:
              "La seguridad es una prioridad en todos nuestros desarrollos. Implementamos las mejores prácticas como autenticación multifactor, encriptación de datos en tránsito y en reposo, validación de entradas, protección contra inyecciones SQL y XSS, y seguimos el OWASP Top 10. Realizamos pruebas de penetración, análisis de vulnerabilidades y mantenemos actualizadas todas las dependencias. También ofrecemos auditorías de seguridad periódicas para sistemas en producción.",
          },
          {
            question: [
              "contrato",
              "legal",
              "términos",
              "condiciones",
              "acuerdo",
              "documento",
              "firmar",
              "firmamos",
              "cláusulas",
            ],
            answer:
              "Trabajamos con contratos claros y transparentes que detallan entregables, cronogramas, pagos, garantías y propiedad intelectual. Nuestros contratos están diseñados para proteger a ambas partes y establecer expectativas claras. Podemos adaptar ciertas cláusulas según las necesidades específicas del proyecto y siempre estamos abiertos a revisar y discutir los términos para asegurar que ambas partes se sientan cómodas con el acuerdo.",
          },
          {
            question: ["certificaciones", "iso", "cumplimiento", "normativas", "estándares", "compliance"],
            answer:
              "Cumplimos con estándares internacionales de seguridad y calidad en el desarrollo de software. Nuestros procesos están alineados con ISO 27001 para seguridad de la información y seguimos las mejores prácticas de ITIL para gestión de servicios IT. También nos aseguramos de que nuestras soluciones cumplan con normativas específicas de cada sector, como PCI DSS para pagos, HIPAA para salud o normativas financieras cuando es aplicable.",
          },
        ],
        fallback:
          "La seguridad y la protección de la propiedad intelectual son prioridades para nosotros. Trabajamos con contratos claros y acuerdos de confidencialidad para proteger tus intereses. Implementamos las mejores prácticas de seguridad en todos nuestros desarrollos y garantizamos que eres el propietario completo del código fuente y todos los activos desarrollados. ¿Hay algún aspecto específico sobre seguridad o propiedad que te preocupe?",
      },

      // Soporte Técnico
      soporte: {
        keywords: [
          "soporte",
          "técnico",
          "mantenimiento",
          "ayuda",
          "asistencia",
          "problemas",
          "errores",
          "bugs",
          "post",
          "después",
          "lanzamiento",
          "garantía",
          "actualización",
          "mejoras",
        ],
        responses: [
          {
            question: [
              "ofrecen",
              "dan",
              "brindan",
              "proporcionan",
              "hay",
              "tienen",
              "incluyen",
              "soporte",
              "técnico",
              "mantenimiento",
              "después",
              "post",
              "lanzamiento",
            ],
            answer:
              "Sí, ofrecemos soporte técnico completo después del lanzamiento. Tenemos diferentes planes de mantenimiento que incluyen monitoreo, corrección de errores, actualizaciones de seguridad y soporte al usuario final. Nuestro objetivo es asegurar que tu aplicación funcione perfectamente en todo momento y evolucione según las necesidades cambiantes de tu negocio y usuarios.",
          },
          {
            question: [
              "incluye",
              "contiene",
              "abarca",
              "cubre",
              "comprende",
              "soporte",
              "mantenimiento",
              "post",
              "después",
              "lanzamiento",
              "qué",
              "que",
            ],
            answer:
              "Nuestro soporte post-lanzamiento incluye: corrección de errores, actualizaciones de seguridad, optimización de rendimiento, compatibilidad con nuevas versiones de sistemas operativos y navegadores, copias de seguridad regulares, monitoreo 24/7, y un tiempo de respuesta garantizado según la severidad del problema. También ofrecemos análisis de uso y recomendaciones para mejorar la experiencia del usuario basadas en datos reales.",
          },
          {
            question: [
              "garantía",
              "garantizan",
              "aseguran",
              "respaldan",
              "software",
              "desarrollo",
              "código",
              "aplicación",
              "errores",
              "bugs",
              "problemas",
            ],
            answer:
              "Ofrecemos una garantía de 3 meses en todos nuestros desarrollos. Durante este período, corregimos cualquier error o problema sin costo adicional. Esta garantía cubre bugs, problemas de rendimiento y compatibilidad con los navegadores y dispositivos especificados en el contrato. Para una protección más extensa, recomendamos nuestros planes de mantenimiento que extienden esta cobertura y añaden servicios adicionales.",
          },
          {
            question: [
              "tiempo",
              "respuesta",
              "urgencia",
              "emergencia",
              "crítico",
              "problema",
              "error",
              "bug",
              "fallo",
              "caída",
              "sistema",
              "rápido",
              "inmediato",
            ],
            answer:
              "Nuestros tiempos de respuesta varían según la severidad del problema: para incidencias críticas (sistema caído), respondemos en menos de 2 horas; para problemas graves, en menos de 8 horas; y para incidencias menores, en 24-48 horas. Contamos con un sistema de tickets para seguimiento y un número de emergencia para situaciones críticas. Nuestros SLAs garantizan estos tiempos de respuesta y resolución según el plan contratado.",
          },
          {
            question: [
              "actualizaciones",
              "mejoras",
              "nuevas",
              "funcionalidades",
              "características",
              "features",
              "versiones",
              "evolución",
              "producto",
              "software",
            ],
            answer:
              "Además del mantenimiento correctivo, ofrecemos servicios de mantenimiento evolutivo para implementar nuevas funcionalidades y mejoras. Trabajamos contigo para priorizar un roadmap de evolución del producto que mantenga tu software competitivo y alineado con las necesidades cambiantes de tu negocio y usuarios. Estas mejoras se pueden implementar mediante sprints de desarrollo planificados o con un banco de horas mensual flexible.",
          },
          {
            question: ["planes", "paquetes", "opciones", "mantenimiento", "soporte", "mensual", "anual", "costo"],
            answer:
              "Ofrecemos varios planes de mantenimiento: el plan 'Básico' (desde 500€/mes) incluye monitorización, copias de seguridad y corrección de errores; el plan 'Estándar' (desde 1.000€/mes) añade actualizaciones de seguridad, optimizaciones y un banco de horas para pequeñas mejoras; y el plan 'Premium' (desde 2.000€/mes) incluye desarrollo evolutivo continuo, soporte prioritario 24/7 y análisis de rendimiento y uso. Todos los planes se pueden personalizar según tus necesidades específicas.",
          },
          {
            question: ["formación", "capacitación", "entrenamiento", "training", "usuarios", "administradores", "uso"],
            answer:
              "Proporcionamos formación completa para usuarios y administradores del sistema. Esto incluye sesiones de capacitación en vivo, documentación detallada, videos tutoriales y acceso a un portal de soporte con guías y FAQs. Para proyectos complejos, ofrecemos programas de 'train the trainer' donde capacitamos a tus formadores internos para que puedan transferir el conocimiento al resto de la organización de manera efectiva.",
          },
        ],
        fallback:
          "Ofrecemos diversos planes de soporte técnico y mantenimiento para asegurar que tu software funcione correctamente después del lanzamiento. Nuestros servicios incluyen corrección de errores, actualizaciones de seguridad, optimizaciones de rendimiento y desarrollo evolutivo. ¿Te gustaría conocer más detalles sobre nuestros servicios de soporte?",
      },

      // Tecnologías y Stack Técnico
      tecnologias: {
        keywords: [
          "tecnología",
          "tecnologías",
          "stack",
          "framework",
          "lenguaje",
          "programación",
          "frontend",
          "backend",
          "base de datos",
          "cloud",
          "nube",
          "servidor",
          "hosting",
          "infraestructura",
          "arquitectura",
          "react",
          "angular",
          "vue",
          "node",
          "python",
          "javascript",
        ],
        responses: [
          {
            question: ["frontend", "interfaz", "ui", "ux", "diseño", "react", "angular", "vue", "javascript", "web"],
            answer:
              "Para desarrollo frontend utilizamos tecnologías modernas como React, Angular y Vue.js, seleccionando la más adecuada según los requisitos del proyecto. Implementamos arquitecturas basadas en componentes, state management eficiente con Redux o Context API, y optimizamos el rendimiento con técnicas como code splitting y lazy loading. Utilizamos TypeScript para mayor robustez y mantenibilidad del código, y frameworks como Next.js o Nuxt.js para aplicaciones con renderizado del lado del servidor (SSR).",
          },
          {
            question: [
              "backend",
              "servidor",
              "api",
              "node",
              "python",
              "java",
              "php",
              "rest",
              "graphql",
              "microservicios",
            ],
            answer:
              "En el backend trabajamos principalmente con Node.js, Python (Django/Flask) y Java Spring Boot, adaptándonos a las necesidades específicas de cada proyecto. Diseñamos APIs RESTful o GraphQL según los patrones de consumo de datos, e implementamos arquitecturas de microservicios cuando la escalabilidad es crítica. Utilizamos sistemas de colas como RabbitMQ o Kafka para procesamiento asíncrono, y Docker con Kubernetes para orquestación de contenedores en proyectos complejos.",
          },
          {
            question: [
              "base",
              "datos",
              "database",
              "sql",
              "nosql",
              "postgres",
              "mysql",
              "mongodb",
              "redis",
              "almacenamiento",
            ],
            answer:
              "Trabajamos con diversas bases de datos según los requisitos del proyecto. Para datos estructurados utilizamos PostgreSQL o MySQL, para datos no estructurados o alta escalabilidad horizontal MongoDB o DynamoDB, para caché y alto rendimiento Redis, y para análisis de grandes volúmenes BigQuery o Redshift. Implementamos estrategias de optimización como indexación, sharding, y replicación, y aseguramos la integridad de los datos con backups automatizados y planes de recuperación ante desastres.",
          },
          {
            question: [
              "móvil",
              "mobile",
              "app",
              "ios",
              "android",
              "react native",
              "flutter",
              "swift",
              "kotlin",
              "híbrida",
            ],
            answer:
              "Para desarrollo móvil ofrecemos tanto soluciones nativas (Swift para iOS, Kotlin para Android) como multiplataforma (React Native, Flutter). La elección depende de factores como presupuesto, timeline, requisitos de rendimiento y acceso a funcionalidades nativas. Nuestras apps móviles incluyen características como modo offline, notificaciones push, geolocalización, e integración con hardware del dispositivo. Implementamos CI/CD para entregas continuas y testing automatizado para asegurar la calidad en múltiples dispositivos.",
          },
          {
            question: ["cloud", "nube", "aws", "azure", "google", "servidor", "hosting", "infraestructura", "devops"],
            answer:
              "Desplegamos nuestras soluciones principalmente en AWS, Google Cloud y Azure, seleccionando la plataforma según los requisitos específicos y presupuesto. Implementamos infraestructura como código (IaC) con Terraform o CloudFormation, CI/CD con GitHub Actions o GitLab CI, y monitorización con herramientas como New Relic, Datadog o ELK Stack. Utilizamos arquitecturas serverless cuando es posible para optimizar costos, y configuramos auto-scaling para manejar picos de tráfico eficientemente.",
          },
          {
            question: [
              "seguridad",
              "autenticación",
              "autorización",
              "oauth",
              "jwt",
              "encriptación",
              "firewall",
              "protección",
            ],
            answer:
              "Implementamos múltiples capas de seguridad en nuestros desarrollos, incluyendo autenticación robusta (OAuth 2.0, OpenID Connect, JWT), autorización granular basada en roles, encriptación de datos sensibles en tránsito y en reposo, protección contra ataques comunes (CSRF, XSS, SQL Injection), y validación estricta de entradas. Realizamos auditorías de seguridad regulares, seguimos el principio de mínimo privilegio, y mantenemos todas las dependencias actualizadas para prevenir vulnerabilidades conocidas.",
          },
          {
            question: [
              "ia",
              "ai",
              "machine learning",
              "ml",
              "inteligencia artificial",
              "chatbot",
              "nlp",
              "visión",
              "algoritmos",
            ],
            answer:
              "Integramos tecnologías de IA y Machine Learning utilizando frameworks como TensorFlow, PyTorch, o servicios cloud como AWS SageMaker, Google AI o Azure ML. Implementamos soluciones de procesamiento de lenguaje natural (NLP) para chatbots y análisis de texto, sistemas de recomendación basados en comportamiento de usuarios, análisis predictivo para forecasting, y visión por computadora para reconocimiento de imágenes. Estas soluciones se integran perfectamente con tus sistemas existentes para maximizar su valor de negocio.",
          },
        ],
        fallback:
          "Trabajamos con un amplio stack tecnológico que incluye React, Angular, Vue.js para frontend; Node.js, Python, Java para backend; React Native, Flutter, Swift y Kotlin para desarrollo móvil; y AWS, Google Cloud y Azure para infraestructura cloud. Seleccionamos las tecnologías más adecuadas para cada proyecto según sus requisitos específicos. ¿Hay alguna tecnología o aspecto técnico específico sobre el que te gustaría saber más?",
      },

      // Preguntas Generales
      general_questions: {
        keywords: [
          "ayuda",
          "pregunta",
          "duda",
          "consulta",
          "información",
          "info",
          "cómo",
          "como",
          "qué",
          "que",
          "cuál",
          "cual",
          "cuándo",
          "cuando",
          "dónde",
          "donde",
          "por qué",
          "porque",
        ],
        responses: [
          {
            question: ["hola", "buenos días", "buenas tardes", "buenas noches", "saludos", "hey", "qué tal"],
            answer:
              "¡Hola! Soy el asistente virtual de Global Code. Puedo ayudarte con información sobre nuestros servicios, precios, metodología de trabajo y más. ¿En qué puedo ayudarte hoy?",
          },
          {
            question: ["gracias", "muchas gracias", "te lo agradezco", "agradecido", "agradecida", "thanks"],
            answer:
              "¡De nada! Estoy aquí para ayudarte. Si tienes más preguntas o necesitas información adicional, no dudes en preguntar. ¿Hay algo más en lo que pueda asistirte?",
          },
          {
            question: ["adiós", "adios", "chao", "hasta luego", "nos vemos", "bye", "goodbye", "hasta pronto"],
            answer:
              "¡Hasta luego! Gracias por contactar con Global Code. Si tienes más preguntas en el futuro, estaré aquí para ayudarte. ¡Que tengas un excelente día!",
          },
          {
            question: ["ayuda", "help", "opciones", "puedes hacer", "funciones", "asistencia", "qué haces"],
            answer:
              "Puedo ayudarte con información sobre Global Code, incluyendo nuestros servicios, precios, proceso de desarrollo, tecnologías, y más. Algunas preguntas que puedes hacerme son:\n- ¿Qué servicios ofrecen?\n- ¿Cuánto cuesta desarrollar una app o web?\n- ¿Cómo es su proceso de desarrollo?\n- ¿Qué tecnologías utilizan?\n- ¿Cómo puedo contactarlos?\n¿Sobre qué te gustaría saber más?",
          },
          {
            question: ["humano", "persona", "agente", "hablar", "representante", "real", "contacto directo"],
            answer:
              "Entiendo que a veces es mejor hablar directamente con una persona. Puedes contactar con nuestro equipo por email a itsglobalcodeinfo@gmail.com, por teléfono al +34 628 38 32 04, o agendar una reunión desde nuestra página web. Estarán encantados de atenderte personalmente y responder a todas tus preguntas.",
          },
          {
            question: ["reunión", "cita", "consulta", "llamada", "videollamada", "zoom", "teams", "meet", "agendar"],
            answer:
              "Puedes agendar una reunión gratuita de 30 minutos con nuestro equipo para discutir tu proyecto. Visita nuestra página web y haz clic en el botón 'Agendar Reunión', o escríbenos a itsglobalcodeinfo@gmail.com con tu disponibilidad. Las reuniones se realizan por Zoom, Teams o Google Meet, según tu preferencia, y no implican ningún compromiso.",
          },
          {
            question: ["quién eres", "qué eres", "eres un bot", "eres una ia", "eres real", "eres humano", "chatbot"],
            answer:
              "Soy el asistente virtual de Global Code, diseñado para proporcionar información sobre nuestros servicios y responder a preguntas frecuentes. Aunque no soy un humano, estoy programado para ayudarte con información precisa sobre nuestra empresa. Para consultas más específicas o personalizadas, puedes contactar directamente con nuestro equipo a través de itsglobalcodeinfo@gmail.com o por teléfono al +34 628 38 32 04.",
          },
        ],
        fallback:
          "Estoy aquí para ayudarte con información sobre Global Code. Si tu pregunta es específica o requiere atención personalizada, te recomiendo contactar directamente con nuestro equipo a través de itsglobalcodeinfo@gmail.com o por teléfono al +34 628 38 32 04. También puedes agendar una reunión gratuita desde nuestra página web.",
      },
    }

    // Function to show typing indicator
    function showTypingIndicator() {
      const typingDiv = document.createElement("div")
      typingDiv.className = "typing-indicator"
      typingDiv.id = "typing-indicator"
      typingDiv.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
      `
      chatbotMessages.appendChild(typingDiv)
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight
    }

    // Function to hide typing indicator
    function hideTypingIndicator() {
      const typingIndicator = document.getElementById("typing-indicator")
      if (typingIndicator) {
        typingIndicator.remove()
      }
    }

    // Function to add message to chat
    function addMessage(text, type) {
      const messageDiv = document.createElement("div")
      messageDiv.className = `chatbot-message ${type}`

      // Convert line breaks to HTML for better formatting (con manejo de nulos)
      if (text) {
        text = text.replace(/\n/g, "<br>")
      } else {
        text = "Lo siento, ha ocurrido un error. Por favor, intenta de nuevo."
      }
      messageDiv.innerHTML = text

      chatbotMessages.appendChild(messageDiv)
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight
    }

    // Function to find the best response for a message
    function findBestResponse(message) {
      message = message.toLowerCase().trim()

      // Check for basic interactions first
      if (isSaludo(message)) {
        return knowledgeBase.general_questions.responses.find((r) => r.question.includes("hola")).answer
      }

      if (isDespedida(message)) {
        return knowledgeBase.general_questions.responses.find((r) => r.question.includes("adiós")).answer
      }

      if (isAgradecimiento(message)) {
        return knowledgeBase.general_questions.responses.find((r) => r.question.includes("gracias")).answer
      }

      // Find the most relevant category
      let bestCategory = null
      let bestCategoryScore = 0

      for (const category in knowledgeBase) {
        const keywords = knowledgeBase[category].keywords
        const score = calculateRelevance(message, keywords)

        if (score > bestCategoryScore) {
          bestCategoryScore = score
          bestCategory = category
        }
      }

      // If we found a relevant category
      if (bestCategory && bestCategoryScore > 0.1) {
        const categoryData = knowledgeBase[bestCategory]

        // Find the most relevant response within the category
        let bestResponse = null
        let bestResponseScore = 0

        for (const response of categoryData.responses) {
          const score = calculateRelevance(message, response.question)

          if (score > bestResponseScore) {
            bestResponseScore = score
            bestResponse = response.answer
          }
        }

        // If we found a specific response with good score
        if (bestResponse && bestResponseScore > 0.15) {
          return bestResponse
        }

        // If no specific response, use the category fallback
        return categoryData.fallback
      }

      // Default fallback if no relevant category found
      return "No he podido entender completamente tu pregunta. Puedes intentar reformularla o ser más específico. Algunas preguntas que puedo responder son:\n- ¿Qué servicios ofrecen?\n- ¿Cuánto cuesta desarrollar una app o web?\n- ¿Cómo es su proceso de desarrollo?\n\nTambién puedes contactarnos directamente en itsglobalcodeinfo@gmail.com o agendar una reunión desde nuestra página principal."
    }

    // Functions to detect message type
    function isSaludo(message) {
      const saludos = ["hola", "buenas", "buenos", "días", "tardes", "noches", "que tal", "qué tal", "saludos", "hey"]
      return saludos.some((saludo) => message.includes(saludo))
    }

    function isDespedida(message) {
      const despedidas = ["adiós", "adios", "chao", "hasta luego", "nos vemos", "que te vaya bien", "bye", "goodbye"]
      return despedidas.some((despedida) => message.includes(despedida))
    }

    function isAgradecimiento(message) {
      const agradecimientos = ["gracias", "muchas gracias", "te lo agradezco", "agradecido", "agradecida", "thanks"]
      return agradecimientos.some((agradecimiento) => message.includes(agradecimiento))
    }

    // Function to send message
    function sendMessage() {
      const message = chatbotInput.value.trim()
      if (message) {
        // Add user message
        addMessage(message, "user")

        // Clear input and reset height
        chatbotInput.value = ""
        chatbotInput.style.height = "auto"

        // Show typing indicator
        showTypingIndicator()

        // Simulate processing time for more natural interaction
        setTimeout(
          () => {
            // Hide typing indicator
            hideTypingIndicator()

            // Find and add response
            const response = findBestResponse(message)
            addMessage(response, "assistant")
          },
          500 + Math.random() * 1000,
        ) // Random delay between 0.5-1.5 seconds
      }
    }
  }
})

// Función para calcular relevancia mejorada
function calculateRelevance(message, keywords) {
  if (!Array.isArray(keywords)) return 0

  let matchCount = 0
  const messageWords = message.split(/\s+/)

  for (const keyword of keywords) {
    if (message.includes(keyword)) {
      matchCount += 1.5 // Dar más peso a las coincidencias exactas
    } else {
      // Buscar coincidencias parciales
      for (const word of messageWords) {
        if (keyword.includes(word) || word.includes(keyword)) {
          if (word.length > 3) {
            // Solo considerar palabras significativas
            matchCount += 0.5
            break
          }
        }
      }
    }
  }

  return matchCount / Math.max(keywords.length, 1)
}
