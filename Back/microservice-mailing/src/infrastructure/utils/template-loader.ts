import fs from "fs";
import path from "path";

export function loadTemplate(templateName: string, payload: Record<string, string>): string {
  const templatePath = path.join(__dirname, "../../templates", `${templateName}.html`);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template ${templateName} no encontrado en ${templatePath}`);
  }

  let template = fs.readFileSync(templatePath, "utf8");

  Object.keys(payload).forEach((key) => {
    template = template.replace(new RegExp(`{{${key}}}`, "g"), payload[key]);
  });

  return template;
}
