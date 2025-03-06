import { MailModel } from "../../domain/entitites/mail.entity";
import { IMail } from "../../domain/interfaces/mail.interface";
import { IMailRepository } from "./mail.repository";

export class MailRepositoryImpl implements IMailRepository {
  async saveMail(mail: IMail): Promise<IMail> {
    const newMail = new MailModel(mail);
    return await newMail.save();
  }
}
