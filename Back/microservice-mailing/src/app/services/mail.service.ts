import { IMail } from "../../domain/interfaces/mail.interface";
import { MailRepositoryImpl } from "../repositories/mail.repository.impl";

export class MailService {
  private mailRepository: MailRepositoryImpl;

  constructor() {
    this.mailRepository = new MailRepositoryImpl();
  }

  async saveMail(to: string, subject: string, template: string, payload: object) {
    const mail: IMail = { to, subject, template, payload };
    return await this.mailRepository.saveMail(mail);
  }
}
