import { IMail } from "../../domain/interfaces/mail.interface";
import { MailRepositoryImpl } from "../repositories/mail.repository.impl";

export class MailService {
  private mailRepository: MailRepositoryImpl;

  constructor() {
    this.mailRepository = new MailRepositoryImpl();
  }

  async saveMail(to: string, subject: string, template: string, payload: object) {
    const mail: IMail = { to, subject, template, payload };
    const savedMail = await this.mailRepository.saveMail(mail);

    if (savedMail) {
      console.log("✅ Correo guardado en la base de datos:", savedMail);
    } else {
      console.error("❌ No se pudo guardar el correo en la base de datos.");
    }

    return savedMail;
  }
}
