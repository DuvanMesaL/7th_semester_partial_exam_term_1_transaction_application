import fetch from "node-fetch";

export const logAction = async (service: string, message: string) => {
  try {
    await fetch("http://logs-service/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service, message }),
    });
    console.log(`📌 Log enviado: ${message}`);
  } catch (error) {
    console.error("❌ Error enviando log:", error);
  }
};
