document.addEventListener("DOMContentLoaded", () => {
  // Crear el contenedor del chatbot si no existe
  if (!document.querySelector(".chatbot-container")) {
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
            ¡Hola! Soy el asistente virtual de Global Code. Puedo ayudarte con información sobre nuestros servicios, precios, metodología de trabajo y más. Intenta hacer preguntas específicas como "¿Qué servicios ofrecen?" o "¿Cuánto cuesta desarrollar una app?". ¿En qué puedo ayudarte hoy?
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

    // Ajustar la altura del textarea dinámicamente cuando el usuario escribe
    chatbotInput.addEventListener("input", () => {
      chatbotInput.style.height = "auto"
      chatbotInput.style.height = Math.min(chatbotInput.scrollHeight, 100) + "px"
    })

    // Detectar cambios de tamaño de ventana para ajustar el chatbot
    window.addEventListener("resize", () => {
      if (chatbotPanel.style.display !== "none") {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight

        // Ajustar overflow del body según el tamaño de la pantalla
        if (window.innerWidth <= 576) {
          document.body.style.overflow = "hidden"
        } else {
          document.body.style.overflow = "auto"
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
        ],
        responses: [
          {
            question: ["servicios", "ofrecen", "hacen", "realizan", "desarrollan"],
            answer:
              "En Global Code ofrecemos servicios de desarrollo web, aplicaciones móviles, web apps y automatizaciones con IA. Nuestro enfoque es crear soluciones tecnológicas a medida que impulsen tu negocio.",
          },
          {
            question: ["ubicados", "ubicación", "dirección", "donde", "dónde", "oficina", "sede", "encuentran"],
            answer:
              "Nuestra oficina principal está ubicada en Madrid, España. También trabajamos de forma remota con clientes de todo el mundo.",
          },
          {
            question: ["contacto", "contactar", "comunicar", "teléfono", "email", "correo", "llamar", "escribir"],
            answer:
              "Puedes contactarnos por email a info@globalcode.com, por teléfono al +34 912 345 678, o completando el formulario de contacto en nuestra web. También puedes agendar una reunión directamente desde nuestra página principal.",
          },
          {
            question: ["horario", "atención", "disponibles", "atienden", "cuando", "cuándo", "horas"],
            answer:
              "Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00 (hora de Madrid). Sin embargo, nuestro equipo de soporte está disponible 24/7 para emergencias técnicas.",
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
              "Sí, desarrollamos aplicaciones móviles nativas y multiplataforma para iOS y Android. Utilizamos tecnologías como React Native, Flutter, Swift y Kotlin para crear experiencias móviles de alta calidad con interfaces intuitivas y alto rendimiento.",
          },
          {
            question: ["web", "página", "sitio", "website", "landing", "ecommerce", "tienda", "online"],
            answer:
              "Desarrollamos todo tipo de soluciones web, desde sitios corporativos y landing pages hasta complejas aplicaciones web y plataformas SaaS. Utilizamos las últimas tecnologías como React, Angular, Vue.js y Next.js para crear experiencias web modernas y responsivas.",
          },
          {
            question: ["escritorio", "desktop", "windows", "mac", "linux", "aplicación local"],
            answer:
              "Sí, también desarrollamos aplicaciones de escritorio para Windows, macOS y Linux utilizando tecnologías como Electron, .NET y Java, dependiendo de los requisitos específicos del proyecto.",
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
              "Trabajamos con un amplio stack tecnológico que incluye React, Angular, Vue.js, Next.js para frontend; Node.js, Python, Java y .NET para backend; React Native, Flutter, Swift y Kotlin para desarrollo móvil; y AWS, Google Cloud y Azure para infraestructura cloud.",
          },
          {
            question: ["medida", "personalizado", "custom", "específico", "particular", "adaptado", "único"],
            answer:
              "Nos especializamos en desarrollo de software a medida. Creamos soluciones personalizadas que se adaptan perfectamente a las necesidades específicas de tu negocio, en lugar de utilizar plantillas o soluciones genéricas.",
          },
          {
            question: ["mantenimiento", "soporte", "actualización", "mejoras", "evolución", "después", "post"],
            answer:
              "Ofrecemos servicios completos de mantenimiento y soporte post-lanzamiento. Esto incluye corrección de errores, actualizaciones de seguridad, mejoras de rendimiento y la implementación de nuevas funcionalidades para mantener tu software siempre actualizado y funcionando de manera óptima.",
          },
        ],
        fallback:
          "Ofrecemos servicios completos de desarrollo de software, incluyendo aplicaciones web, móviles, sistemas empresariales y soluciones de IA. ¿Hay algún servicio específico sobre el que te gustaría saber más?",
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
        ],
        responses: [
          {
            question: ["proceso", "desarrollo", "etapas", "fases", "pasos", "cómo", "funciona", "trabajan"],
            answer:
              "Nuestro proceso de desarrollo sigue estas etapas: 1) Descubrimiento y análisis de requisitos, 2) Diseño de UX/UI, 3) Desarrollo iterativo, 4) Pruebas y control de calidad, 5) Despliegue, y 6) Soporte post-lanzamiento. Mantenemos una comunicación constante durante todo el proceso.",
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
              "La duración de un proyecto depende de su complejidad y alcance. Típicamente, una aplicación móvil o web básica puede tomar entre 2-3 meses, mientras que proyectos más complejos pueden requerir 4-6 meses o más. Siempre proporcionamos un cronograma detallado al inicio del proyecto.",
          },
          {
            question: ["metodología", "scrum", "agile", "ágil", "kanban", "waterfall", "cascada", "método", "enfoque"],
            answer:
              "Utilizamos metodologías ágiles como Scrum y Kanban, adaptadas a las necesidades específicas de cada proyecto. Esto nos permite entregar valor de forma incremental, adaptarnos rápidamente a los cambios y mantener una alta calidad en el desarrollo.",
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
              "Entendemos que los requisitos pueden evolucionar durante el desarrollo. Nuestra metodología ágil nos permite adaptarnos a estos cambios. Gestionamos las modificaciones a través de un proceso estructurado que evalúa el impacto en tiempo y costos, asegurando transparencia y flexibilidad.",
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
              "Mantenemos una comunicación constante a través de reuniones semanales, informes de progreso y una plataforma de gestión de proyectos donde puedes seguir el avance en tiempo real. Nuestro objetivo es que siempre estés informado y puedas participar activamente en el proceso.",
          },
        ],
        fallback:
          "Utilizamos metodologías ágiles para el desarrollo de nuestros proyectos, lo que nos permite ser flexibles y entregar valor de forma incremental. ¿Te gustaría conocer algún aspecto específico de nuestro proceso?",
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
              "El costo de desarrollo varía según la complejidad, funcionalidades y plataformas. Una aplicación básica puede comenzar desde 15.000€, mientras que proyectos más complejos pueden requerir una inversión mayor. Ofrecemos presupuestos personalizados basados en tus requisitos específicos.",
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
              "Sí, ofrecemos presupuestos totalmente personalizados. Después de una reunión inicial para entender tus necesidades, te proporcionamos una estimación detallada que incluye desglose de costos, cronograma y entregables. Este presupuesto es sin compromiso y totalmente gratuito.",
          },
          {
            question: ["hora", "proyecto", "cobran", "facturan", "pagan", "modalidad", "forma", "tipo", "pago"],
            answer:
              "Ofrecemos dos modalidades: precio cerrado por proyecto (recomendado para alcances bien definidos) y facturación por horas o sprints (ideal para proyectos que requieren mayor flexibilidad). En ambos casos, establecemos entregables claros y un proceso de aprobación transparente.",
          },
          {
            question: ["paquetes", "planes", "precios", "tarifas", "opciones", "alternativas", "diferentes", "varios"],
            answer:
              "Contamos con diferentes planes según las necesidades de tu proyecto. Desde nuestro plan 'Startup' para MVPs y proyectos iniciales, hasta soluciones 'Enterprise' para sistemas complejos. También ofrecemos planes de mantenimiento mensual para soporte continuo post-lanzamiento.",
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
              "Nuestra estructura de pago típica incluye un 30% inicial para comenzar el proyecto, pagos intermedios al alcanzar hitos específicos, y un pago final a la entrega. Aceptamos transferencias bancarias, tarjetas de crédito y, en algunos casos, podemos establecer planes de financiación.",
          },
        ],
        fallback:
          "Nuestros precios varían según las necesidades específicas de cada proyecto. Ofrecemos presupuestos personalizados después de entender en detalle tus requerimientos. ¿Te gustaría agendar una reunión para discutir tu proyecto y recibir una cotización?",
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
              "Tú eres el propietario completo del código fuente y todos los activos desarrollados. Una vez finalizado el proyecto y completados los pagos, transferimos todos los derechos de propiedad intelectual a tu nombre o empresa, incluyendo el código fuente, diseños y documentación.",
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
              "Cumplimos estrictamente con el RGPD/GDPR y otras regulaciones de protección de datos. Implementamos medidas técnicas y organizativas para garantizar la seguridad de la información, incluyendo encriptación, acceso restringido y auditorías regulares. Todos nuestros desarrollos incorporan privacy by design.",
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
              "Sí, firmamos acuerdos de confidencialidad (NDA) antes de iniciar cualquier discusión detallada sobre tu proyecto. Esto garantiza que tus ideas, información comercial y detalles técnicos permanezcan protegidos. Podemos utilizar tu propio NDA o proporcionarte nuestro modelo estándar.",
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
              "La seguridad es una prioridad en todos nuestros desarrollos. Implementamos las mejores prácticas de seguridad, realizamos pruebas de penetración, seguimos el OWASP Top 10, y mantenemos actualizadas todas las dependencias. Además, ofrecemos auditorías de seguridad periódicas para sistemas en producción.",
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
              "Trabajamos con contratos claros y transparentes que detallan entregables, cronogramas, pagos, garantías y propiedad intelectual. Nuestros contratos están diseñados para proteger a ambas partes y establecer expectativas claras. Podemos adaptar ciertas cláusulas según las necesidades específicas del proyecto.",
          },
        ],
        fallback:
          "La seguridad y la protección de la propiedad intelectual son prioridades para nosotros. Trabajamos con contratos claros y acuerdos de confidencialidad para proteger tus intereses. ¿Hay algún aspecto específico sobre seguridad o propiedad que te preocupe?",
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
              "Sí, ofrecemos soporte técnico completo después del lanzamiento. Tenemos diferentes planes de mantenimiento que incluyen monitoreo, corrección de errores, actualizaciones de seguridad y soporte al usuario final. Nuestro objetivo es asegurar que tu aplicación funcione perfectamente en todo momento.",
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
              "Nuestro soporte post-lanzamiento incluye: corrección de errores, actualizaciones de seguridad, optimización de rendimiento, compatibilidad con nuevas versiones de sistemas operativos y navegadores, copias de seguridad regulares, monitoreo 24/7, y un tiempo de respuesta garantizado según la severidad del problema.",
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
              "Ofrecemos una garantía de 3 meses en todos nuestros desarrollos. Durante este período, corregimos cualquier error o problema sin costo adicional. Para una protección más extensa, recomendamos nuestros planes de mantenimiento que extienden esta cobertura y añaden servicios adicionales.",
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
              "Nuestros tiempos de respuesta varían según la severidad del problema: para incidencias críticas (sistema caído), respondemos en menos de 2 horas; para problemas graves, en menos de 8 horas; y para incidencias menores, en 24-48 horas. Contamos con un sistema de tickets para seguimiento y un número de emergencia para situaciones críticas.",
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
              "Además del mantenimiento correctivo, ofrecemos servicios de mantenimiento evolutivo para implementar nuevas funcionalidades y mejoras. Trabajamos contigo para priorizar un roadmap de evolución del producto que mantenga tu software competitivo y alineado con las necesidades cambiantes de tu negocio y usuarios.",
          },
        ],
        fallback:
          "Ofrecemos diversos planes de soporte técnico y mantenimiento para asegurar que tu software funcione correctamente después del lanzamiento. ¿Te gustaría conocer más detalles sobre nuestros servicios de soporte?",
      },

      // Facturación y Contratos
      facturacion: {
        keywords: [
          "facturación",
          "factura",
          "pago",
          "contrato",
          "legal",
          "condiciones",
          "términos",
          "acuerdo",
          "convenio",
          "forma",
          "método",
          "manera",
          "abonar",
          "transferencia",
          "tarjeta",
          "plazos",
        ],
        responses: [
          {
            question: [
              "proceso",
              "facturación",
              "factura",
              "facturas",
              "facturan",
              "cómo",
              "como",
              "funciona",
              "sistema",
            ],
            answer:
              "Nuestro proceso de facturación es transparente y estructurado. Emitimos facturas según los hitos acordados en el contrato. Cada factura incluye un desglose detallado de los servicios prestados, con plazos de pago a 15 días. Proporcionamos toda la documentación necesaria para tu contabilidad y cumplimos con la normativa fiscal vigente.",
          },
          {
            question: [
              "formas",
              "métodos",
              "maneras",
              "pago",
              "aceptan",
              "admiten",
              "transferencia",
              "tarjeta",
              "paypal",
              "efectivo",
            ],
            answer:
              "Aceptamos múltiples formas de pago: transferencia bancaria (preferente para proyectos grandes), tarjetas de crédito/débito, PayPal y, en algunos casos, podemos establecer planes de financiación. Para clientes internacionales, también trabajamos con plataformas como Wise o pagos en divisas.",
          },
          {
            question: [
              "condiciones",
              "términos",
              "contrato",
              "acuerdo",
              "legal",
              "documento",
              "cláusulas",
              "estipulaciones",
              "convenio",
            ],
            answer:
              "Nuestros contratos incluyen términos claros sobre: alcance del proyecto, entregables, cronograma, estructura de pagos, propiedad intelectual, confidencialidad, garantías y procedimientos de aceptación. El contrato se personaliza según las necesidades específicas del proyecto y está diseñado para proteger a ambas partes.",
          },
          {
            question: [
              "plazos",
              "etapas",
              "fases",
              "hitos",
              "pago",
              "abono",
              "adelanto",
              "inicial",
              "final",
              "entrega",
            ],
            answer:
              "Nuestra estructura de pago típica incluye: 30% al inicio del proyecto, 30% al completar el diseño y arquitectura, 30% al finalizar el desarrollo principal, y 10% tras la entrega final y aprobación. Para proyectos largos, podemos establecer pagos mensuales o basados en sprints completados.",
          },
          {
            question: [
              "impuestos",
              "iva",
              "igic",
              "fiscal",
              "tributario",
              "hacienda",
              "tax",
              "taxes",
              "factura",
              "legal",
            ],
            answer:
              "Todas nuestras facturas incluyen el IVA correspondiente (21% en España) u otros impuestos aplicables según la jurisdicción. Para clientes empresariales de la UE con número de VAT válido, aplicamos la inversión del sujeto pasivo. Para clientes internacionales fuera de la UE, las facturas pueden estar exentas de IVA según la normativa aplicable.",
          },
        ],
        fallback:
          "Nuestro proceso de facturación es transparente y flexible. Trabajamos con diferentes métodos de pago y estructuras de facturación adaptadas a cada proyecto. ¿Hay algún aspecto específico sobre facturación o contratos que te interese conocer?",
      },

      // Proyectos Anteriores
      proyectos: {
        keywords: [
          "proyectos",
          "anteriores",
          "previos",
          "pasados",
          "portfolio",
          "portafolio",
          "ejemplos",
          "casos",
          "éxito",
          "clientes",
          "trabajos",
          "realizados",
          "experiencia",
          "industria",
          "sector",
          "referencias",
        ],
        responses: [
          {
            question: [
              "ver",
              "mostrar",
              "ejemplos",
              "muestras",
              "portfolio",
              "portafolio",
              "trabajos",
              "proyectos",
              "anteriores",
              "previos",
              "pasados",
            ],
            answer:
              "Puedes ver ejemplos de nuestros trabajos en la sección de portfolio de nuestra web. También podemos enviarte un dossier personalizado con casos relevantes para tu industria. Por razones de confidencialidad, algunos proyectos no están públicamente disponibles, pero podemos compartir detalles en una reunión bajo NDA.",
          },
          {
            question: [
              "experiencia",
              "industria",
              "sector",
              "campo",
              "área",
              "especialidad",
              "especializan",
              "enfoque",
              "vertical",
              "nicho",
            ],
            answer:
              "Tenemos amplia experiencia en diversos sectores como fintech, e-commerce, salud, educación, logística y servicios profesionales. Nuestro equipo ha desarrollado soluciones específicas para cada industria, entendiendo sus particularidades, regulaciones y mejores prácticas. Esto nos permite aportar no solo expertise técnico sino también conocimiento de negocio.",
          },
          {
            question: [
              "referencias",
              "testimonios",
              "opiniones",
              "reviews",
              "feedback",
              "clientes",
              "anteriores",
              "previos",
              "satisfacción",
              "recomendaciones",
            ],
            answer:
              "Contamos con numerosos testimonios y referencias de clientes satisfechos. Podemos ponerte en contacto con algunos de ellos para que puedas verificar directamente nuestra calidad de trabajo y servicio. Nuestro índice de satisfacción del cliente es del 98% y el 80% de nuestros proyectos provienen de recomendaciones o clientes recurrentes.",
          },
          {
            question: [
              "tamaño",
              "escala",
              "dimensión",
              "grande",
              "pequeño",
              "mediano",
              "startup",
              "empresa",
              "corporación",
              "multinacional",
            ],
            answer:
              "Hemos trabajado con todo tipo de organizaciones, desde startups en fase inicial hasta grandes corporaciones multinacionales. Adaptamos nuestro enfoque según el tamaño y madurez de cada cliente, ofreciendo soluciones escalables que pueden crecer con tu negocio. Nuestro equipo puede ajustarse a diferentes estructuras organizativas y procesos.",
          },
          {
            question: [
              "éxito",
              "exitoso",
              "destacado",
              "notable",
              "importante",
              "significativo",
              "relevante",
              "impacto",
              "resultado",
              "logro",
            ],
            answer:
              "Entre nuestros casos de éxito destacan: una app de fintech que procesa más de $10M diarios, una plataforma educativa con 500,000 usuarios activos, un sistema de logística que redujo costos operativos en un 35%, y una solución de telemedicina que conecta a más de 1,000 especialistas con pacientes en todo el mundo. Cada proyecto ha generado ROI medible para nuestros clientes.",
          },
        ],
        fallback:
          "Hemos desarrollado más de 50 proyectos exitosos en diversos sectores. Nuestro portafolio incluye aplicaciones móviles, plataformas web, sistemas empresariales y soluciones de IA. ¿Te interesa conocer algún caso específico o relevante para tu industria?",
      },

      // Preguntas Técnicas Frecuentes
      tecnicas: {
        keywords: [
          "técnico",
          "técnica",
          "tecnología",
          "lenguaje",
          "framework",
          "base",
          "datos",
          "arquitectura",
          "infraestructura",
          "cloud",
          "nube",
          "servidor",
          "backend",
          "frontend",
          "móvil",
          "escalabilidad",
          "rendimiento",
          "performance",
          "seguridad",
        ],
        responses: [
          {
            question: [
              "lenguaje",
              "mejor",
              "recomiendan",
              "adecuado",
              "óptimo",
              "ideal",
              "aplicación",
              "app",
              "proyecto",
              "desarrollo",
            ],
            answer:
              "La elección del lenguaje depende de varios factores como tipo de aplicación, requisitos de rendimiento, equipo existente y planes futuros. Para aplicaciones web modernas solemos recomendar JavaScript/TypeScript con React o Vue.js. Para backend, Node.js, Python o Java dependiendo de la complejidad. Para móvil, Swift/Kotlin (nativo) o React Native/Flutter (multiplataforma). Podemos hacer una recomendación personalizada para tu caso específico.",
          },
          {
            question: [
              "base",
              "datos",
              "bbdd",
              "database",
              "db",
              "sql",
              "nosql",
              "recomiendan",
              "mejor",
              "adecuada",
              "óptima",
            ],
            answer:
              "Para la base de datos, evaluamos factores como tipo de datos, volumen, patrones de acceso y escalabilidad. Solemos recomendar PostgreSQL para sistemas transaccionales complejos, MongoDB para estructuras flexibles, Redis para caché y alto rendimiento, y soluciones como BigQuery para análisis de grandes volúmenes. En muchos casos, una arquitectura híbrida con diferentes bases de datos para distintos propósitos ofrece los mejores resultados.",
          },
          {
            question: [
              "escalan",
              "escalabilidad",
              "crecimiento",
              "usuarios",
              "tráfico",
              "carga",
              "volumen",
              "datos",
              "aplicaciones",
              "sistemas",
            ],
            answer:
              "Diseñamos nuestras aplicaciones pensando en la escalabilidad desde el inicio. Utilizamos arquitecturas de microservicios, sistemas distribuidos, balanceadores de carga, y bases de datos optimizadas. Implementamos estrategias como caché en múltiples niveles, CDNs para contenido estático, y auto-scaling en la nube. Nuestras soluciones pueden escalar desde cientos hasta millones de usuarios manteniendo un rendimiento óptimo.",
          },
          {
            question: [
              "seguridad",
              "protección",
              "vulnerabilidad",
              "hackeo",
              "ataque",
              "ciberseguridad",
              "medidas",
              "prevención",
              "riesgo",
            ],
            answer:
              "La seguridad es una prioridad en todos nuestros desarrollos. Implementamos prácticas como autenticación multifactor, encriptación de datos sensibles, protección contra inyecciones SQL y XSS, validación estricta de entradas, y seguimos el OWASP Top 10. Realizamos auditorías de seguridad y pruebas de penetración antes del lanzamiento. También ofrecemos planes de mantenimiento que incluyen actualizaciones de seguridad continuas.",
          },
          {
            question: [
              "cloud",
              "nube",
              "servidor",
              "hosting",
              "alojamiento",
              "aws",
              "azure",
              "google",
              "infraestructura",
              "despliegue",
            ],
            answer:
              "Trabajamos principalmente con AWS, Google Cloud y Azure para infraestructura en la nube. Seleccionamos la plataforma según los requisitos específicos del proyecto, considerando factores como servicios necesarios, presupuesto y conocimiento interno de tu equipo. Implementamos arquitecturas serverless cuando es posible para optimizar costos, y configuramos CI/CD para despliegues automatizados y seguros.",
          },
        ],
        fallback:
          "Nuestro equipo técnico tiene amplia experiencia en diversas tecnologías y arquitecturas. Seleccionamos la stack tecnológica más adecuada para cada proyecto según sus requisitos específicos. ¿Hay alguna duda técnica particular que podamos resolver?",
      },
    }

    // Funciones para detectar el tipo de mensaje
    function isSaludo(message) {
      const saludos = ["hola", "buenas", "buenos", "días", "tardes", "noches", "que tal", "qué tal"]
      return saludos.some((saludo) => message.includes(saludo))
    }

    function isDespedida(message) {
      const despedidas = ["adiós", "adios", "chao", "hasta luego", "nos vemos", "que te vaya bien", "gracias por todo"]
      return despedidas.some((despedida) => message.includes(despedida))
    }

    function isAgradecimiento(message) {
      const agradecimientos = ["gracias", "muchas gracias", "te lo agradezco", "agradecido", "agradecida"]
      return agradecimientos.some((agradecimiento) => message.includes(agradecimiento))
    }

    // Función para analizar el mensaje y generar una respuesta
    function generateResponse(message) {
      message = message.toLowerCase().trim()

      // Verificar si es un saludo
      if (isSaludo(message)) {
        return '¡Hola! Soy el asistente virtual de Global Code. Puedo ayudarte con información sobre nuestros servicios, precios, metodología de trabajo y más. Intenta hacer preguntas específicas como "¿Qué servicios ofrecen?" o "¿Cuánto cuesta desarrollar una app?". ¿En qué puedo ayudarte hoy?'
      }

      // Verificar si es una despedida
      if (isDespedida(message)) {
        return "¡Gracias por contactar con Global Code! Si tienes más preguntas en el futuro, estaré aquí para ayudarte. ¡Que tengas un excelente día!"
      }

      // Verificar si es un agradecimiento
      if (isAgradecimiento(message)) {
        return "¡De nada! Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?"
      }

      // Verificar si es una solicitud de ayuda
      if (message.includes("ayuda") || message.includes("help") || message === "?") {
        return "Puedo ayudarte con información sobre Global Code. Algunas preguntas que puedes hacer son:\n- ¿Qué servicios ofrecen?\n- ¿Cuánto cuesta desarrollar una app o web?\n- ¿Cómo es su proceso de desarrollo?\n- ¿Cuánto tiempo tarda un proyecto?\n- ¿Qué tecnologías utilizan?\n¿Sobre qué te gustaría saber más?"
      }

      // Manejar preguntas sobre tiempo de desarrollo
      if (
        message.includes("cuanto") ||
        message.includes("cuánto") ||
        message.includes("tiempo") ||
        message.includes("tarda") ||
        message.includes("duración")
      ) {
        if (message.includes("web") || message.includes("página") || message.includes("sitio")) {
          return "El tiempo de desarrollo de una web depende de su complejidad. Una landing page sencilla puede estar lista en 2-3 semanas, mientras que un sitio web corporativo completo puede llevar 1-2 meses. Para proyectos más complejos como plataformas web o aplicaciones SaaS, el tiempo puede extenderse a 3-6 meses. ¿Te gustaría que agendemos una reunión para discutir tu proyecto específico?"
        }
        if (message.includes("app") || message.includes("aplicación") || message.includes("móvil")) {
          return "El desarrollo de una aplicación móvil suele llevar entre 3-6 meses dependiendo de su complejidad. Aplicaciones sencillas pueden estar listas en 2-3 meses, mientras que proyectos más complejos pueden requerir 6 meses o más. Trabajamos con metodologías ágiles que permiten lanzar versiones funcionales en etapas tempranas. ¿Te gustaría conocer más detalles sobre nuestro proceso de desarrollo?"
        }
        if (message.includes("proyecto") || message.includes("desarrollo") || message.includes("software")) {
          return "La duración de un proyecto depende de su complejidad y alcance. Típicamente, una aplicación móvil o web básica puede tomar entre 2-3 meses, mientras que proyectos más complejos pueden requerir 4-6 meses o más. Siempre proporcionamos un cronograma detallado al inicio del proyecto. ¿Te gustaría discutir los detalles de tu proyecto para darte una estimación más precisa?"
        }
      }

      // Manejar preguntas sobre precios
      if (
        message.includes("precio") ||
        message.includes("costo") ||
        message.includes("coste") ||
        message.includes("vale") ||
        message.includes("valor") ||
        message.includes("cuanto") ||
        message.includes("cuánto") ||
        message.includes("presupuesto")
      ) {
        if (message.includes("web") || message.includes("página") || message.includes("sitio")) {
          return "El precio de desarrollo de una web varía según su complejidad. Una landing page profesional puede costar desde 1.500€, un sitio web corporativo desde 3.000€, y plataformas web complejas o aplicaciones SaaS desde 8.000€. Ofrecemos presupuestos personalizados basados en tus requisitos específicos. ¿Te gustaría que agendemos una reunión para discutir tu proyecto?"
        }
        if (message.includes("app") || message.includes("aplicación") || message.includes("móvil")) {
          return "El desarrollo de una aplicación móvil suele tener un costo desde 8.000€ para versiones básicas, mientras que aplicaciones más complejas o con funcionalidades avanzadas pueden requerir inversiones desde 15.000€. El precio final depende de factores como plataformas (iOS/Android), complejidad de diseño, integraciones y funcionalidades. ¿Te gustaría recibir un presupuesto personalizado?"
        }
        if (message.includes("proyecto") || message.includes("desarrollo") || message.includes("software")) {
          return "El costo de desarrollo varía según la complejidad, funcionalidades y plataformas. Una aplicación básica puede comenzar desde 15.000€, mientras que proyectos más complejos pueden requerir una inversión mayor. Ofrecemos presupuestos personalizados basados en tus requisitos específicos. ¿Te gustaría agendar una reunión para discutir tu proyecto y recibir una cotización detallada?"
        }
      }

      // Buscar la categoría más relevante
      let bestCategory = null
      let bestScore = 0

      for (const category in knowledgeBase) {
        const keywords = knowledgeBase[category].keywords
        const score = calculateRelevance(message, keywords)

        if (score > bestScore) {
          bestScore = score
          bestCategory = category
        }
      }

      // Si encontramos una categoría relevante
      if (bestCategory && bestScore > 0.1) {
        const categoryData = knowledgeBase[bestCategory]

        // Buscar la respuesta más relevante dentro de la categoría
        let bestResponse = null
        let bestResponseScore = 0

        for (const response of categoryData.responses) {
          const score = calculateRelevance(message, response.question)

          if (score > bestResponseScore) {
            bestResponseScore = score
            bestResponse = response.answer
          }
        }

        // Si encontramos una respuesta específica con buena puntuación
        if (bestResponse && bestResponseScore > 0.15) {
          // Reducir el umbral para ser más tolerante
          return bestResponse
        }

        // Si no hay una respuesta específica, usar el fallback de la categoría
        return categoryData.fallback
      }

      // Respuesta por defecto si no encontramos nada relevante
      return "No he podido entender completamente tu pregunta. Puedes intentar reformularla o ser más específico. Algunas preguntas que puedo responder son:\n- ¿Qué servicios ofrecen?\n- ¿Cuánto cuesta desarrollar una app o web?\n- ¿Cómo es su proceso de desarrollo?\n\nTambién puedes contactarnos directamente en info@globalcode.com o agendar una reunión desde nuestra página principal."
    }

    // Función para mostrar indicador de escritura
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

    // Función para ocultar indicador de escritura
    function hideTypingIndicator() {
      const typingIndicator = document.getElementById("typing-indicator")
      if (typingIndicator) {
        typingIndicator.remove()
      }
    }

    // Función para añadir mensaje al chat
    function addMessage(text, type) {
      const messageDiv = document.createElement("div")
      messageDiv.className = `chatbot-message ${type}`

      // Convertir saltos de línea en HTML para mejor formato
      text = text.replace(/\n/g, "<br>")
      messageDiv.innerHTML = text

      chatbotMessages.appendChild(messageDiv)
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight
    }

    // Función para enviar mensaje
    function sendMessage() {
      const message = chatbotInput.value.trim()
      if (message) {
        // Añadir mensaje del usuario
        addMessage(message, "user")

        // Limpiar input y resetear altura
        chatbotInput.value = ""
        chatbotInput.style.height = "auto"

        // Mostrar indicador de escritura
        showTypingIndicator()

        // Generar respuesta con un pequeño retraso para simular procesamiento
        setTimeout(
          () => {
            // Ocultar indicador de escritura
            hideTypingIndicator()

            // Generar respuesta basada en el mensaje del usuario
            const response = generateResponse(message)
            addMessage(response, "assistant")
          },
          1000 + Math.random() * 1000,
        ) // Retraso aleatorio entre 1-2 segundos para parecer más natural
      }
    }

    // Event listeners
    chatbotToggle.addEventListener("click", () => {
      chatbotPanel.style.display = "flex" // Cambio de block a flex para mantener la estructura
      chatbotInput.focus()
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight
    })

    chatbotClose.addEventListener("click", () => {
      chatbotPanel.style.display = "none"
    })

    chatbotSend.addEventListener("click", sendMessage)

    chatbotInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault() // Evitar el salto de línea por defecto
        sendMessage()
      }
    })

    // Ajustar la altura del textarea dinámicamente cuando el usuario escribe
    chatbotInput.addEventListener("input", () => {
      chatbotInput.style.height = "auto"
      chatbotInput.style.height = Math.min(chatbotInput.scrollHeight, 100) + "px"
    })

    // Detectar cambios de tamaño de ventana para ajustar el chatbot
    window.addEventListener("resize", () => {
      if (chatbotPanel.style.display !== "none") {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight
      }
    })
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
