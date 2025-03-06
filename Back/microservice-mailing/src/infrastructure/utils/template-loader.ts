import fs from "fs";
import path from "path";

export const loadTemplate = (templateName: string): string => {
  const filePath = path.join(__dirname, `../../templates/${templateName}.html`);
  return fs.readFileSync(filePath, "utf8");
};
