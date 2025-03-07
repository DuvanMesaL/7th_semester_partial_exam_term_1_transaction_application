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
    let emailRoute = "";
    switch (type) {
      case "welcome":
        emailRoute = "/send-welcome";
        break;
      case "transaction":
        emailRoute = "/send-transaction";
        break;
      case "transfer":
        emailRoute = "/send-transfer";
        break;
      default:
        throw new Error(`Tipo de email inválido: ${type}`);
    }

    const url = `http://localhost:3003/mail/${emailRoute}`;
    await logEvent("email", "INFO", `Enviando email a: ${to} - Tipo: ${type} - URL: ${url}`);
    
    const response = await axios.post(url, { to, payload });

    await logEvent("email", "INFO", `Email enviado correctamente a: ${to} - Respuesta: ${JSON.stringify(response.data)}`);
  } catch (error: any) {
    await logEvent("email", "ERROR", `Error al enviar email a ${to}: ${error.message}`);
  }
};
