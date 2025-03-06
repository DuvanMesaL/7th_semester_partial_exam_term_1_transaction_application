import fs from "fs";
import path from "path";

/**
 * 📌 Carga una plantilla de correo y reemplaza las variables dinámicas con los valores del payload.
 */
export function loadTemplate(templateName: string, payload: Record<string, string>): string {
  const templatePath = path.join(__dirname, "../../templates", `${templateName}.html`);

  // Verificar si el archivo existe
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template ${templateName} no encontrado en ${templatePath}`);
  }

  let template = fs.readFileSync(templatePath, "utf8");

  // Reemplazar variables en el template
  Object.keys(payload).forEach((key) => {
    template = template.replace(new RegExp(`{{${key}}}`, "g"), payload[key]);
  });

  return template;
}
