import axios from "axios";
import { logEvent } from "./logEvent";

/**
 * Función para enviar emails a través del microservicio de mailing.
 * @param senderEmail - Dirección de correo del remitente (para transferencias).
 * @param receiverEmail - Dirección de correo del destinatario.
 * @param type - Tipo de correo a enviar ("welcome", "transaction", "transfer").
 * @param payload - Contenido del email en formato JSON.
 */
export const sendEmail = async (
  senderEmail: string | null,
  receiverEmail: string,
  type: "welcome" | "transaction" | "transfer",
  payload: any
): Promise<void> => {
  try {
    console.log("📤 Enviando email con los siguientes datos:");
    console.log({
      senderEmail,
      receiverEmail,
      type,
      payload,
    });

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
        throw new Error("Tipo de email inválido.");
    }

    const data =
      type === "transfer"
        ? { senderEmail, receiverEmail, payload }
        : { to: receiverEmail, payload };

    const response = await axios.post(`http://localhost:3003/mail${emailRoute}`, data);

    console.log("✅ Petición enviada con éxito a mailing:", response.data);
  } catch (error: any) {
    console.error("❌ Error enviando email:", error.response?.data || error.message);
    await logEvent("email", "ERROR", `Error al enviar email a ${receiverEmail}: ${error.message}`);
  }
};
