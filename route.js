import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req) {
  try {
    const { messages } = await req.json();
    
    // Configurar el contexto del asistente
    const systemMessage = {
      role: "system",
      content: "Eres un asistente virtual de Global Code, una empresa de desarrollo de software. Eres amable, profesional y conciso. Ayudas a los usuarios con información sobre servicios, proyectos y consultas generales. Si no sabes algo, indícalo honestamente y ofrece alternativas de contacto."
    };
    
    // Añadir el mensaje del sistema al principio
    const allMessages = [systemMessage, ...messages];
    
    // Generar respuesta usando AI SDK
    const result = streamText({
      model: openai('gpt-3.5-turbo'),
      messages: allMessages,
    });
    
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error en el chatbot:', error);
    return new Response(JSON.stringify({ error: 'Error al procesar la solicitud' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
