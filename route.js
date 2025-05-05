import { streamText, generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req) {
  try {
    const { messages, useStream = true } = await req.json()

    // Configurar el contexto del asistente con información detallada sobre Global Code
    const systemMessage = {
      role: "system",
      content: `Eres un asistente virtual de Global Code, una empresa de desarrollo de software. Eres amable, profesional y conciso. Ayudas a los usuarios con información sobre servicios, proyectos y consultas generales.

Información sobre Global Code:
- Servicios: Desarrollo Web, Web Apps, Apps Móviles, Automatizaciones con IA
- Ubicación: Barcelona, España
- Contacto: itsglobalcodeinfo@gmail.com, +34 628 38 32 04
- Tecnologías: React, Angular, Vue.js, Node.js, Python, React Native, Flutter, AWS, Google Cloud
- Proceso de desarrollo: Metodologías ágiles, desarrollo iterativo, comunicación constante
- Precios: Varían según el proyecto, pero una app básica comienza desde 15.000€, sitios web desde 3.000€
- Tiempo de desarrollo: 2-3 meses para proyectos básicos, 4-6 meses para proyectos complejos

Si no sabes algo, indícalo honestamente y ofrece alternativas de contacto. Responde en español y sé útil, amable y profesional.`,
    }

    // Verificar si ya hay un mensaje del sistema en los mensajes recibidos
    const hasSystemMessage = messages.length > 0 && messages[0].role === "system"

    // Añadir el mensaje del sistema al principio si no existe
    const allMessages = hasSystemMessage ? messages : [systemMessage, ...messages]

    // Opciones comunes para ambos métodos
    const options = {
      model: openai("gpt-4o"),
      messages: allMessages,
      temperature: 0.7,
    }

    // Usar streaming o generación completa según la preferencia
    if (useStream) {
      // Generar respuesta usando streaming para experiencia en tiempo real
      const result = streamText(options)
      return result.toDataStreamResponse()
    } else {
      // Generar respuesta completa de una vez
      const { text } = await generateText(options)

      // Devolver la respuesta como JSON
      return new Response(JSON.stringify({ response: text }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }
  } catch (error) {
    console.error("Error en el chatbot:", error)

    // Proporcionar un mensaje de error detallado
    return new Response(
      JSON.stringify({
        error: "Error al procesar la solicitud",
        details: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
