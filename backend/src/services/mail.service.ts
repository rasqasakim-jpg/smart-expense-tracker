import * as brevo from '@getbrevo/brevo';

export class MailService {
  private apiInstance: brevo.TransactionalEmailsApi;

  constructor() {
    this.apiInstance = new brevo.TransactionalEmailsApi();
    this.apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY as string
    );
  }


  async sendOTP(email: string, code: string) {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "OTP Verifikasi - Smart Expense Tracker";
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.sender = { name: "Smart Expense Team", email: "justcall1313@gmail.com" };
    sendSmtpEmail.textContent = `Kode OTP Anda adalah: ${code}. Berlaku selama 5 menit.`;

    return await this.apiInstance.sendTransacEmail(sendSmtpEmail);
  }
}