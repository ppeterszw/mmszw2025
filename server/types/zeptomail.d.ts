declare module 'zeptomail' {
  export class SendMailClient {
    constructor(config: { url: string; token: string });
    sendMail(mailData: any): Promise<any>;
  }
}