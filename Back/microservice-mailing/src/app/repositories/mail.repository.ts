import { IMail } from "../../domain/interfaces/mail.interface";

export interface IMailRepository {
  saveMail(mail: IMail): Promise<IMail>;
}
