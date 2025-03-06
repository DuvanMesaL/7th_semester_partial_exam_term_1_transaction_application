import axios from "axios";

const LOGS_SERVICE_URL = process.env.LOGS_SERVICE_URL || "http://localhost:3004/logs";

const validLevels = ["INFO", "WARNING", "ERROR"];

export const logEvent = async (service: string, type: string, content: string) => {
    try {
        // Si el "type" no es válido, lo cambiamos a INFO
        const level = validLevels.includes(type) ? type : "INFO";

        await axios.post(LOGS_SERVICE_URL, {
            service,
            level,  // Usamos el nivel corregido
            message: content,
            data: {}
        });
    } catch (error) {
        console.error("Error sending log:", error);
    }
};
