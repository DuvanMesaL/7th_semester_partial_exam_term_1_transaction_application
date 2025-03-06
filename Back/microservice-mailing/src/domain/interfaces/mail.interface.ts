export interface IMail {
    to: string;
    subject: string;
    template: string;
    payload: object;
    sentAt?: Date;
  }
  