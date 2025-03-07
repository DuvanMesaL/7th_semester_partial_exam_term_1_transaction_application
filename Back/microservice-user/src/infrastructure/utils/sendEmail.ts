import axios from "axios";
import { logEvent } from "./logEvent";

/**
 * Función para enviar emails a través del microservicio de mailing.
 * @param to - Dirección de correo del destinatario.
 * @param type - Tipo de correo a enviar ("welcome", "transaction", "transfer").
 * @param payload - Contenido del email en formato JSON.
 */
export const sendEmail = async (to: string, type: "welcome" | "transaction" | "transfer", payload: any): Promise<void> => {
  try {
    // 📌 Mapear la ruta correcta según el tipo de email
    let emailRoute = "";
    switch (type) {
      case "welcome":
        emailRoute = "/send-welcome";  // ✅ Asegurar que coincide con `mail.routes.ts`
        break;
      case "transaction":
        emailRoute = "/send-transaction";  // ✅ Asegurar que coincide con `mail.routes.ts`
        break;
      case "transfer":
        emailRoute = "/send-transfer";  // ✅ Asegurar que coincide con `mail.routes.ts`
        break;
      default:
        throw new Error(`Tipo de email inválido: ${type}`);
    }

    // 📌 Enviar el email al microservicio de mailing con la ruta correcta
    const url = `http://localhost:3003${emailRoute}`;
    await logEvent("email", "INFO", `Enviando email a: ${to} - Tipo: ${type} - URL: ${url}`);
    
    const response = await axios.post(url, { to, payload });

    await logEvent("email", "INFO", `Email enviado correctamente a: ${to} - Respuesta: ${JSON.stringify(response.data)}`);
  } catch (error: any) {
    await logEvent("email", "ERROR", `Error al enviar email a ${to}: ${error.message}`);
  }
};
